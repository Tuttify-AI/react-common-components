import { Component } from 'react';
import { Subscription } from 'rxjs';
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
export declare class ContextMenu extends Component<ContextMenuProps, ContextMenuState> {
    ref: HTMLElement | null;
    subscriptions: Subscription[];
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    onOutsideClick: (e: any) => void;
    render(): JSX.Element;
}
export {};
