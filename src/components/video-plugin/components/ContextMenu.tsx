import * as React from 'react';
import { Component } from 'react';
import { isNil } from 'ramda';
import { fromEvent, Subscription } from 'rxjs';
import { ContextMenuItem } from './ContextMenuItem';
import { insideTargetArea } from '../utils/insideTargetArea';
import { getDevices } from '../utils/getDevices';
import { onError } from '../utils/onError';

interface ContextMenuProps {
  onSelectAudioDevice: (d: MediaDeviceInfo) => void;
  onSelectVideoDevice: (d: MediaDeviceInfo) => void;
  onReconnect: () => void;
  onSeeStats: () => void;
  onEndCall: () => void;
  onDisplayDetections: () => void;
  onHideDetections: () => void;
  showDetections: boolean;
  selectedVideoDevice: string;
  selectedAudioDevice: string;
  contextMenuX: number;
  contextMenuY: number;
  close: () => void;
}

interface ContextMenuState {
  offset: number;
  selectingCamera: boolean;
  selectingMic: boolean;
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
}

export class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
  ref: HTMLElement | null;
  subscriptions: Subscription[];

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      selectingCamera: false,
      selectingMic: false,
      videoDevices: [],
      audioDevices: [],
    };
    this.subscriptions = [];
  }

  componentDidMount() {
    this.subscriptions.push(fromEvent(window, 'click').subscribe(this.onOutsideClick));

    getDevices()
      .then(({ videoDevices, audioDevices }) => {
        this.setState({
          videoDevices,
          audioDevices,
        });
      })
      .catch(error => {
        onError(error);
      });
  }

  componentWillUnmount() {
    this.subscriptions.map(s => s.unsubscribe());

    this.subscriptions = [];
  }

  onOutsideClick = e => {
    if (isNil(this.ref)) {
      return;
    }

    const x = e.pageX;
    const y = e.pageY;

    const dummyElement = new HTMLElement();

    //TODO scrollable container
    const inside = insideTargetArea(dummyElement, this.ref ?? dummyElement, x, y);

    if (!inside) {
      this.props.close();
    }
  };

  render() {
    const { contextMenuX, contextMenuY, showDetections } = this.props;

    return (
      <div
        ref={e => {
          this.ref = e;
        }}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
        style={{
          paddingLeft: '5px',
          paddingRight: '5px',
          paddingTop: '5px',
          paddingBottom: '5px',
          boxShadow: '0 0 18px rgba(0,0,0,0.2)',
          margin: '5px',
          borderRadius: '5px',
          zIndex: 30000,
          WebkitUserSelect: 'none',
          width: '250px',
          position: 'absolute',
          backgroundColor: 'rgba(238,237,239,1)',
          left: `${contextMenuX}px`,
          top: `${contextMenuY}px`,
        }}
      >
        <div
          onClick={e => {
            e.nativeEvent.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
          }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <ContextMenuItem
            id={'select_camera'}
            title={'Select camera'}
            onClick={() => {
              this.setState({
                selectingCamera: !this.state.selectingCamera,
                selectingMic: false,
              });
            }}
            highlighted={false}
          />
          {this.state.selectingCamera && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 'auto',
              }}
            >
              {this.state.videoDevices.map((d, index) => {
                const selected = d.deviceId === this.props.selectedVideoDevice;

                return (
                  <ContextMenuItem
                    id={selected ? `selected-video-device-${index}` : `video-device-${index}`}
                    key={`device-${d.deviceId}`}
                    title={`${d.label}`}
                    onClick={() => {
                      this.props.onSelectVideoDevice(d);
                      this.props.close();
                    }}
                    highlighted={selected}
                  />
                );
              })}
            </div>
          )}
          <ContextMenuItem
            id={'select_microphone'}
            title={'Select microphone'}
            onClick={() => {
              this.setState({
                selectingMic: !this.state.selectingMic,
                selectingCamera: false,
              });
            }}
            highlighted={false}
          />
          {this.state.selectingMic && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: 'auto',
              }}
            >
              {this.state.audioDevices.map((d, index) => {
                const selected = d.deviceId === this.props.selectedAudioDevice;

                return (
                  <ContextMenuItem
                    id={selected ? `selected-audio-device-${index}` : `audio-device-${index}`}
                    key={`device-${d.deviceId}`}
                    title={`${d.label}`}
                    onClick={() => {
                      this.props.onSelectAudioDevice(d);
                      this.props.close();
                    }}
                    highlighted={selected}
                  />
                );
              })}
            </div>
          )}
          <div
            style={{
              border: '1px solid rgba(200,200,200,0.5)',
              marginTop: '5px',
              marginBottom: '5px',
            }}
          />
          <ContextMenuItem
            id={'reconnect'}
            title={'Reconnect'}
            onClick={() => {
              this.props.onReconnect();
              this.props.close();
            }}
            highlighted={false}
          />
          <ContextMenuItem
            id={'stats'}
            title={'See stats'}
            onClick={() => {
              this.props.onSeeStats();
              this.props.close();
            }}
            highlighted={false}
          />
          <ContextMenuItem
            id={'ai'}
            title={'Display detections'}
            onClick={() => {
              this.props.onDisplayDetections();
              this.props.close();
            }}
            highlighted={false}
            disabled={showDetections}
          />
          <ContextMenuItem
            id={'ai-off'}
            title={'Hide detections'}
            onClick={() => {
              this.props.onHideDetections();
              this.props.close();
            }}
            highlighted={false}
            disabled={!showDetections}
          />
          <div
            style={{
              border: '1px solid rgba(200,200,200,0.5)',
              marginTop: '5px',
              marginBottom: '5px',
            }}
          />
          <ContextMenuItem
            id={'end_call'}
            title={'End call'}
            onClick={() => {
              this.props.onEndCall();
              this.props.close();
            }}
            highlighted={false}
          />
        </div>
      </div>
    );
  }
}
