import * as React from 'react';
import { Component } from 'react';
import BsFillMicFill from '../icons/mic.svg';
import BsFillMicMuteFill from '../icons/mic-off.svg';
import BsCameraVideoFill from '../icons/video.svg';
import BsCameraVideoOffFill from '../icons/video-off.svg';
import FcEndCall from '../icons/end-call.svg';

interface ControlsProps {
  audioEnabled: boolean;
  videoEnabled: boolean;
  style: any;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  endCall: () => void;
}

interface ControlsState {}

export class Controls extends Component<ControlsProps, ControlsState> {
  mounted: boolean;

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { audioEnabled, videoEnabled, onToggleAudio, onToggleVideo, endCall, style } = this.props;

    return (
      <div
        className="controls"
        style={{
          ...style,
        }}
      >
        <div
          onClick={() => {
            onToggleAudio();
          }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '34px',
            height: '34px',
            marginLeft: '10px',
          }}
        >
          {audioEnabled ? (
            <img
              src={BsFillMicFill}
              alt="Mic Icon"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <img src={BsFillMicMuteFill} alt="Mic Off Icon" />
          )}
        </div>
        <div
          id="toggle-video"
          onClick={() => {
            onToggleVideo();
          }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '34px',
            height: '34px',
          }}
        >
          {videoEnabled ? (
            <img
              src={BsCameraVideoFill}
              alt="Video Icon"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          ) : (
            <img src={BsCameraVideoOffFill} alt="Video Off Icon" />
          )}
        </div>
        <div
          id="end-call"
          onClick={() => {
            endCall();
          }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '34px',
            height: '34px',
            marginRight: '7px',
          }}
        >
          <img
            src={FcEndCall}
            alt="End Call Icon"
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
    );
  }
}
