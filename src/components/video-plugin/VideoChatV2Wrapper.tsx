import * as React from 'react';
import { Component } from 'react';
import { fromEvent, Subscription } from 'rxjs';
import { VideoRoomContainer } from './components/VideoRoomContainer';
import { AgoraBlipConfig, JanusBlipConfig, User } from './types';
import { getScreenOrientation } from './utils/getScreenOrientation';
import { isMobile } from './utils/isMobile';
import { VideoChatV2 } from './VideoV2';

export interface VideoChatV2WrapperProps {
  provider: 'agora' | 'janus';
  agoraConfig?: AgoraBlipConfig;
  janusConfig?: JanusBlipConfig;
  containerStyle?: any;
  user: User;
  onError: (error: any) => void;
  onInfo: (info: string) => void;
  getUser: (id: string) => Promise<User>;
  onJoined?: () => void;
  onLeaving?: () => void;
  onConnecting?: () => void;
  onParticipantConnected?: (participant: any) => void;
  onParticipantDisconnected?: (participant: any) => void;
  onReconnect?: (error: any) => void;
  onDisconnected?: (error: any) => void;
}

interface VideoChatV2WrapperState {
  width: number;
  height: number;
  orientation: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  showContextMenu: boolean;
  showVideo: boolean;
  contextMenuX: number;
  contextMenuY: number;
}

export class VideoChatV2Wrapper extends Component<VideoChatV2WrapperProps, VideoChatV2WrapperState> {
  mounted: boolean;
  dragging: boolean;
  resizing: boolean;
  subscriptions: Subscription[];

  constructor(props) {
    super(props);

    this.state = {
      width: 525,
      height: 270,
      x: 0,
      y: 0,
      orientation: getScreenOrientation(),
      offsetX: 0,
      offsetY: 0,
      showContextMenu: false,
      showVideo: true,
      contextMenuX: 0,
      contextMenuY: 0,
    };

    this.subscriptions = [];
  }

  observeContainer = scrollableContainer => {
    this.subscriptions.push(
      fromEvent(window, 'orientationchange').subscribe(() => this.onOrientationChange()),

      fromEvent(scrollableContainer, 'scroll').subscribe(() => {
        this.setState({
          offsetX: window.scrollX,
          offsetY: window.scrollY,
        });
      })
    );
  };

  onOrientationChange = () => {
    const orientation = getScreenOrientation();

    this.setState({
      orientation,
    });
  };

  componentDidMount() {
    this.mounted = true;

    this.observeContainer(window);
  }

  componentWillUnmount() {
    this.mounted = false;

    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    this.subscriptions = [];
  }

  onContextMenu = (e, ref) => {
    e.preventDefault();

    let bb: any = null;

    if (ref) {
      try {
        bb = ref.resizableElement.current.getBoundingClientRect();
      } catch (error) {}
    }

    let contextMenuX = 0;

    let contextMenuY = 0;

    if (!bb) {
      contextMenuX = e.clientX - this.state.x;
      contextMenuY = e.clientY - this.state.y;
    } else {
      contextMenuX = e.clientX - bb.x;
      contextMenuY = e.clientY - bb.y;
    }

    this.setState(
      {
        showContextMenu: false,
        contextMenuX: 0,
        contextMenuY: 0,
      },
      () => {
        this.setState({
          showContextMenu: true,
          contextMenuX,
          contextMenuY,
        });
      }
    );
  };

  onCloseContextMenu = () => {
    this.setState({
      showContextMenu: false,
      contextMenuX: 0,
      contextMenuY: 0,
    });
  };

  onDragStart = (e, d) => {
    this.dragging = true;
  };

  onDrag = (e, d) => {
    if (this.mounted) {
      this.setState({
        x: d.x - this.state.offsetX,
        y: d.y - this.state.offsetY,
      });
    }
  };

  onDragStop = (e, d) => {
    this.dragging = false;

    if (this.mounted) {
      this.setState({
        x: d.x - this.state.offsetX,
        y: d.y - this.state.offsetY,
      });
    }
  };

  onResizeStart = (e, dir, ref) => {
    this.resizing = true;
  };

  onResize = (e, direction, ref, delta, position) => {
    const width = ref.offsetWidth;

    const height = ref.offsetHeight;

    if (this.mounted) {
      this.setState({
        width,
        height,
      });
    }

    this.onDrag(e, position as any);
  };

  onResizeStop = (e, direction, ref, delta, position) => {
    this.resizing = false;

    this.onResize(e, direction, ref, delta, position);
  };

  onLeaving = () => {
    if (this.props.onLeaving) {
      this.props.onLeaving();
    }
  };

  remountVideo = () => {
    this.setState(
      {
        showVideo: false,
      },
      () => {
        this.setState({
          showVideo: true,
        });
      }
    );
  };

  render() {
    const mobile = isMobile();

    if (mobile) {
      const { orientation } = this.state;

      const vertical = orientation === 0;

      const containerStyle = vertical
        ? ({
            width: '30%',
            height: '30%',
            minWidth: '30vw',
            position: 'absolute',
            top: '10px',
            zIndex: 100000,
            right: '10px',
          } as any)
        : {
            width: '30%',
            height: '100%',
            minWidth: '30vw',
            position: 'absolute',
            zIndex: 100000,
            top: '0px',
            left: '0px',
          };

      return (
        <div
          style={{
            ...containerStyle,
          }}
        >
          {this.state.showVideo && (
            <VideoChatV2
              key={this.props.provider}
              remount={this.remountVideo}
              orientation={this.state.orientation}
              provider={this.props.provider}
              agoraConfig={this.props.agoraConfig}
              janusConfig={this.props.janusConfig}
              containerStyle={this.props.containerStyle}
              user={this.props.user}
              getUser={this.props.getUser}
              onJoined={this.props.onJoined}
              showContextMenu={this.state.showContextMenu}
              contextMenuX={this.state.contextMenuX}
              contextMenuY={this.state.contextMenuY}
              onCloseContextMenu={this.onCloseContextMenu}
              onLeaving={this.onLeaving}
              onConnecting={this.props.onConnecting}
              onParticipantConnected={this.props.onParticipantConnected}
              onParticipantDisconnected={this.props.onParticipantDisconnected}
              onReconnect={this.props.onReconnect}
              onError={this.props.onError}
              onInfo={this.props.onInfo}
              onDisconnected={this.props.onDisconnected}
              containerWidth={this.state.width}
              containerHeight={this.state.height}
            />
          )}
        </div>
      );
    } else {
      return (
        <VideoRoomContainer
          onContextMenu={this.onContextMenu}
          onDrag={this.onDrag}
          onDragStart={this.onDragStart}
          onDragStop={this.onDragStop}
          disableDragging={this.state.showContextMenu}
          onResizeStart={this.onResizeStart}
          onResize={this.onResize}
          onResizeStop={this.onResizeStop}
          width={this.state.width}
          height={this.state.height}
          x={this.state.x + this.state.offsetX}
          y={this.state.y + this.state.offsetY}
        >
          {this.state.showVideo && (
            <VideoChatV2
              key={this.props.provider}
              orientation={this.state.orientation}
              remount={this.remountVideo}
              provider={this.props.provider}
              agoraConfig={this.props.agoraConfig}
              janusConfig={this.props.janusConfig}
              containerStyle={this.props.containerStyle}
              user={this.props.user}
              getUser={this.props.getUser}
              onJoined={this.props.onJoined}
              showContextMenu={this.state.showContextMenu}
              contextMenuX={this.state.contextMenuX}
              contextMenuY={this.state.contextMenuY}
              onCloseContextMenu={this.onCloseContextMenu}
              onLeaving={this.onLeaving}
              onConnecting={this.props.onConnecting}
              onParticipantConnected={this.props.onParticipantConnected}
              onParticipantDisconnected={this.props.onParticipantDisconnected}
              onReconnect={this.props.onReconnect}
              onError={this.props.onError}
              onInfo={this.props.onInfo}
              onDisconnected={this.props.onDisconnected}
              containerWidth={this.state.width}
              containerHeight={this.state.height}
            />
          )}
        </VideoRoomContainer>
      );
    }
  }
}
