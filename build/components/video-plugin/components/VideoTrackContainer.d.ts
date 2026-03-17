/// <reference types="lodash" />
import { Component } from 'react';
import { Subscription } from 'rxjs';
import { BlipTrack, User } from '../types';
import NoSleep from 'nosleep.js';
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
export declare class VideoTrackContainer extends Component<VideoTrackContainerProps, VideoTrackContainerState> {
    container: HTMLElement;
    subscriptions: Subscription[];
    provider: 'agora' | 'janus';
    avatar: string;
    canvas: HTMLCanvasElement;
    detections: HTMLCanvasElement;
    background: string;
    constructor(props: any);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<VideoTrackContainerProps>, prevState: Readonly<VideoTrackContainerState>): void;
    updateAvatar: import("lodash").DebouncedFunc<() => void>;
    componentWillUnmount(): void;
    init: () => Promise<void>;
    observeAgora: () => void;
    observeJanus: () => void;
    injectAgoraStream: () => void;
    injectJanusStream: () => void;
    styleVideoElement: (video: HTMLVideoElement) => void;
    getVideo: () => HTMLVideoElement | null;
    resume: () => Promise<void>;
    setUser: () => void;
    onVideoSuspended: () => void;
    onVideoPaused: () => void;
    observeVideo: (video: HTMLVideoElement, track: BlipTrack) => void;
    tryUnmute: (video: any) => void;
    tryUnmuteGesture: () => void;
    getPlaceholderSrc: () => string;
    render(): JSX.Element;
}
export {};
