import { log } from '../utils/log';
import { Detection, JanusClient, JanusPublisher, JanusSubscriber } from './janus-client';
import { BlipTrack, ReconnectingWebsocketOptions } from '../types';
import { Response } from './janus-client';

interface JanusOptions {
  janus_room_id: string;
  user_id: string;
  server: string;
  token: string;
  appid: string;
  audioDeviceId: string | null;
  videoDeviceId: string | null;
  rtcConfiguration?: RTCConfiguration;
  websocketOptions?: ReconnectingWebsocketOptions;
  transactionTimeout?: number;
  keepAliveInterval?: number;
  callbacks: {
    onParticipantConnected: (participant: JanusSubscriber) => void;
    onParticipantDisconnected: (participant: JanusSubscriber) => void;
    onIceDisconnected: (participant: JanusSubscriber) => void;
    onReconnect: (error?) => void;
    addTrack: (track: BlipTrack) => void;
    removeTrack: (uid: string) => void;
    onError: (error: Error) => void;
    onInternal: (message: Response<any>) => void;
    onMigrate: (handle_id: number) => void;
    onClosed: (handle_id: number) => void;
    onDetection: (data: Detection<any>) => void;
    onDisconnected: (error: Error) => void;
  };
}

/**
this class contains logic for interaction with janus server which is currently deployed at https://dev-janus.blipiq.com
janus project involves multiple repositories, here are some of the links (documentation contained inside):
https://github.com/meetecho/janus-gateway
https://github.com/meetecho/janus-gateway/tree/master/html
*/
class JanusRTCProvider {
  client: JanusClient;
  options: JanusOptions;
  rtcConfiguration: RTCConfiguration;
  publisher: JanusPublisher;
  connected: boolean;
  joined: boolean;
  suspended: boolean;

  constructor(options: JanusOptions) {
    this.options = options;

    const defaultRtcConfiguration = {
      iceServers: [
        {
          urls: 'stun:stun.voip.eutelia.it:3478',
        },
      ],
      sdpSemantics: 'unified-plan',
    } as RTCConfiguration;

    this.rtcConfiguration = options.rtcConfiguration || defaultRtcConfiguration;

    log.info(`accepted rtc configuration`);
    log.json(this.rtcConfiguration);
  }

  public initialize = async (): Promise<void> => {
    const { user_id, janus_room_id, server, callbacks, audioDeviceId, videoDeviceId, token, appid } = this.options;

    if (this.client) {
      try {
        log.info(`initialize janus - this.client if defined on start... trying to terminate...`);
        await this.client.terminate();
      } catch (error) {
        log.error(error);
      }
    }

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

    log.info(`janus use media constraints`);

    log.json(mediaConstraints);

    const defaultWebsocketOptions = {
      connectionTimeout: 10000, // retry connect if not connected after this time, in ms
      maxRetries: 20, // maximum number of retries
      maxReconnectionDelay: 10000, // max delay in ms between reconnection
      minReconnectionDelay: 1000, // min delay in ms between reconnection
      reconnectionDelayGrowFactor: 1.5, // how fast the reconnection delay grows
      minUptime: 3000, // min time in ms to consider connection as stable
      maxEnqueuedMessages: 10,
      startClosed: false, // start websocket in CLOSED state, call `.reconnect()` to connect
      debug: true, // enables debug output
    };

    this.client = new JanusClient({
      user_id,
      server,
      token,
      appid,
      logger: {
        enable: () => {
          //
        },
        disable: () => {
          //
        },
        ...log,
      },
      mediaConstraints,
      subscriberRtcConfiguration: this.rtcConfiguration,
      publisherRtcConfiguration: this.rtcConfiguration,
      transactionTimeout: this.options.transactionTimeout || 60000,
      keepAliveInterval: this.options.keepAliveInterval || 10000,
      websocketOptions: this.options.websocketOptions || defaultWebsocketOptions,
      onPublisher: this.onPublisher,
      activateSubscriber: this.activateSubscriber,
      onMigrate: callbacks.onMigrate,
      onClosed: callbacks.onClosed,
      onDetection: callbacks.onDetection,
      onInternal: callbacks.onInternal,
      onError: callbacks.onError,
    });

    log.info(`janus ready to join ${janus_room_id}`);

    if (!this.suspended) {
      //~500ms
      log.info(`janus trying to initialize the client`);

      await this.client.initialize();

      this.connected = true;

      log.info('janus client initialized');
    }

    if (!this.suspended) {
      //~1500ms

      log.info(`janus client trying to join room`);

      await this.client.join(janus_room_id, mediaConstraints);

      this.joined = true;
    }
  };

  private activateSubscriber = async (subscriber: JanusSubscriber) => {
    const { callbacks } = this.options;

    const { onIceDisconnected, onParticipantConnected, onParticipantDisconnected, addTrack, removeTrack } = callbacks;

    subscriber.addEventListener('terminated', () => {
      log.info(`subscriber is terminated ${subscriber.id} - remove track`);

      try {
        onParticipantDisconnected(subscriber);
      } catch (error) {
        log.error(error);
      }

      try {
        removeTrack(subscriber.id);
      } catch (error) {
        log.error(error);
      }
    });

    subscriber.addEventListener('unpublished', () => {
      log.info(`subscriber is unpublished ${subscriber.id} - remove track`);

      try {
        removeTrack(subscriber.id);
      } catch (error) {
        log.error(error);
      }
    });

    subscriber.addEventListener('leaving', () => {
      log.info(`subscriber is leaving ${subscriber.id} - remove track`);

      try {
        removeTrack(subscriber.id);
      } catch (error) {
        log.error(error);
      }
    });

    //TODO before removing track verify track indeed ended
    //it is better for user to see black square than to loose active participant
    subscriber.addEventListener('track-ended', () => {
      log.info('captured track ended event');

      /**
       * suggestion
       * removeTrack(id, reason)
       * reason: ended, leaving, terminated, disconnected
       */
    });

    subscriber.addEventListener('failed', () => {
      log.error(`participant ice failed ${subscriber.id}`);

      try {
        onParticipantDisconnected(subscriber);
      } catch (error) {
        log.error(error);
      }

      try {
        removeTrack(subscriber.id);
      } catch (error) {
        log.error(error);
      }
    });

    subscriber.addEventListener('disconnected', () => {
      if (subscriber.terminated) {
        log.error(`participant disconnected ${subscriber.id}... subscriber already terminated...`);
        return;
      }

      log.error(`participant disconnected ${subscriber.id}`);

      try {
        onIceDisconnected(subscriber);
      } catch (error) {
        log.error(error);
      }
    });

    await subscriber.initialize();

    const janusTrack: BlipTrack = {
      type: 'video',
      provider: 'janus',
      uid: subscriber.id,
      id: subscriber.id,
      stream: subscriber.stream,
      source: subscriber,
    };

    try {
      onParticipantConnected(subscriber);
    } catch (error) {
      log.error(error);
    }

    try {
      addTrack(janusTrack);
    } catch (error) {
      log.error(error);
    }
  };

  private onPublisher = (publisher: JanusPublisher) => {
    const { callbacks } = this.options;

    const { addTrack, onDisconnected } = callbacks;

    log.info(`janus onPublisher - ${publisher.id}`, publisher);

    this.publisher = publisher;

    this.publisher.addEventListener('terminated', () => {
      log.info(`janus publisher terminated ${publisher.id}`, publisher);
    });

    this.publisher.addEventListener('disconnected', () => {
      log.info(`janus publisher disconnected ${publisher.id}`, publisher);
    });

    this.publisher.addEventListener('failed', () => {
      log.info(`janus publisher ice failed ${publisher.id}`, publisher);

      try {
        // BEFORE: onDisconnected(null);
        onDisconnected(new Error());
      } catch (error) {
        log.error(error);
      }
    });

    const localTrack = this.getLocalTrack();

    log.info(`janus publisher add local track ${publisher.id}`, localTrack);

    try {
      addTrack(localTrack);
    } catch (error) {
      log.error(error);
    }
  };

  public suspend = async () => {
    await this.suspendAsync();
  };

  public suspendAsync = async () => {
    if (this.suspended) {
      return;
    }

    this.suspended = true;

    if (this.client) {
      if (this.client.publisher) {
        const video = document.getElementById(this.client.publisher.id);

        if (video) {
          try {
            video.remove();
          } catch (error) {
            //
          }
        }
      }

      try {
        //~500ms
        await this.client.terminate();
      } catch (error) {
        log.warn(error);
      }

      this.client = null as any;
    }

    log.info(`janus suspended`);
  };

  public suspendInstantly = () => {
    if (this.suspended) {
      return;
    }

    this.suspended = true;

    if (this.client) {
      if (this.client.publisher) {
        const video = document.getElementById(this.client.publisher.id);

        if (video) {
          try {
            video.remove();
          } catch (error) {
            //
          }
        }
      }

      try {
        this.client.terminateInstantly();
      } catch (error) {
        log.warn(error);
      }

      this.client = null as any;
    }

    log.info(`janus suspended instantly`);
  };

  public getLocalTrack = (): BlipTrack => {
    if (!this.publisher) {
      throw new Error(`
                JanusRTCProvider - getLocalTrack - this.publisher undefined
                connected: ${this.connected}
                joined: ${this.joined}
                suspended: ${this.suspended}
            `);
    }

    const janusLocalTrack: BlipTrack = {
      type: 'video',
      provider: 'janus',
      uid: this.publisher.id,
      id: this.publisher.id,
      stream: this.publisher.stream ?? null,
      source: this.publisher,
      local: true,
    };

    return janusLocalTrack;
  };

  public getUserIdFromTrack = (track: BlipTrack): string => {
    return String(track.uid);
  };

  public toggleAudio = async ({ mute }: { mute: boolean }): Promise<{ success: boolean }> => {
    const { callbacks } = this.options;

    if (mute) {
      try {
        const result = await this.client.mute();
        log.info(result);
        const success = result?.load?.data?.configured === 'ok';
        log.info(`success - ${success}`);
        return {
          success,
        };
      } catch (error) {
        callbacks.onError(error);
      }
    } else {
      try {
        const result = await this.client.unmute();
        log.info(result);
        const success = result?.load?.data?.configured === 'ok';
        log.info(`success - ${success}`);
        return {
          success,
        };
      } catch (error) {
        callbacks.onError(error);
      }
    }

    return {
      success: false,
    };
  };

  public toggleVideo = async ({ enable }: { enable: boolean }): Promise<{ success: boolean }> => {
    const { callbacks } = this.options;

    if (enable) {
      try {
        const result = await this.client.resume();
        log.info(result);
        const success = result?.load?.data?.configured === 'ok';
        log.info(`success - ${success}`);
        return {
          success,
        };
      } catch (error) {
        callbacks.onError(error);
      }
    } else {
      try {
        const result = await this.client.pause();
        log.info(result);
        const success = result?.load?.data?.configured === 'ok';
        log.info(`success - ${success}`);
        return {
          success,
        };
      } catch (error) {
        callbacks.onError(error);
      }
    }

    return {
      success: false,
    };
  };

  public setVideoDevice = async (deviceId: string) => {
    if (!this.client || !this.client.publisher || !this.client.publisher.pc || !this.client.publisher.stream) {
      log.error('set video device - uninitialized');
      return;
    }

    const { callbacks, audioDeviceId } = this.options;

    try {
      await this.client.replaceTracks(deviceId, audioDeviceId ?? '');
      this.options.videoDeviceId = deviceId;
    } catch (error) {
      callbacks.onError(error);
    }
  };

  public setAudioDevice = async (deviceId: string) => {
    if (!this.client || !this.client.publisher || !this.client.publisher.pc || !this.client.publisher.stream) {
      log.error('set audio device - uninitialized');
      return;
    }

    const { callbacks, videoDeviceId } = this.options;

    try {
      await this.client.replaceTracks(videoDeviceId ?? '', deviceId);
      this.options.audioDeviceId = deviceId;
    } catch (error) {
      callbacks.onError(error);
    }
  };

  getSubscribers = () => {
    if (!this.client || !this.client.subscribers) {
      return [];
    }

    return Object.values(this.client.subscribers).filter((element: any) => element && element.ptype === 'subscriber');
  };

  forward = () => {
    if (!this.client || !this.client?.publisher) {
      return null;
    }

    return this.client.publisher.forward();
  };

  stopForward = () => {
    if (!this.client || !this.client?.publisher) {
      return null;
    }

    return this.client.publisher.stop_forward();
  };

  getStats = async () => {
    let stats: any = null;

    let codecs: any = null;

    try {
      stats = await this.client.publisher?.pc.getStats();
      stats = Array.from(stats.entries());
    } catch (error) {
      //
    }

    try {
      codecs = this.client.getAvailableCodecs();
    } catch (error) {
      //
    }

    return {
      stats,
      codecs,
    };
  };
}

export default JanusRTCProvider;
