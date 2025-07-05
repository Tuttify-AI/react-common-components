import * as React from 'react';
import AgoraRTCProvider from './providers/AgoraRTCProvider';
import JanusRTCProvider from './providers/JanusRTCProvider';
import throttle from 'lodash/throttle';
import NoSleep from 'nosleep.js';
import { Component } from 'react';
import { isNil, remove, flatten, uniqBy } from 'ramda';
import { interval, Subscription, fromEvent, from, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { mergeMap, concatMap, startWith, first, tap } from 'rxjs/operators';
import { log } from './utils/log';
import { VideoTrackContainer } from './components/VideoTrackContainer';
import { getDevices, selectDefaultMicrophone } from './utils/getDevices';
import { ContextMenu } from './components/ContextMenu';
import { VideoChatV2WrapperProps } from './VideoChatV2Wrapper';
import { AgoraBlipConfig, BlipTrack, JanusBlipConfig } from './types';
import { Controls } from './components/Controls';
import { getContainerStyle } from './utils/getContainerStyle';
import { getElementStyle } from './utils/getElementStyle';
import { onError } from './utils/onError';
import { ensureMediaPermissions } from './utils/ensureMediaPermissions';
import { verifyDevice } from './utils/verifyDevice';
import { isMobile } from './utils/isMobile';
import { pause } from './utils/pause';
import { Detection, JanusClient } from './providers/janus-client';

const isOnline = require('is-online');
const lock = new BehaviorSubject<boolean>(false);
let remounted = 0;

// mobile UI (ifvisible.js)
// review select video device
// review select audio device
// context menu - fully functional
// on device change behavior

interface VideoChatV2Props extends VideoChatV2WrapperProps {
  orientation: number;
  containerWidth: number;
  containerHeight: number;
  showContextMenu: boolean;
  contextMenuX: number;
  contextMenuY: number;
  onCloseContextMenu: () => void;
  remount: () => void;
}

interface VideoChatV2State {
  loading: boolean;
  connectedToNetwork: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  error: string | null;
  tracks: BlipTrack[];
  audioDeviceId: string | null;
  videoDeviceId: string | null;
}

export class VideoChatV2 extends Component<VideoChatV2Props, VideoChatV2State> {
  container: HTMLElement;
  subscriptions: Subscription[];
  provider: JanusRTCProvider | AgoraRTCProvider;
  mounted: boolean;
  actions: Subject<Promise<any>>;
  noSleep: NoSleep;
  lockSub: Subscription | undefined;
  lastOnline: number;
  showDetections: boolean;
  detectionsEmotions: Subject<Detection<any>>;
  detectionsOpenpose: Subject<Detection<any>>;

  constructor(props) {
    super(props);

    this.mounted = false;

    this.actions = new Subject();

    this.detectionsEmotions = new Subject();

    this.detectionsOpenpose = new Subject();

    this.noSleep = new NoSleep();

    this.showDetections = false;

    this.state = {
      loading: false,
      connectedToNetwork: true,
      error: null,
      audioEnabled: true,
      videoEnabled: true,
      tracks: [],
      audioDeviceId: null,
      videoDeviceId: null,
    };

    this.lastOnline = Date.now();

    this.subscriptions = [];
  }

  componentDidMount() {
    this.mounted = true;

    this.subscribeUnlocked(() => this.initialize(), 'initialize');
  }

  componentWillUnmount() {
    this.mounted = false;

    this.subscribeUnlocked(() => this.cleanup(), 'cleanup');
  }

  dispatch = (action: Promise<any>) => {
    this.actions.next(action);
  };

  setStateP = (state: Partial<VideoChatV2State>) =>
    new Promise(resolve => {
      const t = setTimeout(() => {
        resolve(null);
      }, 500);

      this.setState(state as any, () => {
        clearTimeout(t);

        resolve(null);
      });
    });

  initialize = async () => {
    log.info(`initializing...`);

    const { provider, onJoined, onInfo } = this.props;

    this.observe();

    await this.setStateP({
      loading: true,
    });

    try {
      log.info(`ensuring media permissions...`);

      const result = await ensureMediaPermissions();

      log.info(`ensuring media permissions...done...`);

      if (result.audio_permission_denied) {
        const error = new Error(`${this.props?.user?.id} microphone permission denied`);
        this.props.onError(error);
      }

      if (result.video_permission_denied) {
        const error = new Error(`${this.props?.user?.id} camera permission denied`);
        this.props.onError(error);
      }

      if (result.audio_permission_denied && result.video_permission_denied) {
        const error = new Error(`${this.props?.user?.id} denied permission`);
        throw error;
      }
    } catch (error) {
      onError(error, 'ensuring media permissions');

      onInfo(error.message);

      this.props.onError(error);

      this.leaveRoom();

      return;
    }

    let devices: {
      videoDevices: MediaDeviceInfo[];
      audioDevices: MediaDeviceInfo[];
    } | null = null;

    try {
      log.info(`getting devices...`);

      devices = await getDevices();

      log.info(`getting devices...done...`);
    } catch (error) {
      onError(error, 'get devices');

      onInfo(error.message);

      this.props.onError(error);

      this.leaveRoom();

      return;
    }

    const dm = selectDefaultMicrophone(devices?.audioDevices);

    if (!dm) {
      log.info(`no default microphone user_id ${this.props?.user?.id}`);
    }

    await this.setStateP({
      audioDeviceId: (dm || devices.audioDevices[0])?.deviceId,
      videoDeviceId: devices.videoDevices[0]?.deviceId,
    });

    if (!this.mounted) {
      log.info(`already unmounted... return...`);
      return;
    }

    this.provider = this.getProvider(provider) as AgoraRTCProvider | JanusRTCProvider;

    try {
      log.info(`begun initializing provider...`);

      await this.provider.initialize();

      log.info(`initializing provider done...`);

      if (onJoined) {
        onJoined();
      }
    } catch (error) {
      if (provider === 'janus') {
        this.onJanusError(error, 'connect');
      } else {
        onError(error);

        this.props.onError(error);
      }
    }

    await this.setStateP({
      loading: false,
    });

    // TODO remove delay - use particular event instead
    await pause(3000);

    try {
      const client = this.provider.client as JanusClient;

      if (client?.publisher?.publishing) {
        await this.provider.forward();
      }
    } catch (error) {
      onError(error);
    }
  };

  cleanup = async () => {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    this.subscriptions = [];

    if (this.state.tracks.length != 0) {
      await this.setStateP({
        tracks: [],
      });
    }

    if (this.noSleep && this.noSleep.isEnabled) {
      try {
        this.noSleep.disable();
      } catch (error) {
        onError(error, 'no sleep');
      }
    }

    if (!this.provider) {
      log.error('no provider on cleanup...');
      return;
    }

    try {
      await this.provider.suspend();

      this.provider = null as any;
    } catch (error) {
      onError(error, 'cleanup');

      this.props.onError(error);
    }
  };

  observe = () => {
    this.subscriptions.push(
      combineLatest([this.detectionsOpenpose, this.detectionsEmotions]).subscribe(([openpose, emotions]) => {
        if (!openpose || !emotions) {
          return;
        }

        const user_id = openpose?.user_id || emotions?.user_id;

        const canvas = document.getElementById(`canvas-${user_id}`) as HTMLCanvasElement;

        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          this.drawDetectionsOpenpose(openpose, canvas);
          this.drawDetectionsEmotions(emotions, canvas);
        }
      }),

      this.actions.pipe(concatMap(p => from(p))).subscribe(result => {}),

      fromEvent(window, 'beforeunload').subscribe(() => this.cleanup()),

      fromEvent(navigator.mediaDevices, 'devicechange').subscribe(event => this.onDeviceChange(event)),

      interval(5000)
        .pipe(
          startWith(0),
          mergeMap(() => from(isOnline()))
        )
        .subscribe((connectedToNetwork: boolean) => this.onNetworkChange(connectedToNetwork))
    );
  };

  onDeviceChange = event => {
    log.info('ondevicechange', event);
  };

  onNetworkChange = (connectedToNetwork: boolean) => {
    if (this.state.connectedToNetwork === connectedToNetwork) {
      return;
    }

    const restartThreshold = 30000;
    const connectionLost = this.state.connectedToNetwork && !connectedToNetwork;
    const connectionRegained = !this.state.connectedToNetwork && connectedToNetwork;

    if (connectionLost) {
      log.error('network connection lost');
      this.lastOnline = Date.now();
    } else if (connectionRegained) {
      const timeOffline = Date.now() - this.lastOnline;
      if (timeOffline > restartThreshold) {
        log.error('restart after connection recovered');
        this.props.remount();
      }
    }

    this.setState({
      connectedToNetwork,
    });
  };

  getProvider = (provider: 'agora' | 'janus') => {
    const { user } = this.props;

    if (provider !== 'agora' && provider !== 'janus') {
      throw new Error(`unknown provider ${provider}`);
    }

    if (!user || !user.id) {
      throw new Error('user object is not supplied');
    }

    if (provider === 'agora') {
      return this.getAgoraProvider();
    } else if (provider === 'janus') {
      return this.getJanusProvider();
    }
  };

  roundRect = (ctx, x, y, width, height, radius, color, stroke) => {
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (const side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    ctx.fillStyle = color;

    if (stroke) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
    } else {
      ctx.fill();
    }
  };

  drawDetectionsEmotions = (data, canvas) => {
    const ctx = canvas.getContext('2d');

    const fontSize = 10;

    ctx.font = `${fontSize}px Arial`;

    ctx.strokeStyle = 'green';

    const first = data.predictions.detections[0];

    if (first) {
      const { x, y, w, h, age, gender, disgust, angry, fear, happy, neutral, sad, surprise } = first;

      const emotions = {
        disgust,
        angry,
        fear,
        happy,
        neutral,
        sad,
        surprise,
      };
      // let width = w / 416;
      // let height = h / 416;
      // let elWidth = width * canvas.width;
      // let elHeight = height * canvas.height;
      const elX = (x / 416) * canvas.width;
      const elY = (y / 416) * canvas.height;

      const d = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);

      ctx.beginPath();
      ctx.arc(elX, elY, d / 5, 0, Math.PI * 2, true);
      ctx.stroke();

      // ctx.strokeRect(
      //     elX - elWidth / 2,
      //     elY - elHeight / 2,
      //     elWidth,
      //     elHeight
      // );

      const entries: [string, number][] = Object.entries(emotions);
      let offsetY = 30;
      const offsetX = 10;
      const rectX = 10;
      const rectY = 20;
      const width = canvas.width / 3.5;
      const height = fontSize * 10;
      const radius = 3;

      this.roundRect(ctx, rectX, rectY, width, height, radius, `rgba(200, 200, 200, 0.65)`, false);

      for (const [key, val] of entries) {
        ctx.fillStyle = 'green';
        ctx.fillText(`${key}: ${Math.round(val * 100)}%`, offsetX, offsetY);
        offsetY += 10;
      }

      ctx.fillStyle = 'orange';
      ctx.fillText(`age: ${age}`, offsetX, offsetY);

      offsetY += 10;

      ctx.fillStyle = 'blue';
      ctx.fillText(`gender: ${gender}`, offsetX, offsetY);
    }

    // data.predictions.forEach(({
    //     x, y, w, h,
    //     disgust,
    //     angry,
    //     fear,
    //     happy,
    //     neutral,
    //     sad,
    //     surprise
    // }, index) => {});
  };

  drawDetectionsOpenpose = (data, canvas) => {
    const ctx = canvas.getContext('2d');

    const fontSize = 9;

    ctx.font = `${fontSize}px Arial`;

    ctx.strokeStyle = 'green';

    interface OpenposeBodyPart {
      location: [number, number];
      name: string;
      probability: number;
    }

    const result: {
      center: [number, number];
      connected_body_parts: [OpenposeBodyPart, OpenposeBodyPart][];
    } = data.predictions.detections;

    for (const pair of result.connected_body_parts) {
      const part_a = pair[0];
      const part_b = pair[1];
      const prob_a = Number(part_a.probability);
      const prob_b = Number(part_b.probability);

      if (prob_a < 0.5 || prob_b < 0.5) {
        continue;
      }

      const part_a_loc = part_a.location;
      const part_b_loc = part_b.location;
      const x_norm_a = part_a_loc[0];
      const y_norm_a = part_a_loc[1];
      const x_norm_b = part_b_loc[0];
      const y_norm_b = part_b_loc[1];
      const x_a = x_norm_a * canvas.width;
      const y_a = y_norm_a * canvas.height;
      const x_b = x_norm_b * canvas.width;
      const y_b = y_norm_b * canvas.height;
      ctx.beginPath();
      ctx.moveTo(x_a, y_a);
      ctx.lineTo(x_b, y_b);
      ctx.stroke();
      // ctx.fillStyle = 'green';
      // ctx.fillText(`${key}: ${Math.round(val * 100)}%`, offsetX, offsetY);
    }

    ctx.strokeStyle = 'red';
    ctx.fillStyle = '#ff0000';

    const parts = flatten(result.connected_body_parts);

    const uniq_parts: OpenposeBodyPart[] = uniqBy(part => part.name, parts);

    for (const element of uniq_parts) {
      const prob = Number(element.probability);

      if (prob < 0.5) {
        continue;
      }

      const x = element.location[0] * canvas.width;
      const y = element.location[1] * canvas.height;
      const offset = 5;

      ctx.fillText(`${element.name}`, x + offset, y + offset);
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  getJanusProvider = () => {
    const { janusConfig, user, onParticipantConnected, onParticipantDisconnected, onReconnect } = this.props;

    if (isNil(janusConfig)) {
      const error = new Error('janus configuration is not provided');
      onError(error, 'getJanusProvider');
      throw error;
    }

    const { appid, channel, token, server, rtcConfiguration, websocketOptions, transactionTimeout, keepAliveInterval } =
      janusConfig as JanusBlipConfig;

    if (!appid || !channel || !token) {
      const error = new Error('janus configuration is invalid');
      onError(error, 'getJanusProvider');
      throw error;
    }

    return new JanusRTCProvider({
      rtcConfiguration,
      websocketOptions,
      transactionTimeout,
      keepAliveInterval,
      janus_room_id: channel,
      user_id: user.id,
      token,
      appid,
      server,
      audioDeviceId: this.state.audioDeviceId,
      videoDeviceId: this.state.videoDeviceId,
      callbacks: {
        onClosed: () => {
          log.warn('onClosed', `${channel} closed`);

          this.endCall();
        },
        onMigrate: () => {
          this.props.remount();
        },
        onParticipantConnected: (participant: any) => {
          log.success('onParticipantConnected', participant);

          if (onParticipantConnected) {
            onParticipantConnected(participant);
          }
        },
        onIceDisconnected: (participant: any) => {
          log.info('onIceDisconnected', participant);
        },
        onParticipantDisconnected: (participant: any) => {
          log.info('onParticipantDisconnected', participant);

          if (onParticipantDisconnected) {
            onParticipantDisconnected(participant);
          }
        },
        onReconnect: (error: any) => {
          onError(error, 'onReconnect');

          log.info('onReconnect', error);

          if (onReconnect) {
            onReconnect(error);
          }
        },
        onDetection: (data: Detection<any>) => {
          if (!data || !this.showDetections) {
            return;
          }

          if (data.source && data.source.includes('openpose')) {
            this.detectionsOpenpose.next(data);
          } else {
            if (data?.predictions?.status != 'ok') {
              return;
            }

            const result: any[] = [];

            for (const el of data.predictions.detections) {
              const p = {};
              for (const [k, v] of Object.entries(el)) {
                const key = k.replace(/[^a-zA-Z0-9]+/g, '');
                if (isNaN(Number(v))) {
                  p[key] = v;
                } else {
                  p[key] = Number(v);
                }
                result.push(p);
              }
            }

            data.predictions.detections = result;

            this.detectionsEmotions.next(data);
          }
        },
        onInternal: message => {
          const iceFailed = message?.load?.janus === 'hangup' && message?.load?.reason === 'ICE failed';

          if (iceFailed && remounted <= 2) {
            remounted += 1;
            log.error(`[${this.props.user.id}] ice have failed - lets remount`);
            this.props.remount();
          }
        },
        addTrack: this.addTrack,
        removeTrack: this.removeTrack,
        onError: (error: any) => {
          this.onJanusError(error, 'getJanusProvider');
        },
        onDisconnected: (error: any) => this.onJanusDisconnected(error),
      },
    });
  };

  onJanusError = (error, _?) => {
    if (!error || !error.message) {
      const error = new Error('empty');
      onError(error, `[${this.props.user.id}] onJanusError: error is undefined!`);
      this.props.onError(error);
      return;
    }

    if (!this.mounted) {
      const error = new Error(`[${this.props.user.id}] onJanusError: error but component is unmounted!`);
      onError(error);
      this.props.onError(error);
      return;
    }

    const ignore = error.message.includes('cancel');

    if (ignore) {
      return;
    }

    const knownIssues =
      error.message.toLowerCase().includes('no such room') ||
      error.message.toLowerCase().includes('no such feed') ||
      error.message.toLowerCase().includes('unexpected answer') ||
      error.message.toLowerCase().includes('load') ||
      error.message.toLowerCase().includes('janusrtcprovider') ||
      error.message.toLowerCase().includes('joinandconfigure');

    const deviceError = error.message.includes('device not found') || error.message.includes('start video source');

    const permissionError = error.message.includes('denied permission') || error.message.includes('not allowed');

    const iceError = error.message.toLowerCase().includes('error setting ice locally');
    const connectionLost = error.message === 'lost connection';
    const probablyReconnection = error.message === 'lost connection - connection closed';
    const jwtExpired = error.message === 'lost connection - jwt_expired';
    //timeout can be caused by server trouble or by local network loss
    const timeout = error.message.toLowerCase().includes('timeout');
    const invalidJson = error.message.includes('at position');
    const duplicateCleanup = error.message.includes("Can't unpublish, not published");
    const roomDoesNotExist1 = error.message.includes('instance_id') && error.message.includes('undefined');
    const roomDoesNotExist2 = error.message.includes('does not exist') && error.message.includes('room');
    const roomDoesNotExist3 = error.message.includes('does not exist') && error.message.includes('instance');
    const roomDoesNotExist = roomDoesNotExist1 || roomDoesNotExist2 || roomDoesNotExist3;
    const roomOccupied = error.message.includes('Maximum number of publishers') && error.message.includes('432');
    // we are trying to perform transaction after on janus client but connected is set to false
    const transactionAttemptInDisconnectedState =
      error.message === 'client should be initialized before you can make transaction';

    const provider = this.provider as JanusRTCProvider;
    const providerSuspended = provider?.suspended;
    //client will be undefined in case provider already in suspended state

    if (duplicateCleanup) {
      // ignore
      return;
    }

    if (permissionError) {
      const msg = `
                Permission denied. [user id ${this.props.user.id}]
                If you still want to join this call please allow application to access
                video camera and microphone by changing browser settings and restart the call.
            `;
      this.setState({
        error: msg,
      });
      onError(error);
      this.props.onError(error);
      return;
    }

    if (deviceError) {
      const msg = `media devices connectivity failure [user id ${this.props.user.id}]`;
      this.setState({
        error: msg,
      });
      onError(error);
      this.props.onError(error);
      return;
    }

    if (jwtExpired) {
      this.setState({
        error: error.message,
      });
      onError(error);
      this.props.onError(error);
      return;
    }

    if (roomDoesNotExist) {
      const janus_room_id = this.props?.janusConfig?.channel;
      const msg = `room ${janus_room_id} does not exist [user id ${this.props.user.id}]`;
      this.setState({
        error: msg,
      });
      let data_info = ``;
      try {
        data_info = JSON.stringify(this.props?.janusConfig);
      } catch (error) {}
      onError(
        error,
        `
                [${this.props.user.id}]
                onJanusError - room does not exist, used janus room id is ${janus_room_id}
                additional info: \n
                ${data_info}
            `
      );
      this.props.onError(error);
      return;
    }

    if (roomOccupied) {
      const msg = `maximum number of publishers already reached [user id ${this.props.user.id}]`;
      this.setState({
        error: msg,
      });
      onError(error);
      this.props.onError(error);
      this.leaveRoom();
      return;
    }

    // error reported after provider already in suspended state
    if (providerSuspended) {
      this.props.onError(error);
      onError(
        error,
        `[${this.props.user.id}] onJanusError - provider already suspended - ignoring error, but still submit ${error.message}`
      );
    } else {
      if (timeout) {
        onError(error, `[${this.props.user.id}] onJanusError - timeout - do nothing, ${error.message}`);
        this.props.onError(error);
        if (
          error.message &&
          (error.message.includes('joinandconfigure') ||
            error.message.includes('join') ||
            error.message.includes('attach'))
        ) {
          this.leaveRoom();
        }
        return;
      }

      if (invalidJson) {
        onError(error);
        this.props.onError(error);
        return;
      }

      if (iceError) {
        onError(error);
        this.props.onError(error);
        this.leaveRoom();
        return;
      }

      if (connectionLost) {
        onError(
          error,
          `[${this.props.user.id}] onJanusError - connection lost - lets see what is going to happen, ${error.message}`
        );
        this.props.onError(error);
        this.leaveRoom();
        return;
      }

      if (transactionAttemptInDisconnectedState) {
        onError(
          error,
          `[${this.props.user.id}] onJanusError - transaction attempt in disconnected state, ${error.message}`
        );
        this.props.onError(error);
        return;
      }

      if (!probablyReconnection && !knownIssues) {
        this.setState({
          error: error.message,
        });
        onError(error);
        this.props.onError(error);
      }
    }
  };

  onJanusDisconnected = (error: any) => {
    onError(error, 'onJanusDisconnected');

    const { onDisconnected } = this.props;

    if (onDisconnected) {
      onDisconnected(error);
    }

    this.leaveRoom();
  };

  getAgoraProvider = () => {
    const {
      agoraConfig,
      user,
      onConnecting,
      onParticipantConnected,
      onParticipantDisconnected,
      onReconnect,
      onDisconnected,
    } = this.props;

    if (isNil(agoraConfig)) {
      const error = new Error('agora configuration is not provided');
      onError(error, 'getAgoraProvider');
      throw error;
    }

    const { appid, channel, token } = agoraConfig as AgoraBlipConfig;

    if (!appid || !channel || !token) {
      const error = new Error('agora configuration is invalid');
      onError(error, 'getAgoraProvider');
      throw error;
    }

    return new AgoraRTCProvider({
      user_id: user.id,
      app_id: appid,
      token,
      agora_channel: channel,
      micConfig: {
        AEC: true, //acoustic echo cancellation
        AGC: true, //audio gain control
        ANS: true, //automatic noise suppression
        // encoderConfig: {
        //     bitrate: 64000,
        //     sampleRate: 12000,
        //     sampleSize: 64,
        //     stereo: true
        // }
        microphoneId: this.state.audioDeviceId ?? undefined,
      },
      videoConfig: {
        cameraId: this.state.videoDeviceId ?? undefined,
        // encoderConfig: {
        //     bitrateMax: 64,
        //     bitrateMin: 10,
        //     frameRate: 30, //{ max: 30, min: 5 }
        //     height: 640, //{ max: 1280, min: 720 }
        //     width: 480, //{ max: 1280, min: 720 }
        // },
        facingMode: 'user', //"environment"
        optimizationMode: 'detail', //"motion"
      },
      callbacks: {
        onParticipantConnected: (participant: any) => {
          log.success('onParticipantConnected', participant);

          if (onParticipantConnected) {
            onParticipantConnected(participant);
          }
        },
        onParticipantDisconnected: (participant: any) => {
          log.info('onParticipantDisconnected', participant);

          if (onParticipantDisconnected) {
            onParticipantDisconnected(participant);
          }
        },
        onReconnect: (error: any) => {
          log.info('onReconnect', error);

          if (onReconnect) {
            onReconnect(error);
          }
        },
        addTrack: this.addTrack,
        removeTrack: this.removeTrack,
        onDisconnected: (error: any) => {
          log.info('onDisconnected', error);

          if (onDisconnected) {
            onDisconnected(error);
          }
        },
        onConnecting: () => {
          log.info('onConnecting');

          if (onConnecting) {
            onConnecting();
          }
        },
        onNetworkQuality: (event: any) => {
          log.info('onNetworkQuality', event);
        },
        onError: (error: any) => {
          onError(error, 'agora callback');

          this.props.onError(error);
        },
      },
    });
  };

  addTrack = (track: BlipTrack) => {
    if (track.type === 'audio') {
      if (track.provider === 'agora') {
        track.source.play();
      }
    } else if (track.type === 'video') {
      const index = this.state.tracks.findIndex(t => t.id == track.id);

      const missing = index === -1;

      if (missing) {
        const action = this.setStateP({
          tracks: [...this.state.tracks, track],
        });

        this.dispatch(action);
      } else {
        const load = [...this.state.tracks];

        load[index] = { ...track };

        const action = this.setStateP({
          tracks: load,
        });

        this.dispatch(action);
      }
    }
  };

  removeTrack = (uid: string) => {
    const target = this.state.tracks.findIndex(t => {
      if (typeof t.id == 'number') {
        return String(t.id).includes(uid);
      }

      return t.id.includes(uid);
    });

    if (target === -1) {
      return;
    }

    const tracks = remove(target, 1, this.state.tracks);

    const action = this.setStateP({
      tracks,
    });

    this.dispatch(action);
  };

  onToggleVideo = throttle(() => {
    const locked = lock.getValue();

    if (locked || !this.mounted) {
      return;
    }

    if (this.provider && this.state.connectedToNetwork) {
      const videoEnabled = !this.state.videoEnabled;

      const action = this.provider
        .toggleVideo({ enable: videoEnabled })
        .then(result => {
          if (result?.success) {
            this.setState({
              videoEnabled,
            });
          }
        })
        .catch(error => {
          onError(error, 'onToggleVideo');

          this.props.onError(error);
        });

      this.dispatch(action);
    }
  }, 1500);

  onToggleAudio = throttle(() => {
    const locked = lock.getValue();

    if (locked || !this.mounted) {
      return;
    }

    if (this.provider && this.state.connectedToNetwork) {
      const audioEnabled = !this.state.audioEnabled;

      const action = this.provider
        .toggleAudio({ mute: !audioEnabled })
        .then(result => {
          if (result?.success) {
            this.setState({
              audioEnabled,
            });
          }
        })
        .catch(error => {
          onError(error, 'onToggleAudio');

          this.props.onError(error);
        });

      this.dispatch(action);
    }
  }, 1500);

  // onForward = throttle(() => {

  //     let p = this.provider as JanusRTCProvider;

  //     return p.forward()
  //     .then((result) => {

  //         console.log(result);

  //         this.forwarding = true;

  //     })
  //     .catch((error) => {
  //         console.error(error);
  //         this.forwarding = false;
  //     });

  // }, 3000)

  // onStopForward = throttle(() => {

  //     let p = this.provider as JanusRTCProvider;

  //     return p.stopForward()
  //     .then((result) => {

  //         console.log(result);

  //         this.forwarding = false;

  //         const user_id = this.props?.user?.id;

  //         const canvas = document.getElementById(`canvas-${user_id}`) as HTMLCanvasElement;

  //         if (canvas) {
  //             const ctx = canvas.getContext('2d');
  //             ctx.clearRect(0, 0, canvas.width, canvas.height);
  //         }

  //     })
  //     .catch((error) => {
  //         console.error(error);
  //     });

  // }, 3000)

  endCall = throttle(() => {
    // this.leaveRoom();
  }, 3000);

  leaveRoom = () => {
    const { onLeaving } = this.props;

    if (onLeaving) {
      onLeaving();
    }
  };

  onSelectAudioDevice = async (d: MediaDeviceInfo) => {
    this.props.onCloseContextMenu();

    const good = await verifyDevice(d);

    if (!good) {
      return;
    }

    await this.provider.setAudioDevice(d.deviceId);

    this.setState({
      audioDeviceId: d.deviceId,
    });
  };

  onSelectVideoDevice = async (d: MediaDeviceInfo) => {
    this.props.onCloseContextMenu();

    const good = await verifyDevice(d);

    if (!good) {
      return;
    }

    await this.provider.setVideoDevice(d.deviceId);

    this.setState({
      videoDeviceId: d.deviceId,
    });
  };

  OfflineStatus = () => (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(100,100,100,0.6)',
        backdropFilter: 'blur(5px)',
        pointerEvents: 'none',
        color: 'white',
        fontSize: `${this.props.containerWidth / 15}px`,
        borderRadius: '16px',
        flexDirection: 'column',
      }}
    >
      <div>Connection lost.</div>
      <div>You are offline.</div>
    </div>
  );

  Loading = () => (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        borderRadius: '16px',
        background: 'rgba(100,100,100,0.6)',
      }}
    >
      Connecting...
    </div>
  );

  subscribeUnlocked = (action: () => Promise<void>, name: string) => {
    log.info(`[${name}] subscribeUnlocked...`);

    if (this.lockSub) {
      log.info(`[${name}] unsubscribe lockSub...`);
      this.lockSub.unsubscribe();
      this.lockSub = undefined;
    }

    const locked = lock.getValue();

    if (!locked) {
      lock.next(true);

      action()
        .catch(error => {
          onError(error, name);
        })
        .then(() => {
          log.info(`[${name}] completed... `);

          lock.next(false);
        });
    } else {
      this.lockSub = lock
        .pipe(
          tap(locked => {
            log.info(`[${name}] lock state change... locked - ${locked}...`);
          }),
          first(locked => !locked)
        )
        .subscribe(() => {
          log.info(`[${name}] lock state change... action... `);

          lock.next(true);

          action()
            .catch(error => {
              onError(error, name);
            })
            .then(() => {
              log.info(`[${name}] completed sub... `);

              lock.next(false);
            });
        });
    }
  };

  render() {
    const { getUser, provider, containerHeight, containerWidth, orientation } = this.props;

    const { tracks } = this.state;

    const mobile = isMobile();

    const vertical = orientation === 0;

    const containerStyle = getContainerStyle(tracks.length, containerHeight, containerWidth);

    const controlsStyle = mobile
      ? {
          display: `flex`,
          flexDirection: `row`,
          height: `30%`,
          alignItems: `center`,
          zIndex: 1000,
          justifyContent: vertical ? `space-between` : `space-evenly`,
        }
      : {
          display: `flex`,
          flexDirection: `row`,
          position: `absolute`,
          bottom: `5px`,
          left: `calc(50% - 62.5px)`,
          height: `52px`,
          alignItems: `center`,
          width: `125px`,
          borderRadius: `40px`,
          background: `rgb(158, 69, 255)`,
          zIndex: 1000,
          boxShadow: `rgb(0 0 0 / 20%) 0px 0px 8px 1px`,
          justifyContent: `space-between`,
        };

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: vertical ? '16px' : '0px',
          overflow: 'hidden',
          boxShadow: 'rgb(100 100 100 / 75%) 4px 11px 33px',
          background: mobile ? 'rgba(54, 52, 61, 1)' : 'rgba(0, 209, 212, 1)',
        }}
      >
        {!this.state.connectedToNetwork && this.OfflineStatus()}
        {this.state.error && this.state.error.length > 0 && !this.state.loading && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'red',
              borderRadius: '16px',
              background: 'rgba(100,100,100,0.6)',
            }}
          >
            {this.state.error}
          </div>
        )}
        {this.state.loading && this.state.connectedToNetwork && this.Loading()}
        {this.props.showContextMenu && (
          <ContextMenu
            onSelectAudioDevice={this.onSelectAudioDevice}
            onSelectVideoDevice={this.onSelectVideoDevice}
            selectedVideoDevice={this.state.videoDeviceId ?? ''}
            selectedAudioDevice={this.state.audioDeviceId ?? ''}
            contextMenuX={this.props.contextMenuX}
            contextMenuY={this.props.contextMenuY}
            close={this.props.onCloseContextMenu}
            onEndCall={this.endCall}
            onDisplayDetections={() => {
              this.showDetections = true;
            }}
            onHideDetections={() => {
              this.showDetections = false;

              const user_id = this.props?.user?.id;

              const canvas = document.getElementById(`canvas-${user_id}`) as HTMLCanvasElement;

              if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.clearRect(0, 0, canvas.width, canvas.height);
              }
            }}
            showDetections={this.showDetections}
            onReconnect={() => {
              this.props.remount();
            }}
            onSeeStats={() => {
              this.provider.getStats().then(stats => {
                log.info(stats);
              });
            }}
          />
        )}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          <div
            id="room"
            ref={e => {
              this.container = e as HTMLDivElement;
            }}
            style={containerStyle}
          >
            {this.state.tracks.map((track, index) => {
              const elementStyle = getElementStyle(tracks.length, index);

              return (
                <VideoTrackContainer
                  key={track.id}
                  track={track}
                  noSleep={this.noSleep}
                  orientation={this.props.orientation}
                  provider={provider}
                  getUser={getUser}
                  containerWidth={this.props.containerWidth}
                  containerHeight={this.props.containerHeight}
                  videoEnabled={this.state.videoEnabled}
                  local={track.uid == this.props.user?.id}
                  style={elementStyle}
                />
              );
            })}
          </div>
          <Controls
            audioEnabled={this.state.audioEnabled}
            videoEnabled={this.state.videoEnabled}
            onToggleAudio={this.onToggleAudio}
            onToggleVideo={this.onToggleVideo}
            endCall={this.endCall}
            style={{
              ...controlsStyle,
            }}
          />
        </div>
      </div>
    );
  }
}
