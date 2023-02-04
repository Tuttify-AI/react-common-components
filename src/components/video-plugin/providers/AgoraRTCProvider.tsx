import { fromEvent, Subscription } from 'rxjs';
import agora, {
  CameraVideoTrackInitConfig,
  ConnectionDisconnectedReason,
  ConnectionState,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteTrack,
  LocalAudioTrackStats,
  LocalVideoTrackStats,
  MicrophoneAudioTrackInitConfig,
} from 'agora-rtc-sdk-ng';

import { log } from '../utils/log';
import { waitUntil } from '../utils/waitUntil';
import { getDevices } from '../utils/getDevices';
import { BlipTrack } from '../types';
import { pause } from '../utils/pause';

const uuid = require('uuid');
const uuidv1 = uuid.v1;

const uniqid = require('uniqid');
// import visible from 'ifvisible.js';
// import uniqid from 'uniqid';

enum Mode {
  LIVE = 'live',
  RTC = 'rtc',
}

enum Codec {
  VP8 = 'vp8',
  H264 = 'h264',
}

interface AgoraRTCProviderOptions {
  user_id: string;
  token: string;
  app_id: string;
  callbacks: {
    onParticipantConnected: (participant: IAgoraRTCRemoteUser) => void;
    onParticipantDisconnected: (participant: IAgoraRTCRemoteUser) => void;
    onReconnect: (error: any) => void;
    onConnecting: () => void;
    onNetworkQuality: (event: any) => void;
    addTrack: (track: BlipTrack) => void;
    removeTrack: (uid: string) => void;
    onDisconnected: (error: any) => void;
    onError: (error: any) => void;
  };
  micConfig?: MicrophoneAudioTrackInitConfig;
  videoConfig?: CameraVideoTrackInitConfig;
  agora_channel: string;
}

class AgoraRTCProvider {
  id: string;
  options: AgoraRTCProviderOptions;
  client: IAgoraRTCClient;
  defaultMicConfig: MicrophoneAudioTrackInitConfig;
  defaultVideoConfig: CameraVideoTrackInitConfig;
  localAudio: IMicrophoneAudioTrack;
  localVideo: ICameraVideoTrack;
  subscriptions: Subscription[];
  initializing: boolean;

  constructor(options: AgoraRTCProviderOptions) {
    this.options = options;

    this.subscriptions = [];

    this.defaultMicConfig = {
      AEC: true, //acoustic echo cancellation
      AGC: true, //audio gain control
      ANS: true, //automatic noise suppression
      // encoderConfig: {
      //     bitrate: 64000,
      //     sampleRate: 12000,
      //     sampleSize: 64,
      //     stereo: true
      // }
      microphoneId: undefined,
    };

    this.defaultVideoConfig = {
      cameraId: undefined,
      // encoderConfig: {
      //     bitrateMax: 64,
      //     bitrateMin: 10,
      //     frameRate: 30, //{ max: 30, min: 5 }
      //     height: 640, //{ max: 1280, min: 720 }
      //     width: 480, //{ max: 1280, min: 720 }
      // },
      facingMode: 'user', //"environment"
      optimizationMode: 'detail', //"motion"
    };

    this.initializing = false;
  }

  public initialize = async (): Promise<void> => {
    this.initializing = true;

    this.id = uuidv1();
    const { user_id, agora_channel, app_id, micConfig, videoConfig, callbacks, token } = this.options;
    const { addTrack } = callbacks;

    /*
        0: DEBUG. Output all API logs.
        1: INFO. Output logs of the INFO, WARNING and ERROR level.
        2: WARNING. Output logs of the WARNING and ERROR level.
        3: ERROR. Output logs of the ERROR level.
        4: NONE. Do not output any log.
        */
    agora.setLogLevel(3);

    this.client = agora.createClient({
      mode: Mode.RTC,
      codec: Codec.VP8,
    });

    this.observeClient();

    log.info('agora client created... trying to join...');

    await this.client.join(app_id, agora_channel, token, user_id);

    log.info('agora - joined');

    if (!videoConfig) {
      const { videoDevices } = await getDevices();
      if (videoDevices[0]) {
        this.defaultVideoConfig.cameraId = videoDevices[0]?.deviceId;
      }
    }

    if (!micConfig) {
      const { audioDevices } = await getDevices();
      if (audioDevices[0]) {
        this.defaultMicConfig.microphoneId = audioDevices[0]?.deviceId;
      }
    }

    log.info('agora - got devices');

    this.localAudio = await agora.createMicrophoneAudioTrack(
      (micConfig as MicrophoneAudioTrackInitConfig) || this.defaultMicConfig
    );

    this.localVideo = await agora.createCameraVideoTrack(
      (videoConfig as CameraVideoTrackInitConfig) || this.defaultVideoConfig
    );

    log.info('agora - tracks created - ready to publish');

    await this.client.publish([this.localAudio, this.localVideo]);

    log.info('agora - published');

    const blipVideoTrack = this.agoraTrackIntoBlipTrack(this.localVideo, true);

    addTrack(blipVideoTrack);

    this.initializing = false;
  };

  public suspend = async () => {
    log.tag('event', 'info')(`agora provider about to be suspended...`);

    this.subscriptions.forEach(s => s.unsubscribe());

    this.subscriptions = [];

    if (this.initializing) {
      log.tag('event', 'info')(`not initialized yet... wait until initialized...`);
      try {
        await waitUntil(() => !this.initializing, 10000, 300);
      } catch (error) {
        log.error('agora client was never initialized...');
      }
    }

    if (this.client) {
      try {
        await this.client.unpublish([this.localVideo, this.localAudio]);
        log.tag('event', 'info')(`agora succesfully unpublished`);
      } catch (error) {
        log.error(error);
      }

      await this.client.leave();

      log.tag('event', 'info')(`agora client left`);

      this.client = null as any;
    }

    if (this.localVideo) {
      try {
        await this.localVideo.setEnabled(false);
      } catch (error) {
        log.info(error);
      }

      try {
        this.localVideo.stop();
      } catch (error) {
        log.info(error);
      }

      this.localVideo = undefined as any;
      log.tag('event', 'info')(`agora local video suspended`);
    }

    if (this.localAudio) {
      try {
        await this.localAudio.setEnabled(false);
      } catch (error) {
        log.info(error);
      }

      try {
        this.localAudio.stop();
      } catch (error) {
        log.info(error);
      }

      this.localAudio = undefined as any;
      log.tag('event', 'info')(`agora local audio suspended`);
    }
  };

  private _getVideoFromTrack = async (track: IRemoteTrack): Promise<HTMLVideoElement> => {
    const id = uniqid();

    const container: any = document.createElement('div');

    container.id = `container-${id}`;

    container.style.visibility = 'hidden';

    document.body.appendChild(container);

    track.play(container.id);

    await waitUntil(() => !!container.getElementsByTagName('video')[0], 10000, 300);

    const video: HTMLVideoElement = container.getElementsByTagName('video')[0];

    container.parentNode.removeChild(container);

    return video;
  };

  private agoraTrackIntoBlipTrack = (track: IRemoteTrack | ICameraVideoTrack, local: boolean): BlipTrack => {
    const type = track.trackMediaType;

    if (type !== 'video' && type !== 'audio') {
      throw new Error(`unknown track type ${type}`);
    }

    const uid = track['getUserId'] ? track['getUserId']() : this.options.user_id;

    const t: BlipTrack = {
      type,
      uid,
      id: track.getTrackId(),
      provider: 'agora',
      stream: null,
      source: track,
      local,
    };

    if (type === 'video') {
      //TODO review
      const stream = new MediaStream([track.getMediaStreamTrack()]);
      t.stream = stream;
    }

    return t;
  };

  onUserJoined = (user: IAgoraRTCRemoteUser) => {
    const { callbacks } = this.options;

    const { onParticipantConnected, addTrack } = callbacks;

    log.tag('event', 'info')(`agora event user-joined ${user.uid}`);

    if (user.audioTrack) {
      const track = this.agoraTrackIntoBlipTrack(user.audioTrack, false);
      addTrack(track);
    }

    if (user.videoTrack) {
      const track = this.agoraTrackIntoBlipTrack(user.videoTrack, false);
      addTrack(track);
    }

    onParticipantConnected(user);
  };

  onUserPublished = ([user, type]: [IAgoraRTCRemoteUser, 'audio' | 'video']) => {
    const { callbacks } = this.options;

    const { addTrack, onError } = callbacks;

    log.tag('event', 'info')(`agora event user-published ${user.uid} ${type}`);

    this.client
      .subscribe(user, type)
      .then((track: IRemoteTrack) => {
        const t = this.agoraTrackIntoBlipTrack(track, false);

        addTrack(t);
      })
      .catch(error => {
        onError(error);
      });
  };

  onUserLeft = ([user, type]: [IAgoraRTCRemoteUser, string]) => {
    const { callbacks } = this.options;

    const { onParticipantDisconnected, removeTrack } = callbacks;

    log.tag('event', 'info')(`agora event user-left ${user.uid} ${type}`); //type == "Quit"

    removeTrack(user.uid as string);

    onParticipantDisconnected(user);
  };

  onUserUnpublished = ([user, type]: [IAgoraRTCRemoteUser, 'audio' | 'video']) => {
    const { callbacks } = this.options;

    const { removeTrack } = callbacks;

    log.tag('event', 'info')(`agora event user-unpublished ${user.uid} ${type}`);

    if (type === 'video') {
      removeTrack(user.uid as string);
    }
  };

  onConnectionStateChange = ([currentState, previousState, reason]: [
    ConnectionState,
    ConnectionState,
    ConnectionDisconnectedReason
  ]) => {
    const { callbacks } = this.options;

    const { onConnecting, onReconnect, onDisconnected } = callbacks;

    log.tag('event', 'info')('agora event connection-state-change', currentState, previousState, reason);

    if (currentState === 'CONNECTING') {
      onConnecting();
    } else if (currentState === 'RECONNECTING') {
      onReconnect(reason);
    } else if (currentState === 'DISCONNECTED') {
      onDisconnected(reason);
    }
  };

  onNetworkQuality = (event: { downlinkNetworkQuality: number; uplinkNetworkQuality: number }) => {
    const { callbacks } = this.options;

    const { onNetworkQuality } = callbacks;

    log.tag('event', 'info')('agora event network-quality', event);

    onNetworkQuality(event);
  };

  onException = event => {
    const { callbacks } = this.options;

    const { onError } = callbacks;

    log.tag('event', 'info')('agora event exception', event);

    onError(event);
  };

  onCryptError = event => {
    const { callbacks } = this.options;

    const { onError } = callbacks;

    log.tag('event', 'info')('agora event crypt-error', event);

    onError(event);
  };

  toggleAudio = async ({ mute }: { mute: boolean }): Promise<{ success: boolean }> => {
    const { callbacks } = this.options;

    const { onError } = callbacks;

    try {
      // await this.localAudio.setEnabled(
      //     !this.localAudio.enabled
      // );

      if (mute) {
        await this.localAudio.setEnabled(false);
      } else {
        await this.localAudio.setEnabled(true);
      }

      return {
        success: true,
      };
    } catch (error) {
      onError(error);

      return {
        success: false,
      };
    }
  };

  toggleVideo = async ({ enable }: { enable: boolean }): Promise<{ success: boolean }> => {
    const { callbacks } = this.options;

    const { onError, addTrack, removeTrack } = callbacks;

    try {
      // await this.localVideo.setEnabled(
      //     !this.localVideo.enabled
      // );

      // if (this.localVideo.enabled) {
      //     const blipVideoTrack = this.agoraTrackIntoBlipTrack(this.localVideo, true);
      //     addTrack(blipVideoTrack);
      // } else {
      //     removeTrack("track-cam");
      // }

      if (enable) {
        await this.localVideo.setEnabled(true);

        const success = this.localVideo.enabled;

        if (success) {
          const blipVideoTrack = this.agoraTrackIntoBlipTrack(this.localVideo, true);
          addTrack(blipVideoTrack);
          return {
            success,
          };
        }
      } else {
        await this.localVideo.setEnabled(false);

        const success = !this.localVideo.enabled;

        if (success) {
          removeTrack('track-cam');
          return {
            success,
          };
        }
      }

      return {
        success: false,
      };
    } catch (error) {
      onError(error);

      return {
        success: false,
      };
    }
  };

  //TODO review
  setVideoDevice = async (videoDeviceId: string) => {
    const { callbacks, user_id } = this.options;

    const { onError, addTrack, removeTrack } = callbacks;

    try {
      removeTrack('track-cam');

      await pause(1000);

      try {
        await this.localVideo.setEnabled(false);
      } catch (error) {}

      await this.localVideo.setDevice(videoDeviceId);
      await this.localVideo.setEnabled(true);

      const blipVideoTrack = this.agoraTrackIntoBlipTrack(this.localVideo, true);

      addTrack(blipVideoTrack);
    } catch (error) {
      onError(error);
    }
  };

  setAudioDevice = (audioDeviceId: string) => {
    const { callbacks } = this.options;

    const { onError } = callbacks;

    try {
      this.localAudio.setDevice(audioDeviceId);
    } catch (error) {
      onError(error);
    }
  };

  forward = () => {
    // not implemented
  };

  getStats = (): Promise<any> => {
    const stats: { video: LocalVideoTrackStats | null; audio: LocalAudioTrackStats | null } = {
      video: null,
      audio: null,
    };

    if (this.localVideo) {
      stats.video = this.localVideo.getStats();
    }

    if (this.localAudio) {
      stats.audio = this.localAudio.getStats();
    }

    return Promise.resolve(stats);
  };

  observeClient = () => {
    const subscriptions = [
      fromEvent(this.client, 'user-joined').subscribe(this.onUserJoined),

      fromEvent(this.client, 'user-published').subscribe(this.onUserPublished),

      fromEvent(this.client, 'user-left').subscribe(this.onUserLeft),

      fromEvent(this.client, 'user-unpublished').subscribe(this.onUserUnpublished),

      fromEvent(this.client, 'connection-state-change').subscribe(this.onConnectionStateChange),

      fromEvent(this.client, 'network-quality').subscribe(this.onNetworkQuality),

      fromEvent(this.client, 'crypt-error').subscribe(this.onCryptError),

      fromEvent(this.client, 'exception').subscribe(this.onException),

      fromEvent(this.client, 'stream-type-changed').subscribe(event => {
        log.tag('event', 'info')('agora event stream-type-changed', event);
      }),

      fromEvent(this.client, 'channel-media-relay-event').subscribe(event => {
        log.tag('event', 'info')('%c agora event channel-media-relay-event', event);
      }),

      fromEvent(this.client, 'channel-media-relay-state').subscribe(event => {
        log.tag('event', 'info')('agora event channel-media-relay-state', event);
      }),

      fromEvent(this.client, 'stream-fallback').subscribe(event => {
        log.tag('event', 'info')('agora event stream-fallback', event);
      }),

      fromEvent(this.client, 'live-streaming-error').subscribe(event => {
        log.tag('event', 'info')('agora event live-streaming-error', event);
      }),

      fromEvent(this.client, 'live-streaming-warning').subscribe(event => {
        log.tag('event', 'info')('agora event live-streaming-warning', event);
      }),

      fromEvent(this.client, 'media-reconnect-end').subscribe(event => {
        log.tag('event', 'info')('agora event media-reconnect-end', event);
      }),

      fromEvent(this.client, 'media-reconnect-start').subscribe(event => {
        log.tag('event', 'info')('agora event media-reconnect-start', event);
      }),

      fromEvent(this.client, 'token-privilege-did-expire').subscribe(event => {
        log.tag('event', 'info')('agora event token-privilege-did-expire', event);
      }),

      fromEvent(this.client, 'token-privilege-will-expire').subscribe(event => {
        log.tag('event', 'info')('agora event token-privilege-will-expire', event);
      }),

      fromEvent(this.client, 'volume-indicator').subscribe(event => {
        log.tag('event', 'info')('agora event volume-indicator', event);
      }),
    ];

    this.subscriptions.push(...subscriptions);
  };
}

export default AgoraRTCProvider;
