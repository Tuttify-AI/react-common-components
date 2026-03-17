/// <reference types="lodash" />
import AgoraRTCProvider from './providers/AgoraRTCProvider';
import JanusRTCProvider from './providers/JanusRTCProvider';
import NoSleep from 'nosleep.js';
import { Component } from 'react';
import { Subscription, Subject } from 'rxjs';
import { VideoChatV2WrapperProps } from './VideoChatV2Wrapper';
import { BlipTrack } from './types';
import { Detection } from './providers/janus-client';
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
    isOnline: boolean;
}
export declare class VideoChatV2 extends Component<VideoChatV2Props, VideoChatV2State> {
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
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleOnlineStatus: () => void;
    dispatch: (action: Promise<any>) => void;
    setStateP: (state: Partial<VideoChatV2State>) => Promise<unknown>;
    initialize: () => Promise<void>;
    cleanup: () => Promise<void>;
    observe: () => void;
    onDeviceChange: (event: any) => void;
    onNetworkChange: (connectedToNetwork: boolean) => void;
    getProvider: (provider: 'agora' | 'janus') => JanusRTCProvider | AgoraRTCProvider | undefined;
    roundRect: (ctx: any, x: any, y: any, width: any, height: any, radius: any, color: any, stroke: any) => void;
    drawDetectionsEmotions: (data: any, canvas: any) => void;
    drawDetectionsOpenpose: (data: any, canvas: any) => void;
    getJanusProvider: () => JanusRTCProvider;
    onJanusError: (error: any, _?: any) => void;
    onJanusDisconnected: (error: any) => void;
    getAgoraProvider: () => AgoraRTCProvider;
    addTrack: (track: BlipTrack) => void;
    removeTrack: (uid: string) => void;
    onToggleVideo: import("lodash").DebouncedFunc<() => void>;
    onToggleAudio: import("lodash").DebouncedFunc<() => void>;
    endCall: import("lodash").DebouncedFunc<() => void>;
    leaveRoom: () => void;
    onSelectAudioDevice: (d: MediaDeviceInfo) => Promise<void>;
    onSelectVideoDevice: (d: MediaDeviceInfo) => Promise<void>;
    OfflineStatus: () => JSX.Element;
    Loading: () => JSX.Element;
    subscribeUnlocked: (action: () => Promise<void>, name: string) => void;
    render(): JSX.Element;
}
export {};
