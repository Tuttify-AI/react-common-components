import { log } from '../utils/log';
import * as sdpTransform from 'sdp-transform';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getTransceiver } from '../utils/getTransceiver';
import { ReconnectingWebsocketOptions } from '../types';

const uuidv1 = require('uuid').v1;

export interface Response<T> {
  type: string;
  load: T;
  transaction: string;
}

export interface Detection<T> {
  image_height: number;
  image_width: number;
  predictions: T;
  name: string;
  room_id: string;
  user_id: string;
  source: string;
  type: string;
}

interface Logger {
  enable: () => void;
  disable: () => void;
  success: (...args: any[]) => void;
  info: (...args: any[]) => void;
  error: (error: any) => void;
  json: (...args: any[]) => void;
  tag: (tag: string, type: `success` | `info` | `error`) => (...args: any[]) => void;
}

interface Participant {
  id: string;
  audio_codec: string;
  video_codec: string;
  talking: boolean;
}

interface JanusOptions {
  activateSubscriber: (subscriber: JanusSubscriber) => Promise<void>;
  onPublisher: (publisher: JanusPublisher) => void;
  onError: (error: any) => void;
  onMigrate: (handle_id: number) => void;
  onClosed: (handle_id: number) => void;
  onDetection: (data: Detection<any>) => void;
  onInternal: (data: Response<any>) => void;
  websocketOptions: ReconnectingWebsocketOptions;
  server: string;
  subscriberRtcConfiguration: any;
  publisherRtcConfiguration: any;
  mediaConstraints: MediaStreamConstraints;
  transactionTimeout: number;
  keepAliveInterval: number;
  user_id: string;
  token: string;
  appid: string;
  logger: Logger;
}

interface JanusPublisherOptions {
  transaction: (request: any) => Promise<any>;
  onError: (error: any) => void;
  rtcConfiguration: RTCConfiguration;
  mediaConstraints: MediaStreamConstraints;
  room_id: string;
  user_id: string;
  logger: Logger;
}

interface JanusSubscriberOptions {
  transaction: (request: any) => Promise<any>;
  rtcConfiguration: RTCConfiguration;
  room_id: string;
  feed: string;
  logger: Logger;
}

class JanusPublisher extends EventTarget {
  id: string;
  room_id: string;
  handle_id: number | any;
  ptype: 'publisher';
  transaction: (request: any) => Promise<any>;
  pc: RTCPeerConnection;
  stream: MediaStream | any;
  candidates: RTCIceCandidateInit[];
  publishing: boolean;
  volume: {
    value: any;
    timer: any;
  };
  bitrate: {
    value: any;
    bsnow: any;
    bsbefore: any;
    tsnow: any;
    tsbefore: any;
    timer: any;
  };
  iceConnectionState: any;
  iceGatheringState: any;
  signalingState: any;
  rtcConfiguration: RTCConfiguration;
  mediaConstraints: any;
  logger: Logger;
  onError: any;
  terminated: boolean;

  constructor(options: JanusPublisherOptions) {
    super();

    const { transaction, room_id, user_id, rtcConfiguration, mediaConstraints, logger, onError } = options;

    this.ptype = 'publisher';

    this.rtcConfiguration = rtcConfiguration;

    this.mediaConstraints = mediaConstraints;

    this.id = user_id;

    this.transaction = transaction;

    this.room_id = room_id;

    this.onError = onError;

    this.publishing = false;

    this.volume = {
      value: null,
      timer: null,
    };

    this.bitrate = {
      value: null,
      bsnow: null,
      bsbefore: null,
      tsnow: null,
      tsbefore: null,
      timer: null,
    };

    this.logger = logger;

    this.handle_id = null;

    this.createPeerConnection(this.rtcConfiguration);
  }

  public suspendStream = async () => {
    const tracks = this.stream.getTracks();
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      await track.stop();
    }
    this.stream = undefined;
  };

  public initialize = async () => {
    log.info('trying to attach publisher...');

    if (this.terminated) {
      log.info('1 publisher already terminated...return...');
      return;
    }

    await this.attach();

    log.info(`
			publisher succesfully attached...
			lets create offer...
			using constraints...
		`);

    log.json(this.mediaConstraints);

    if (this.terminated) {
      log.info('2 publisher already terminated...return...');
      return;
    }

    let jsep: any = null;

    try {
      jsep = await this.createOffer(this.mediaConstraints);
    } catch (error) {
      if (this.stream && this.terminated) {
        await this.suspendStream();
        throw new Error('create offer failed - client terminated');
      } else {
        throw error;
      }
    }

    if (this.terminated) {
      log.info('3 publisher already terminated...return...');
      if (this.stream && this.terminated) {
        await this.suspendStream();
      }
      //TODO expected return value is array of active publishers
      //review handling of return undefined cases
      return;
    }

    try {
      const sdp = sdpTransform.parse(jsep.sdp);
      log.info(sdp);
    } catch (error) {
      log.error(error);
    }

    const response = await this.joinandconfigure(jsep);

    return response.load.data.publishers;
  };

  public terminate = async () => {
    this.terminated = true;

    this.candidates = [];

    const event = new Event('terminated');

    if (this.publishing) {
      try {
        await this.unpublish();
      } catch (error) {
        if (error && error.message && error.message.includes("Can't unpublish, not published")) {
          this.logger.info(`${this.id} Can't unpublish, not published ${this.handle_id}...`);
        } else {
          this.onError(error);
        }
      }
    }

    if (this.pc) {
      this.pc.close();
    }

    if (this.stream) {
      const tracks = this.stream.getTracks();
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        await track.stop();
      }
    }

    this.dispatchEvent(event);

    //edge case - attach request is not completed yet but we already invoked termination
    //i should not try to check attached property but simply detach anyway
    //if (this.attached) {
    // hangup is not necessary - detach will invoke similar logical path
    // try {
    // 	await this.hangup();
    // } catch(error) {
    // 	this.onError(error);
    // }
    try {
      await this.leave();
    } catch (error) {
      this.onError(error);
    }

    if (this.handle_id) {
      try {
        await this.detach();
      } catch (error) {
        this.onError(error);
      }
    }
    //}
  };

  public terminateInstantly = () => {
    this.terminated = true;

    if (this.publishing) {
      this.unpublish().catch(error => {
        if (error && error.message && error.message.includes("Can't unpublish, not published")) {
          this.logger.info(`${this.id} Can't unpublish, not published ${this.handle_id}...`);
        } else {
          const e = new Error(`harmless ${error.message}`);
          this.onError(e);
        }
      });
    }

    if (this.pc) {
      this.pc.close();
    }

    if (this.stream) {
      const tracks = this.stream.getTracks();
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        track.stop();
      }
    }

    this.leave().catch(error => {
      const e = new Error(`harmless ${error.message}`);
      this.onError(e);
    });

    if (this.handle_id) {
      this.detach().catch(error => {
        const e = new Error(`harmless ${error.message}`);
        this.onError(e);
      });
    }

    const event = new Event('terminated');

    this.dispatchEvent(event);
  };

  public renegotiate = async ({ audio, video, mediaConstraints }) => {
    let jsep: any = null;

    try {
      jsep = await this.createOffer(mediaConstraints || this.mediaConstraints);
    } catch (error) {
      if (this.stream && this.terminated) {
        await this.suspendStream();
        throw new Error('client terminated');
      } else {
        throw error;
      }
    }

    this.logger.json(jsep);

    const configured = await this.configure({
      jsep,
      audio,
      video,
    });

    this.logger.json(configured);

    return configured;
  };

  private createPeerConnection = (configuration?: RTCConfiguration) => {
    this.pc = new RTCPeerConnection(configuration);

    this.pc.onicecandidate = event => {
      if (!event.candidate) {
        this.sendTrickleCandidate({
          completed: true,
        });
      } else {
        const candidate = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        };

        this.logger.info(`${this.id} [${this.ptype}] CANDIDATE`);

        this.logger.info(`${this.id} [${this.ptype}]`, candidate);

        this.sendTrickleCandidate(candidate);
      }
    };

    this.pc.onconnectionstatechange = () => {
      this.logger.info(`[${this.ptype}] ${this.id} onconnectionstatechange`);
    };

    this.pc.oniceconnectionstatechange = () => {
      this.iceConnectionState = this.pc.iceConnectionState;

      if (this.pc.iceConnectionState === 'disconnected') {
        const event = new Event('disconnected');
        this.dispatchEvent(event);
      } else if (this.pc.iceConnectionState === 'failed') {
        const event = new Event('failed');
        this.dispatchEvent(event);
      }

      this.logger.info(`${this.id} [${this.ptype}] oniceconnectionstatechange ${this.pc.iceConnectionState}`);
    };

    this.pc.onnegotiationneeded = () => {
      this.logger.info(`${this.id} [${this.ptype}] onnegotiationneeded ${this.pc.signalingState}`);
    };

    this.pc.onicegatheringstatechange = () => {
      this.iceGatheringState = this.pc.iceGatheringState;

      this.logger.info(`${this.id} [${this.ptype}] onicegatheringstatechange ${this.pc.iceGatheringState}`);
    };

    this.pc.onsignalingstatechange = () => {
      this.signalingState = this.pc.signalingState;

      this.logger.info(`${this.id} [${this.ptype}] onicegatheringstatechange ${this.pc.signalingState}`);

      if (this.pc.signalingState === 'closed' && !this.terminated) {
        this.renegotiate({
          audio: !!this.mediaConstraints.audio,
          video: !!this.mediaConstraints.video,
          mediaConstraints: this.mediaConstraints,
        })
          .then(reconfigured => this.logger.json(reconfigured))
          .catch(error => this.logger.error(error));
      }
    };

    this.pc.onicecandidateerror = error => {
      this.logger.info(`${this.id} [${this.ptype}] onicecandidateerror ${this.pc.signalingState}`);

      this.logger.error(error);
    };

    /*
		this.pc.onstatsended = stats => {

			this.logger.json(stats);
			
		};
		*/
  };

  private sendTrickleCandidate = candidate => {
    const request = {
      type: 'candidate',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
        candidate,
      },
    };

    return this.transaction(request);
  };

  public receiveTrickleCandidate = (candidate: RTCIceCandidateInit): void => {
    this.candidates.push(candidate);
  };

  public createOffer = async (mediaConstraints: MediaStreamConstraints): Promise<RTCSessionDescriptionInit> => {
    if (this.stream) {
      try {
        await this.suspendStream();
      } catch (error) {
        this.onError(error);
      }
    }

    log.info(`${this.id} janus - creating offer with constraints...`);

    log.json(mediaConstraints);

    const media = mediaConstraints || {
      audio: true,
      video: true,
    };

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia(media);

    log.info('janus - got user media');

    this.stream = stream;

    const tracks = stream.getTracks();

    if (media.video) {
      let vt = getTransceiver(this.pc, 'video');

      if (vt) {
        vt.direction = 'sendonly';
      } else {
        //TODO DOMException: Failed to execute 'addTransceiver' on 'RTCPeerConnection': The RTCPeerConnection's signalingState is 'closed'
        if (this.pc.signalingState === 'closed' && !this.terminated) {
          log.error(`${this.id} pc signaling state edge case...video...`);
          this.createPeerConnection(this.rtcConfiguration);
        }
        //why - send encoding crashes puppeteer ???
        const videoOptions: RTCRtpTransceiverInit = {
          direction: 'sendonly',
          /*
					streams: [stream],
					sendEncodings: [
						{ rid: "h", active: true, maxBitrate: maxBitrates.high },
						{ rid: "m", active: true, maxBitrate: maxBitrates.medium, scaleResolutionDownBy: 2 },
						{ rid: "l", active: true, maxBitrate: maxBitrates.low, scaleResolutionDownBy: 4 }
					]
					*/
        };
        vt = this.pc.addTransceiver('video', videoOptions);
      }

      const videoTrack = tracks.find(t => t.kind === 'video');

      await vt.sender.replaceTrack(videoTrack ?? null);
    }

    if (media.audio) {
      let at = getTransceiver(this.pc, 'audio');

      if (at) {
        at.direction = 'sendonly';
      } else {
        //TODO DOMException: Failed to execute 'addTransceiver' on 'RTCPeerConnection': The RTCPeerConnection's signalingState is 'closed'
        if (this.pc.signalingState === 'closed' && !this.terminated) {
          log.error('pc signaling state edge case...audio...');
          this.createPeerConnection(this.rtcConfiguration);
        }
        const audioOptions: RTCRtpTransceiverInit = {
          direction: 'sendonly',
        };
        at = this.pc.addTransceiver('audio', audioOptions);
      }

      const audioTrack = tracks.find(t => t.kind === 'audio');

      await at.sender.replaceTrack(audioTrack ?? null);
    }

    const offer = await this.pc.createOffer({});

    try {
      const sdp = sdpTransform.parse(offer.sdp);
      log.info(sdp);
    } catch (error) {
      //
    }

    this.pc.setLocalDescription(offer);

    return offer;
  };

  public attach = async () => {
    const request = {
      type: 'attach',
      load: {
        room_id: this.room_id,
      },
    };

    const result = await this.transaction(request);

    //TODO result undefined due to connection already terminated
    this.handle_id = result?.load;

    return result;
  };

  public join = () => {
    const request = {
      type: 'join',
      load: {
        id: this.id,
        room_id: this.room_id,
        handle_id: this.handle_id,
        ptype: this.ptype,
      },
    };

    return this.transaction(request);
  };

  private leave = async () => {
    const request = {
      type: 'leave',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
      },
    };

    this.publishing = false;

    const result = await this.transaction(request);

    return result;
  };

  public configure = async data => {
    const request: any = {
      type: 'configure',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
        ptype: this.ptype,
      },
    };

    if (data.jsep) {
      request.load.jsep = data.jsep;
    }

    if (data.audio !== undefined) {
      request.load.audio = data.audio;
    }

    if (data.video !== undefined) {
      request.load.video = data.video;
    }

    const configureResponse = await this.transaction(request);

    if (configureResponse.load.jsep) {
      try {
        const sdp = sdpTransform.parse(configureResponse.load.jsep.sdp);
        log.info(sdp);
      } catch (error) {
        log.error(error);
      }
      await this.pc.setRemoteDescription(configureResponse.load.jsep);
    }

    if (this.candidates) {
      for (const candidate of this.candidates) {
        if (!candidate || candidate['completed']) {
          await this.pc.addIceCandidate(undefined);
        } else {
          await this.pc.addIceCandidate(candidate);
        }
      }
      this.candidates = [];
    }

    this.publishing = true;

    return configureResponse;
  };

  public publish = async ({ jsep }) => {
    const request = {
      type: 'publish',
      load: {
        room_id: this.room_id,
        jsep,
      },
    };

    const response = await this.transaction(request);

    await this.pc.setRemoteDescription(response.load.jsep);

    if (this.candidates) {
      for (const candidate of this.candidates) {
        if (!candidate || candidate['completed']) {
          await this.pc.addIceCandidate(undefined);
        } else {
          await this.pc.addIceCandidate(candidate);
        }
      }
      this.candidates = [];
    }

    this.publishing = true;
  };

  public forward = async () => {
    const request = {
      type: 'forward',
      load: {
        id: this.id,
        room_id: this.room_id,
        // handle_id: this.handle_id
      },
    };

    const forwardResponse = await this.transaction(request);

    return forwardResponse;
  };

  public stop_forward = async () => {
    const request = {
      type: 'stop_forward',
      load: {
        id: this.id,
        room_id: this.room_id,
      },
    };

    const stopForwardResponse = await this.transaction(request);

    return stopForwardResponse;
  };

  public joinandconfigure = async jsep => {
    const request = {
      type: 'joinandconfigure',
      load: {
        id: this.id,
        room_id: this.room_id,
        handle_id: this.handle_id,
        ptype: this.ptype,
        jsep,
      },
    };

    const configureResponse = await this.transaction(request);

    await this.pc.setRemoteDescription(configureResponse.load.jsep);

    if (this.candidates) {
      for (const candidate of this.candidates) {
        if (!candidate || candidate['completed']) {
          await this.pc.addIceCandidate(undefined);
        } else {
          await this.pc.addIceCandidate(candidate);
        }
      }
      this.candidates = [];
    }

    this.publishing = true;

    return configureResponse;
  };

  public unpublish = async () => {
    const request = {
      type: 'unpublish',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
      },
    };

    const result = await this.transaction(request);

    this.publishing = false;

    return result;
  };

  public detach = async () => {
    const request = {
      type: 'detach',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
      },
    };

    const result = await this.transaction(request);

    this.publishing = false;

    this.handle_id = undefined;

    return result;
  };

  private hangup = async () => {
    const request = {
      type: 'hangup',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
      },
    };

    this.publishing = false;

    const result = await this.transaction(request);

    return result;
  };
}

class JanusSubscriber extends EventTarget {
  id: string;
  room_id: string;
  handle_id: number | any;
  feed: string;
  ptype: 'subscriber';
  transaction: any;
  pc: RTCPeerConnection;
  stream: MediaStream;
  candidates: any[];
  configuration: any;
  volume: {
    value: any;
    timer: any;
  };
  bitrate: {
    value: any;
    bsnow: any;
    bsbefore: any;
    tsnow: any;
    tsbefore: any;
    timer: any;
  };
  joined: boolean;
  iceConnectionState: any;
  iceGatheringState: any;
  signalingState: any;
  rtcConfiguration: RTCConfiguration;
  logger: Logger;
  terminated: boolean;

  constructor(options: JanusSubscriberOptions) {
    super();

    const { transaction, room_id, feed, rtcConfiguration, logger } = options;

    this.id = feed;

    this.feed = feed;

    this.transaction = transaction;

    this.room_id = room_id;

    this.ptype = 'subscriber';

    this.rtcConfiguration = rtcConfiguration;

    this.volume = {
      value: null,
      timer: null,
    };

    this.bitrate = {
      value: null,
      bsnow: null,
      bsbefore: null,
      tsnow: null,
      tsbefore: null,
      timer: null,
    };

    this.logger = logger;

    this.createPeerConnection(rtcConfiguration);
  }

  public initialize = async (options?: RTCOfferOptions): Promise<void> => {
    if (this.terminated) {
      this.logger.info(`initialize(1): ${this.id} subscriber already terminated`);
      return;
    }

    await this.attach();

    if (this.terminated) {
      this.logger.info(`initialize(2): ${this.id} subscriber already terminated`);
      return;
    }

    const result = await this.join();

    if (this.terminated) {
      this.logger.info(`initialize(3): ${this.id} subscriber already terminated`);
      return;
    }

    const jsep = result?.load?.jsep;

    const answer = await this.createAnswer(jsep, options);

    if (this.terminated) {
      this.logger.info(`initialize(4): ${this.id} subscriber already terminated`);
      return;
    }

    const started = await this.start(answer);

    return started;
  };

  public terminate = async () => {
    if (this.terminated) {
      return;
    }

    this.terminated = true;

    const event = new Event('terminated');

    this.dispatchEvent(event);

    if (this.pc) {
      this.pc.close();
    }

    //edge case - attach request is not completed yet but we already invoked termination
    //i should not try to check attached property but simply detach anyway
    //if (this.attached) {
    // hangup is not necessary - detach will invoke similar logical path
    // await this.hangup();
    if (this.handle_id) {
      await this.detach();
    }
    //}
  };

  public terminateInstantly = () => {
    this.terminated = true;

    if (this.pc) {
      this.pc.close();
    }

    if (this.handle_id) {
      this.detach().catch(error => {
        const e = new Error(`harmless ${error.message}`);
        this.logger.error(e);
      });
    }

    const event = new Event('terminated');

    this.dispatchEvent(event);
  };

  public reconnect = async () => {
    //TODO
  };

  public createPeerConnection = (configuration?: RTCConfiguration) => {
    this.pc = new RTCPeerConnection(configuration);

    this.pc.onicecandidate = event => {
      if (!event.candidate) {
        this.sendTrickleCandidate({
          completed: true,
        });
      } else {
        const candidate = {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        };

        this.sendTrickleCandidate(candidate);
      }
    };

    this.pc.ontrack = event => {
      if (!event.streams) {
        return;
      }

      const stream = event.streams[0];

      this.stream = stream;

      stream.addEventListener('addtrack', () => {
        this.logger.info(`${this.id} [subscriber] track add`);
      });

      stream.addEventListener('removetrack', () => {
        this.logger.info(`${this.id} [subscriber] track remove`);
      });

      event.track.addEventListener('ended', () => {
        this.logger.info(`${this.id} [subscriber] track onended`);

        const event = new Event('track-ended');

        this.dispatchEvent(event);
      });

      event.track.addEventListener('mute', () => {
        this.logger.info(`${this.id} [subscriber] track muted`);

        const event = new Event('mute');

        this.dispatchEvent(event);
      });

      event.track.addEventListener('unmute', () => {
        this.logger.info(`${this.id} [subscriber] track unmuted`);

        const event = new Event('unmute');

        this.dispatchEvent(event);
      });
    };

    this.pc.onnegotiationneeded = () => {
      this.iceConnectionState = this.pc.iceConnectionState;

      this.logger.info(`${this.id} [subscriber] onnegotiationneeded`);
    };

    this.pc.onconnectionstatechange = event => {
      this.logger.info(`${this.id} onconnectionstatechange`);

      console.log(event);
    };

    this.pc.oniceconnectionstatechange = () => {
      this.iceConnectionState = this.pc.iceConnectionState;

      if (this.pc.iceConnectionState === 'disconnected') {
        const event = new Event('disconnected');
        this.dispatchEvent(event);
      } else if (this.pc.iceConnectionState === 'failed') {
        const event = new Event('failed');
        this.dispatchEvent(event);
      }

      this.logger.info(`${this.id} oniceconnectionstatechange ${this.pc.iceConnectionState}`);
    };

    this.pc.onicecandidateerror = error => {
      this.logger.error(error);
    };

    this.pc.onicegatheringstatechange = () => {
      this.iceGatheringState = this.pc.iceGatheringState;

      this.logger.info(this.id, this.pc.iceGatheringState);
    };

    this.pc.onsignalingstatechange = () => {
      this.signalingState = this.pc.signalingState;

      this.logger.info(`${this.id} onsignalingstatechange ${this.pc.signalingState}`);
    };
    /*
		this.pc.onstatsended = stats => {

			this.logger.info(stats);
			
		};
		*/
  };

  private sendTrickleCandidate = candidate => {
    const request = {
      type: 'candidate',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
        candidate,
      },
    };

    return this.transaction(request);
  };

  public receiveTrickleCandidate = (candidate): void => {
    this.candidates.push(candidate);
  };

  //TODO review - handle no video source scenario
  //TODO how i can deduce from parsed offer that participant shares no video ?
  public createAnswer = async (jsep, options?: RTCOfferOptions) => {
    try {
      const res = sdpTransform.parse(jsep.sdp);
      this.logger.info(`${this.id} parsed sdp`, jsep.sdp, res);
    } catch (error) {
      this.logger.info(`${this.id} unable to parse sdp`, jsep.sdp);
    }

    await this.pc.setRemoteDescription(jsep);

    if (this.candidates) {
      this.candidates.forEach(candidate => {
        if (candidate.completed || !candidate) {
          this.pc.addIceCandidate(undefined);
        } else {
          this.pc.addIceCandidate(candidate);
        }
      });
      this.candidates = [];
    }

    log.info(`createAnswer: trying to obtain video transceiver...`);

    let vt = getTransceiver(this.pc, 'video');

    log.info(`video transceiver is`, vt);

    log.info(`createAnswer: trying to obtain audio transceiver...`);

    let at = getTransceiver(this.pc, 'audio');

    log.info(`audio transceiver is`, at);

    if (vt && at) {
      at.direction = 'recvonly';
      vt.direction = 'recvonly';
    } else {
      //TODO DOMException: Failed to execute 'addTransceiver' on 'RTCPeerConnection': The RTCPeerConnection's signalingState is 'closed'
      if (this.pc.signalingState === 'closed' && !this.terminated) {
        this.createPeerConnection(this.rtcConfiguration);
      }
      vt = this.pc.addTransceiver('video', { direction: 'recvonly' });
      at = this.pc.addTransceiver('audio', { direction: 'recvonly' });
    }

    const answer = await this.pc.createAnswer(options);

    this.pc.setLocalDescription(answer);

    return answer;
  };

  public attach = async () => {
    const request = {
      type: 'attach',
      load: {
        room_id: this.room_id,
      },
    };

    const result = await this.transaction(request);

    this.handle_id = result.load;

    return result;
  };

  public join = () => {
    const request = {
      type: 'join',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
        ptype: 'subscriber',
        feed: this.feed,
      },
    };

    return this.transaction(request).then(response => {
      this.joined = true;

      return response;
    });
  };

  public configure = async data => {
    const request: any = {
      type: 'configure',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
        ptype: this.ptype,
      },
    };

    if (data.jsep) {
      request.load.jsep = data.jsep;
    }

    if (data.audio !== undefined) {
      request.load.audio = data.audio;
    }

    if (data.video !== undefined) {
      request.load.video = data.video;
    }

    const configureResponse = await this.transaction(request);

    return configureResponse;
  };

  public start = jsep => {
    const request = {
      type: 'start',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
        answer: jsep,
      },
    };

    return this.transaction(request);
  };

  private hangup = async () => {
    const request = {
      type: 'hangup',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
      },
    };

    const result = await this.transaction(request);

    return result;
  };

  public detach = async () => {
    const request = {
      type: 'detach',
      load: {
        room_id: this.room_id,
        handle_id: this.handle_id,
      },
    };

    const result = await this.transaction(request);

    this.handle_id = undefined;

    return result;
  };

  private leave = async () => {
    const request = {
      type: 'leave',
      load: {
        room_id: this.room_id,
      },
    };

    const result = await this.transaction(request);

    return result;
  };
}

class JanusClient {
  server: string;
  room_id: string;
  ws: any;
  terminated: boolean;
  connected: boolean;
  initializing: boolean;
  publisher: JanusPublisher;
  subscribers: { [id: string]: JanusSubscriber };
  private calls: { [id: string]: (message: any) => void };
  keepAlive: any;
  keepAliveInterval: number;
  transactionTimeout: number;
  websocketOptions: ReconnectingWebsocketOptions;
  activateSubscriber: (subscriber: JanusSubscriber) => Promise<void>;
  onPublisher: (publisher: JanusPublisher) => void;
  notifyConnected: (error?: any) => void;
  onError: (error: any) => void;
  onMigrate: (handle_id: number) => void;
  onClosed: (handle_id: number) => void;
  onDetection: (data: Detection<any>) => void;
  onInternalCallback: (message: Response<any>) => void;
  subscriberRtcConfiguration: any;
  publisherRtcConfiguration: any;
  logger: Logger;
  user_id: string;

  constructor(options: JanusOptions) {
    const {
      activateSubscriber,
      onPublisher,
      onError,
      onMigrate,
      onClosed,
      onDetection,
      onInternal,
      logger,
      server,
      subscriberRtcConfiguration,
      publisherRtcConfiguration,
      transactionTimeout,
      keepAliveInterval,
      websocketOptions,
      user_id,
      token,
      appid,
    } = options;

    this.user_id = user_id;

    this.logger = logger;

    this.server = `${server}/?id=${user_id}&secret=${process.env.REACT_APP_JANUS_SECRET}&token=${token}&appid=${appid}`;

    this.ws = null;

    this.initializing = false;

    this.connected = false;

    this.terminated = false;

    this.subscribers = {};

    this.calls = {};

    this.websocketOptions = websocketOptions;

    this.subscriberRtcConfiguration = subscriberRtcConfiguration;

    this.publisherRtcConfiguration = publisherRtcConfiguration;

    this.onError = onError;

    this.onPublisher = onPublisher;

    this.activateSubscriber = activateSubscriber;

    this.onMigrate = onMigrate;

    this.onClosed = onClosed;

    this.onDetection = onDetection;

    this.onInternalCallback = onInternal;

    this.transactionTimeout = transactionTimeout;

    this.keepAliveInterval = keepAliveInterval;

    this.logger.enable();

    this.logger.json({
      user_id,
      transactionTimeout,
      keepAliveInterval,
      websocketOptions,
    });
  }

  //initialize -> was connected succesfully -> lock initialize until disconnected
  //initialize -> connection failed -> unlock for retry
  //initialize -> establishing connection
  public initialize = (): Promise<void> => {
    if (this.terminated) {
      return new Promise(resolve => resolve());
    }

    if (this.connected) {
      this.logger.error('already initialized...');
      return new Promise(resolve => resolve());
    }

    if (this.initializing) {
      this.logger.error('initialization in progress...');
      return new Promise(resolve => resolve());
    }

    this.logger.success(`initialize... ${this.server}`);

    this.initializing = true;

    this.ws = new ReconnectingWebSocket(this.server, ['wss'], this.websocketOptions);

    this.ws.addEventListener('message', this.onMessage);

    this.ws.addEventListener('error', this.onError);

    return new Promise(resolve => {
      this.notifyConnected = () => resolve();
    });
  };

  private cleanupCalls = () => {
    for (const key in this.calls) {
      const f = this.calls[key];
      const message = {
        type: 'cancel',
        load: 'suspend',
      };
      if (f) {
        f(message);
      }
    }

    this.calls = {};
  };

  public terminateInstantly = () => {
    if (this.terminated) {
      return;
    }

    this.terminated = true;

    this.ws.removeEventListener('message', this.onMessage);

    this.ws.removeEventListener('close', this.onClose);

    this.ws.removeEventListener('error', this.onError);

    clearInterval(this.keepAlive);

    if (this.notifyConnected) {
      this.notifyConnected({
        cancel: true,
      });
      // delete this.notifyConnected;
    }

    try {
      if (this.publisher) {
        try {
          this.publisher.terminateInstantly();
          this.publisher.transaction = () => Promise.resolve();
          // delete this.publisher;
        } catch (error) {
          if (error && error.message && error.message.includes("Can't unpublish, not published")) {
            this.logger.info(`Can't unpublish, not published ${this.publisher.handle_id}...`);
          } else {
            //if connection is lost just ignore the errors
            if (this.connected) {
              this.onError(error);
            }
          }
        }
      }

      for (const id in this.subscribers) {
        const subscriber = this.subscribers[id];
        const event = new Event('leaving');
        subscriber.dispatchEvent(event);

        try {
          subscriber.terminateInstantly();
          subscriber.transaction = () => Promise.resolve();
          delete this.subscribers[id];
        } catch (error) {
          //if connection is lost just ignore the errors
          if (this.connected) {
            this.onError(error);
          }
        }
      }

      this.subscribers = {};
    } catch (error) {
      this.logger.error(error);
    }

    this.ws.close();

    this.cleanupCalls();

    this.connected = false;

    this.initializing = false;

    this.keepAlive = undefined;

    this.ws = undefined;
  };

  public terminate = async () => {
    if (this.terminated) {
      return;
    }

    this.terminated = true;

    try {
      await this.cleanup();
    } catch (error) {
      this.logger.error(error);
    }

    this.logger.info(`terminate: remove event listeners...`);

    this.ws.removeEventListener('message', this.onMessage);

    this.ws.removeEventListener('close', this.onClose);

    this.ws.removeEventListener('error', this.onError);

    if (this.notifyConnected) {
      this.notifyConnected({
        cancel: true,
      });
      // delete this.notifyConnected;
    }

    this.logger.info(`terminate: close connection...`);

    this.ws.close();

    this.cleanupCalls();

    this.logger.info(`connection closed...`);

    this.connected = false;

    this.initializing = false;

    clearInterval(this.keepAlive);

    this.keepAlive = undefined;

    this.ws = undefined;
  };

  public replaceTracks = async (videoDeviceId: string, audioDeviceId: string) => {
    if (!this.publisher) {
      return;
    }

    await this.publisher.suspendStream();

    const mediaConstraints = {
      audio: !audioDeviceId
        ? false
        : {
            deviceId: {
              exact: audioDeviceId,
            },
          },
      video: !videoDeviceId
        ? false
        : {
            deviceId: {
              exact: videoDeviceId,
            },
          },
    };

    await this.publisher.renegotiate({
      audio: !!mediaConstraints.audio,
      video: !!mediaConstraints.video,
      mediaConstraints,
    });

    this.publisher.dispatchEvent(new Event('device-change'));
  };

  private onClose = event => {
    if (this.terminated) {
      return;
    }

    this.logger.info(`connection closed...received on close event...`);

    this.logger.json(event);

    if (this.connected) {
      const error = new Error('lost connection - connection closed');

      this.onError(error);
    }

    this.connected = false;

    this.initializing = false;

    clearInterval(this.keepAlive);

    this.keepAlive = undefined;
  };

  public join = async (room_id: string, mediaConstraints: MediaStreamConstraints): Promise<void> => {
    this.room_id = room_id;

    if (this.publisher) {
      log.info(`janus join publisher already exist - try to cleanup`);
      try {
        await this.publisher.terminate();
        this.publisher.transaction = () => Promise.resolve();
        // delete this.publisher;
      } catch (error) {
        //
      }
    }

    this.publisher = new JanusPublisher({
      room_id: this.room_id,
      user_id: this.user_id,
      transaction: this.transaction,
      logger: this.logger,
      onError: this.onError,
      mediaConstraints,
      rtcConfiguration: this.publisherRtcConfiguration,
    });

    log.info(`janus trying to initialize publisher...`);

    let publishers = [];

    try {
      publishers = await this.publisher.initialize();
    } catch (error) {
      log.error('unable to initialize publisher');
      throw error;
    }

    this.onPublisher(this.publisher);

    if (!publishers || !Array.isArray(publishers)) {
      const error = new Error(`could not retrieve participants info`);
      throw error;
    }

    this.onPublishers(publishers);
  };

  public leave = async () => {
    if (this.terminated) {
      return;
    }

    await this.cleanup();
  };

  private cleanup = async () => {
    if (this.publisher) {
      this.logger.info(`terminate publisher ${this.publisher.handle_id}...`);
      try {
        await this.publisher.terminate();
        this.publisher.transaction = () => Promise.resolve();
        // delete this.publisher;
      } catch (error) {
        if (error && error.message && error.message.includes("Can't unpublish, not published")) {
          this.logger.info(`Can't unpublish, not published ${this.publisher.handle_id}...`);
        } else {
          //if connection is lost just ignore the errors
          if (this.connected) {
            this.onError(error);
          }
        }
      }
    }

    for (const id in this.subscribers) {
      const subscriber = this.subscribers[id];
      const event = new Event('leaving');
      subscriber.dispatchEvent(event);

      this.logger.info(subscriber);

      if (!subscriber.handle_id) {
        this.logger.error(`handle_id is undefined`);
      }

      if (subscriber?.feed != id) {
        this.logger.error(`subscriber.feed != id`);
      }

      this.logger.info(`terminate subscriber ${subscriber.handle_id}...`);

      try {
        await subscriber.terminate();
        subscriber.transaction = () => Promise.resolve();
        delete this.subscribers[id];
      } catch (error) {
        //if connection is lost just ignore the errors
        if (this.connected) {
          this.onError(error);
        }
      }
    }

    this.subscribers = {};
  };

  private onOpen = () => {
    if (this.terminated) {
      return;
    }

    this.logger.success(`connection established...`);

    this.initializing = false;

    this.connected = true;

    this.ws.removeEventListener('close', this.onClose);

    this.ws.addEventListener('close', this.onClose);

    if (this.notifyConnected) {
      this.notifyConnected();
      // delete this.notifyConnected;
    }

    if (this.keepAlive) {
      clearInterval(this.keepAlive);
    }

    this.keepAlive = setInterval(async () => {
      try {
        await this.transaction({ type: 'keepalive' });
      } catch (error) {
        this.onError(error);
      }
    }, this.keepAliveInterval);
  };

  private onMessage = (response: MessageEvent) => {
    if (response.data === 'connected') {
      this.onOpen();
      return;
    } else if (response.data === 'jwt_expired') {
      const error = new Error('lost connection - jwt_expired');
      this.onError(error);
      return;
    }

    let message: any = null;

    try {
      message = JSON.parse(response.data);
    } catch (error) {
      log.error(`onMessage: unable to parse json \n ${response.data}`);
      this.onError(error);
    }

    if (message) {
      const id = message.transaction;
      const isEvent = !id;

      if (isEvent) {
        this.onEvent(message);
      } else {
        const resolve = this.calls[id];
        if (resolve) {
          resolve(message);
        } else {
          const error = new Error(`onMessage: resolve missing for message ${id} \n ${response?.data}`);
          this.onError(error);
        }
      }
    }
  };

  private onEvent = async (json: Response<any>) => {
    this.logger.info('new event');

    this.logger.json(json);

    if (json.type === 'trickle') {
      this.onTrickle(json);
    } else if (json.type === 'publishers') {
      const publishers: Participant[] = json.load;

      if (!publishers || !Array.isArray(publishers)) {
        this.logger.json(json);
        const error = new Error(`onEvent - publishers incorrect format...`);
        this.onError(error);
        return;
      }

      this.onPublishers(publishers);
    } else if (json.type === 'media') {
      this.onMedia(json);
    } else if (json?.load?.plugindata?.data?.unpublished) {
      this.onUnpublished(json);
    } else if (json.type === 'leaving') {
      this.onLeaving(json);
    } else if (json.type === 'internal') {
      this.onInternal(json);
    } else if (json.type === 'migrate') {
      this.onMigrate(json?.load?.handle_id);
    } else if (json.type === 'closed') {
      this.onClosed(json?.load?.handle_id);
    } else if (json?.load?.janus === 'webrtcup') {
      console.log('webrtcup');
    } else if (json.type == 'detection') {
      if (this.onDetection && json?.load?.predictions) {
        try {
          this.onDetection(json.load);
        } catch (e) {
          this.onError(e);
        }
      }
    }
  };

  private onTrickle = (
    json: Response<{
      candidate;
      sender: number;
    }>
  ) => {
    const { sender, candidate } = json.load;

    if (!this.publisher) {
      const error = new Error(`onTrickle - publisher is undefined for ${sender}...`);
      this.onError(error);
      return;
    }

    if (!sender) {
      this.logger.json(json);
      const error = new Error(`onTrickle - sender is undefined...`);
      this.onError(error);
      return;
    }

    if (this.publisher.terminated) {
      const error = new Error(`onTrickle - publisher already terminated for ${sender}...`);
      this.onError(error);
      return;
    }

    if (this.publisher.handle_id == sender) {
      this.logger.success(`received trickle candidate for publisher ${sender}...`);
      this.publisher.receiveTrickleCandidate(candidate);
    } else {
      for (const id in this.subscribers) {
        const subscriber = this.subscribers[id];

        if (subscriber.handle_id == sender) {
          this.logger.success(`received trickle candidate for subscriber ${sender}...`);
          subscriber.receiveTrickleCandidate(candidate);
        }
      }
    }
  };

  private onPublishers = async (publishers: Participant[]): Promise<void> => {
    for (let i = 0; i < publishers.length; i++) {
      const publisher = publishers[i];

      const feed = publisher.id;

      if (this.subscribers[feed] && !this.subscribers[feed].terminated) {
        this.logger.info(`onPublishers - subscriber ${feed} already attached for room ${this.room_id}`);
        continue;
      }

      const subscriber = new JanusSubscriber({
        transaction: this.transaction,
        room_id: this.room_id,
        feed,
        logger: this.logger,
        rtcConfiguration: this.subscriberRtcConfiguration,
      });

      //hashing should occur before initialization because repeated call may create orphaned subscriber
      this.subscribers[feed] = subscriber;

      try {
        await this.activateSubscriber(subscriber);
      } catch (error) {
        try {
          await subscriber.terminate();
        } catch (error) {
          //
        }
        subscriber.transaction = () => Promise.resolve();
        delete this.subscribers[feed];
        this.onError(error);
      }
    }
  };

  private onMedia = (
    json: Response<{
      sender;
      type;
      receiving;
    }>
  ) => {
    const { sender, type, receiving } = json.load;

    const data: any = {
      type,
      receiving,
    };

    if (!this.publisher) {
      const error = new Error(`onMedia - publisher undefined for ${sender}...`);
      this.onError(error);
      return;
    }

    if (!sender) {
      this.logger.json(json);
      const error = new Error(`onMedia - sender is undefined...`);
      this.onError(error);
      return;
    }

    const event = new Event('media', data);

    if (this.publisher.handle_id == sender) {
      this.publisher.dispatchEvent(event);
    } else {
      for (const id in this.subscribers) {
        const subscriber = this.subscribers[id];
        if (subscriber.handle_id == sender) {
          subscriber.dispatchEvent(event);
        }
      }
    }
  };

  private onUnpublished = async (
    json: Response<{
      janus: 'event';
      session_id: number; // 6501268652373615,
      sender: number; // 8582362275256178,
      plugindata: {
        plugin: 'janus.plugin.videoroom';
        data: {
          videoroom: string; //"event"
          room: string; //"4elhkzv1t7ow"
          unpublished: string; //"41726"
        };
      };
    }>
  ) => {
    const unpublished = json?.load?.plugindata?.data?.unpublished;

    if (unpublished == 'ok') {
      return;
    }

    this.logger.info(`user unpublished ${unpublished}`);

    const event = new Event('unpublished');

    for (const id in this.subscribers) {
      const subscriber = this.subscribers[id];
      if (subscriber.feed == unpublished) {
        try {
          await subscriber.terminate();
          subscriber.transaction = () => Promise.resolve();
          delete this.subscribers[subscriber.feed];
        } catch (error) {
          this.onError(error);
        }
        subscriber.dispatchEvent(event);
      }
    }
  };

  private onLeaving = async (
    json: Response<{
      leaving: string;
      sender: number;
    }>
  ) => {
    if (!json.load) {
      this.logger.json(json);
      const error = new Error(`onLeaving - data is undefined...`);
      this.onError(error);
      return;
    }

    const { leaving } = json.load;

    if (!this.publisher) {
      const error = new Error(`onLeaving - publisher is undefined...`);
      this.onError(error);
      return;
    }

    if (!leaving) {
      const error = new Error(`onLeaving - leaving is undefined...`);
      this.onError(error);
      return;
    }

    const event = new Event('leaving');

    for (const id in this.subscribers) {
      const subscriber = this.subscribers[id];
      if (subscriber.feed == leaving) {
        try {
          await subscriber.terminate();
          subscriber.transaction = () => Promise.resolve();
          delete this.subscribers[subscriber.feed];
        } catch (error) {
          this.onError(error);
        }
        subscriber.dispatchEvent(event);
      }
    }
  };

  private onIceFailed = () => {
    //TODO
  };

  public getAvailableCodecs = () => {
    try {
      return RTCRtpSender.getCapabilities('video')?.codecs;
    } catch (error) {
      log.error(error);
    }

    return [];
  };

  private onInternal = (json: Response<any>) => {
    let m = ``;

    try {
      m = JSON.stringify(json);
    } catch (error) {
      //
    }

    this.logger.info(`on internal ${m}`);

    this.onInternalCallback(json);
  };

  public mute = async () => {
    if (!this.publisher) {
      throw new Error('mute - publisher is undefined...');
    }

    return await this.publisher.configure({
      audio: false,
    });
  };

  public unmute = async () => {
    if (!this.publisher) {
      throw new Error('unmute - publisher is undefined...');
    }

    return await this.publisher.configure({
      audio: true,
    });
  };

  public pause = async () => {
    if (!this.publisher) {
      throw new Error('pause - publisher is undefined...');
    }

    return await this.publisher.configure({
      video: false,
    });
  };

  public resume = async () => {
    if (!this.publisher) {
      throw new Error('resume - publisher is undefined...');
    }

    return await this.publisher.configure({
      video: true,
    });
  };

  private transaction = async request => {
    if (!this.connected) {
      let info = ``;
      try {
        info = JSON.stringify(request);
      } catch (e) {
        //
      }
      const error = new Error(`client should be initialized before you can make transaction \n ${info}`);
      throw error;
    }

    const id = uuidv1();

    request.transaction = id;

    if (request.type != 'keepalive') {
      this.logger.info(`transaction - ${request.type} - ${id}`);
    }

    let r: any = null;
    let p: any = null;

    try {
      r = JSON.stringify(request);
    } catch (error) {
      return Promise.reject(error);
    }

    p = new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        this.logger.info(`timeout called for ${request.type} - ${id} - ${!!this.calls[id]}`);

        delete this.calls[id];

        if (!this.connected) {
          this.logger.error('timeout after disconnect');
          const error = new Error(`cancel`);
          reject(error);
        } else {
          const error = new Error(`${request.type} - timeout`);
          reject(error);
        }
      }, this.transactionTimeout);

      const f = message => {
        if (message.type === 'cancel' && message.load === 'suspend') {
          this.logger.info(`transaction ${id} canceled`);
          clearTimeout(t);
          delete this.calls[id];
          const error = new Error(`cancel`);
          reject(error);
          return;
        }

        //if (request.type != "keepalive") {
        this.logger.info(`resolving transaction ${id} - ${message.transaction}`);
        //}

        if (message.transaction === id) {
          clearTimeout(t);
          delete this.calls[id];
          if (message.type === 'error') {
            this.logger.error(request);
            this.logger.error(message);
            const error = new Error(message.load);
            reject(error);
          } else {
            resolve(message);
          }
        }
      };

      this.calls[id] = f;
    });

    this.ws.send(r);

    return p;
  };

  public getRooms = () => this.transaction({ type: 'rooms' });

  public createRoom = (
    description: string,
    bitrate: number,
    bitrate_cap: boolean,
    videocodec: string,
    vp9_profile: string,
    permanent: boolean
  ) => {
    return this.transaction({
      type: 'create_room',
      load: {
        description,
        bitrate,
        bitrate_cap,
        videocodec,
        vp9_profile,
        permanent,
      },
    });
  };
}

export { JanusClient, JanusPublisher, JanusSubscriber };
