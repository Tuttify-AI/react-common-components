import * as React from 'react';
import { Component } from 'react';
import { Subscription, fromEvent } from 'rxjs';
import { log } from '../utils/log';
import { IRemoteTrack } from 'agora-rtc-sdk-ng';
import { JanusPublisher } from '../providers/janus-client';
import { BlipTrack, User } from '../types';
import { onError } from '../utils/onError';
import { videoIsEmpty } from '../utils/videoIsEmpty';
import { isMobile } from '../utils/isMobile';
import NoSleep from 'nosleep.js';
import { waitUntilActive } from '../utils/waitUntilActive';
import { randomArrayMember } from '../utils/randomArrayMember';
import { drawAvatar } from '../utils/drawAvatar';
import throttle from 'lodash/throttle';
import { isFirefox } from '../utils/isFirefox';

const visible = require('ifvisible.js');

const soft = ['#e6b300', '#a89b28', '#d7743b', '#f0f1f6', '#fec4d2'];

interface VideoTrackContainerProps {
  track: BlipTrack;
  getUser: (id: string) => Promise<User>;
  provider: 'agora' | 'janus';
  noSleep: NoSleep;
  orientation: number;
  containerWidth: number;
  containerHeight: number;
  videoEnabled: boolean;
  local: boolean;
  style: any;
}

interface VideoTrackContainerState {
  user: User | null;
  loading: boolean;
  empty: boolean;
  showUserGestureTip: boolean;
  muted: boolean;
}

export class VideoTrackContainer extends Component<VideoTrackContainerProps, VideoTrackContainerState> {
  container: HTMLElement;
  subscriptions: Subscription[];
  provider: 'agora' | 'janus';
  avatar: string;
  canvas: HTMLCanvasElement;
  detections: HTMLCanvasElement;
  background: string;

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
      empty: false,
      muted: false,
      showUserGestureTip: false,
    };

    this.subscriptions = [];

    this.background = randomArrayMember(soft) ?? '';

    this.canvas = document.createElement('canvas');
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(
    prevProps: Readonly<VideoTrackContainerProps>,
    prevState: Readonly<VideoTrackContainerState>
  ): void {
    const widthChange = prevProps.containerWidth != this.props.containerWidth;
    const heightChange = prevProps.containerHeight != this.props.containerHeight;
    const userChange = !prevState.user && this.state.user;

    if (userChange || widthChange || heightChange) {
      this.updateAvatar();
    }
  }

  updateAvatar = throttle(() => {
    const { user } = this.state;

    if (user && this.container) {
      this.avatar = drawAvatar(this.container, user, this.background, this.canvas);
    }
  }, 100);

  componentWillUnmount() {
    const { track } = this.props;

    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    this.subscriptions = [];

    try {
      const video = this.getVideo();
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.srcObject = null;
        video.load();
        video.remove();
      }
    } catch (error) {
      log.error(error);
    }

    if (track.source && this.provider === 'janus') {
      // const subscriber: JanusSubscriber = track.source;
      // TODO
      // is this necessary to terminate subscribers here if
      // cleanup is initiated in parent component on unmount ???
      // is there any scenarios that this will cover
      // if (subscriber.terminate) {
      //     subscriber.terminate()
      //     .catch((error) => {
      //         log.error(error);
      //     });
      // }
    } else if (track.source && this.provider === 'agora') {
      log.info('attempt suspending agora track inside track container...');

      if (track.source.setEnabled) {
        track.source
          .setEnabled(false)
          .then(() => {
            log.info('agora track disabled...');
          })
          .catch(error => {
            log.info(error);
          });
      }
    }
  }

  init = async () => {
    const { track } = this.props;

    this.provider = this.props.provider;

    const video = document.createElement('video');

    video['playsInline'] = true;
    video.muted = !!track.local;
    video.autoplay = true;
    video.id = `video-${track.id}`;
    video.srcObject = track.stream;
    video.style.transform = 'translate(0px, 0px) scale(1, 1)';

    const empty = videoIsEmpty(video, this.props.provider);

    if (empty) {
      this.setState({
        empty,
      });
      if (this.props.provider === 'agora') {
        this.setState({
          loading: false,
        });
      }
    }

    this.styleVideoElement(video);

    this.container.appendChild(video);

    this.setUser();

    this.observeVideo(video, track);

    if (!track.local) {
      this.tryUnmute(video);
    }

    if (!track.source) {
      return;
    }

    if (this.provider === 'agora') {
      this.observeAgora();
    } else if (this.provider === 'janus') {
      this.observeJanus();
    }
  };

  observeAgora = () => {
    const { track } = this.props;

    const source = track.source as IRemoteTrack;
    if (!track.stream) {
      return;
    }
    const tracks = track.stream.getVideoTracks();
    const mediaStreamTrack: MediaStreamTrack | undefined = tracks[0];

    this.subscriptions.push(
      fromEvent(source as any, 'first-frame-decoded').subscribe(() => {
        log.info(track, 'first-frame-decoded');
      }),

      fromEvent(source as any, 'track-ended').subscribe(() => {
        log.warn(track, 'track-ended');

        this.injectAgoraStream();
      }),

      fromEvent(mediaStreamTrack, 'ended').subscribe(() => {
        log.warn(track, 'ended');

        this.injectAgoraStream();
      })
    );
  };

  observeJanus = () => {
    const { track } = this.props;

    const source = track.source as JanusPublisher;

    this.subscriptions.push(
      fromEvent(source, 'device-change').subscribe(() => {
        log.info(track, 'device-change');

        this.injectJanusStream();
      }),

      fromEvent(source, 'mute').subscribe(() => {
        log.info(track, 'muted');

        this.setState({
          muted: true,
        });
      }),

      fromEvent(source, 'unmute').subscribe(() => {
        log.info(track, 'unmuted');

        this.setState({
          muted: false,
        });
      })
    );
  };

  injectAgoraStream = () => {
    log.info('inject agora stream');

    const { track } = this.props;

    const source = track.source as IRemoteTrack;

    const stream = new MediaStream([source.getMediaStreamTrack()]);

    const video = this.getVideo();

    if (video) {
      video.srcObject = stream;
    }
  };

  injectJanusStream = () => {
    log.info('inject janus stream');

    const { track } = this.props;

    const publisher: JanusPublisher = track.source;

    const stream = publisher.stream;

    const video = this.getVideo();

    if (video) {
      video.srcObject = stream ?? null;
    }
  };

  styleVideoElement = (video: HTMLVideoElement): void => {
    const mobile = isMobile();
    const vertical = this.props.orientation == 0;

    //TODO verify
    if (mobile) {
      if (vertical) {
        video.style.minWidth = ``;
        video.style.maxWidth = ``;
        video.style.minHeight = `100%`;
        video.style.maxHeight = `100%`;
        video.style.height = `100%`;
        video.style.width = `100%`;
        video.style.objectFit = `cover`;
        video.style.objectPosition = `center`;
      } else {
        video.style.minHeight = ``;
        video.style.maxHeight = ``;
        video.style.minWidth = `100%`;
        video.style.maxWidth = `100%`;
        video.style.width = `100%`;
        video.style.height = `100%`;
        video.style.objectFit = `cover`;
        video.style.objectPosition = `center`;
      }
    } else {
      video.style.position = 'relative';
      video.style.objectFit = 'cover'; //"contain";
      video.style.width = '100%';
      //el.style.transform = 'translate(0px, 0px) scale(1, 1)';
      //el.style.maxHeight = "";
      //el.style.zIndex = "";
      video.style.objectPosition = `center`;
      // video.style.display = "flex";
      // video.style.alignItems = "center";
      // video.style.justifyContent = "center";
      video.style.height = '100%';
      video.style.borderRadius = '14px'; //"0px";
    }
  };

  getVideo = (): HTMLVideoElement | null => {
    if (!this.container) {
      return null;
    }

    const children = [...(this.container.children as any)];

    return children.find(el => el.tagName === 'VIDEO');
  };

  resume = async () => {
    if (!this.container) {
      return;
    }

    this.container.focus();

    const el = this.getVideo();

    if (el && el.muted) {
      if (this.props.track && this.props.track.local) {
        el.muted = true;
      } else {
        el.muted = false;
      }
    }

    if (el && el.paused) {
      try {
        await el.play();
        this.setState({
          showUserGestureTip: false,
        });
      } catch (error) {
        log.error(error);
      }
    }
  };

  setUser = () => {
    const { track, getUser } = this.props;

    getUser(track.uid)
      .then(user => {
        this.setState({ user });
      })
      .catch(error => {
        log.error(error);
      });
  };

  // video suspended can be called when mobile chat opened on safari (meaning nothing should be done)
  //try to use current source to re-inject source object (maybe useless)
  onVideoSuspended = () => {
    //TODO
    //const el : HTMLVideoElement = this.getVideo();
    //this.props.onVideoSuspended(el, this.mounted);

    if (isFirefox()) {
      log.tag('firefox', 'info')('suspend');
      return;
    }

    if (this.provider === 'janus') {
      this.injectJanusStream();
    } else if (this.provider === 'agora') {
      this.injectAgoraStream();
    }
  };

  onVideoPaused = () => {
    const el: HTMLVideoElement | null = this.getVideo();

    this.tryUnmute(el);
  };

  observeVideo = (video: HTMLVideoElement, track: BlipTrack) => {
    this.subscriptions.push(
      fromEvent(video, 'abort').subscribe(event => {
        log.tag(track.id, 'info')('abort', track, event);
      }),

      fromEvent(video, 'canplay').subscribe(event => {
        log.tag(track.id, 'info')('canplay', track, event);
      }),

      fromEvent(video, 'emptied').subscribe(event => {
        log.tag(track.id, 'info')('emptied', track, event);
      }),

      fromEvent(video, 'ended').subscribe(event => {
        log.tag(track.id, 'info')('ended', track, event);
      }),

      fromEvent(video, 'error').subscribe(event => {
        log.tag(track.id, 'info')('error', track, event);

        onError(event, 'video');
      }),

      fromEvent(video, 'loadeddata').subscribe(event => {
        log.tag(track.id, 'info')('loadeddata', track, event);
      }),

      fromEvent(video, 'pause').subscribe(event => {
        log.tag(track.id, 'info')('pause', track, event);

        if (!isMobile()) {
          this.onVideoPaused();
        }
      }),

      fromEvent(video, 'play').subscribe(event => {
        log.tag(track.id, 'info')('play', track, event);
      }),

      fromEvent(video, 'playing').subscribe(event => {
        log.tag(track.id, 'info')('playing', track, event);

        if (isMobile()) {
          this.setState({
            loading: false,
          });
          return;
        }

        let empty = false;

        try {
          empty = videoIsEmpty(video, this.props.provider);
        } catch (error) {
          onError(error);
        }

        this.setState({
          loading: false,
          empty,
        });
      }),

      // fromEvent(video, "progress")
      // .subscribe((event) => {

      //     log.tag(track.id, 'info')("progress", track, event);

      // }),

      fromEvent(video, 'ratechange').subscribe(event => {
        log.tag(track.id, 'info')('ratechange', track, event);
      }),

      fromEvent(video, 'stalled').subscribe(event => {
        log.tag(track.id, 'info')('stalled', track, event);
      }),

      fromEvent(video, 'suspend').subscribe(event => {
        log.tag(track.id, 'info')('suspend', track, event);

        if (!isMobile()) {
          this.onVideoSuspended();
        }
      }),

      fromEvent(video, 'volumechange').subscribe(event => {
        log.tag(track.id, 'info')('volumechange', track, event);
      }),

      fromEvent(video, 'waiting').subscribe(event => {
        log.tag(track.id, 'info')('waiting', track, event);
      })
    );
  };

  tryUnmute = video => {
    log.info('try play...');

    video
      .play()
      .then(() => {
        //unmute on success
        video.muted = false;

        if (video.paused) {
          throw new Error('paused - should ask permission');
        }

        log.info(`try play...success...`);
      })
      .catch(error => {
        onError(error, `tryUnmute: ${error.message}`);

        video.muted = true;
        //try setting autoplay to false
        video.autoplay = false;

        this.setState({
          showUserGestureTip: true,
          loading: false,
        });
      });
  };

  tryUnmuteGesture = () => {
    log.info('trying unmute gesture');

    if (this.container) {
      try {
        this.container.focus();
      } catch (error) {
        onError(error);
      }
    }

    if (this.props.noSleep && !this.props.noSleep.isEnabled) {
      this.props.noSleep
        .enable()
        .then(() => {
          log.info('no sleep video track');
        })
        .catch(error => {
          onError(error, 'no sleep enable video track');

          if (visible.now('hidden')) {
            waitUntilActive()
              .then(() => {
                return this.props.noSleep.enable().then(() => {
                  log.info('no sleep done video track');
                });
              })
              .catch(error => {
                onError(error, 'no sleep 2 enable video track');
              });
          }
        });
    }

    const video = this.getVideo();

    if (video) {
      video
        .play()
        .then(() => {
          video.muted = false;

          this.setState({
            showUserGestureTip: false,
          });
        })
        .catch(error => {
          onError(error, `tryUnmuteGesture: ${error.message}`);

          this.setState({
            showUserGestureTip: false,
          });
        });
    }
  };

  getPlaceholderSrc = () => {
    if (!this.avatar) {
      return 'https://picsum.photos/id/237/200/300';
    } else {
      return this.avatar;
    }
  };

  render() {
    const { track, style, local, videoEnabled } = this.props;
    const { user, muted, empty, loading } = this.state;
    const showPlaceholder = (empty || muted || (local && !videoEnabled)) && !loading;
    const placeholderSrc = this.getPlaceholderSrc();
    const mobile = isMobile();
    const video = this.getVideo();

    if (video) {
      this.styleVideoElement(video);
    }

    return (
      <div
        id={track.id}
        tabIndex={0}
        ref={(e: any) => {
          this.container = e;
        }}
        onMouseDown={() => this.resume()}
        style={style}
      >
        <canvas
          id={`canvas-${track.uid}`}
          ref={(e: any) => {
            this.detections = e;
          }}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            position: 'absolute',
            zIndex: 1,
            top: 0,
            left: 0,
          }}
        />
        {this.state.loading && (
          <div
            style={{
              position: 'absolute',
              borderRadius: mobile ? '0px' : '14px',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(33, 99, 120, 0.8)',
            }}
          >
            Connecting...
          </div>
        )}
        {user && !isMobile() && (
          <div
            style={{
              position: `absolute`,
              top: `10px`,
              left: `10px`,
              color: `ghostwhite`,
              fontSize: `16px`,
              display: `flex`,
              whiteSpace: `nowrap`,
              alignItems: `center`,
              zIndex: 100,
              justifyContent: `flex-end`,
              textShadow: `rgb(0 0 0) 0px 0px 3px`,
              letterSpacing: `1px`,
              userSelect: `none`,
            }}
          >
            {`${user.first_name} ${user.last_name}`}
          </div>
        )}
        {!this.state.loading && this.state.showUserGestureTip && (
          <div
            id="permission-overlay"
            onClick={() => {
              this.tryUnmuteGesture();
            }}
            style={{
              position: `absolute`,
              top: `0px`,
              cursor: `pointer`,
              left: `0px`,
              color: `white`,
              fontSize: `16px`,
              borderRadius: '14px',
              display: `flex`,
              textAlign: `center`,
              alignItems: `center`,
              justifyContent: `center`,
              zIndex: 2200,
              userSelect: `none`,
              width: `100%`,
              height: `100%`,
              background: `rgba(100, 100, 100, 0.5)`,
            }}
          >
            Please click here to allow video play
          </div>
        )}
        {showPlaceholder && (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 1)',
            }}
          >
            <img
              draggable={false}
              src={placeholderSrc}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
