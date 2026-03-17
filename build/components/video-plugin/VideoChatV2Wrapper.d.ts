import { Component } from 'react';
import { Subscription } from 'rxjs';
import { AgoraBlipConfig, JanusBlipConfig, User } from './types';
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
export declare class VideoChatV2Wrapper extends Component<VideoChatV2WrapperProps, VideoChatV2WrapperState> {
    mounted: boolean;
    dragging: boolean;
    resizing: boolean;
    subscriptions: Subscription[];
    constructor(props: any);
    observeContainer: (scrollableContainer: any) => void;
    onOrientationChange: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onContextMenu: (e: any, ref: any) => void;
    onCloseContextMenu: () => void;
    onDragStart: () => void;
    onDrag: (e: any, d: any) => void;
    onDragStop: (e: any, d: any) => void;
    onResizeStart: () => void;
    onResize: (e: any, direction: any, ref: any, delta: any, position: any) => void;
    onResizeStop: (e: any, direction: any, ref: any, delta: any, position: any) => void;
    onLeaving: () => void;
    remountVideo: () => void;
    render(): JSX.Element;
}
export {};
