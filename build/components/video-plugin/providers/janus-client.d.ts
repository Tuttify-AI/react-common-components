import { ReconnectingWebsocketOptions } from '../types';
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
declare class JanusPublisher extends EventTarget {
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
    constructor(options: JanusPublisherOptions);
    suspendStream: () => Promise<void>;
    initialize: () => Promise<any>;
    terminate: () => Promise<void>;
    terminateInstantly: () => void;
    renegotiate: ({ audio, video, mediaConstraints }: {
        audio: any;
        video: any;
        mediaConstraints: any;
    }) => Promise<any>;
    private createPeerConnection;
    private sendTrickleCandidate;
    receiveTrickleCandidate: (candidate: RTCIceCandidateInit) => void;
    createOffer: (mediaConstraints: MediaStreamConstraints) => Promise<RTCSessionDescriptionInit>;
    attach: () => Promise<any>;
    join: () => Promise<any>;
    private leave;
    configure: (data: any) => Promise<any>;
    publish: ({ jsep }: {
        jsep: any;
    }) => Promise<void>;
    forward: () => Promise<any>;
    stop_forward: () => Promise<any>;
    joinandconfigure: (jsep: any) => Promise<any>;
    unpublish: () => Promise<any>;
    detach: () => Promise<any>;
    private hangup;
}
declare class JanusSubscriber extends EventTarget {
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
    constructor(options: JanusSubscriberOptions);
    initialize: (options?: RTCOfferOptions) => Promise<void>;
    terminate: () => Promise<void>;
    terminateInstantly: () => void;
    reconnect: () => Promise<void>;
    createPeerConnection: (configuration?: RTCConfiguration) => void;
    private sendTrickleCandidate;
    receiveTrickleCandidate: (candidate: any) => void;
    createAnswer: (jsep: any, options?: RTCOfferOptions) => Promise<RTCSessionDescriptionInit>;
    attach: () => Promise<any>;
    join: () => any;
    configure: (data: any) => Promise<any>;
    start: (jsep: any) => any;
    private hangup;
    detach: () => Promise<any>;
    private leave;
}
declare class JanusClient {
    server: string;
    room_id: string;
    ws: any;
    terminated: boolean;
    connected: boolean;
    initializing: boolean;
    publisher: JanusPublisher;
    subscribers: {
        [id: string]: JanusSubscriber;
    };
    private calls;
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
    constructor(options: JanusOptions);
    initialize: () => Promise<void>;
    private cleanupCalls;
    terminateInstantly: () => void;
    terminate: () => Promise<void>;
    replaceTracks: (videoDeviceId: string, audioDeviceId: string) => Promise<void>;
    private onClose;
    join: (room_id: string, mediaConstraints: MediaStreamConstraints) => Promise<void>;
    leave: () => Promise<void>;
    private cleanup;
    private onOpen;
    private onMessage;
    private onEvent;
    private onTrickle;
    private onPublishers;
    private onMedia;
    private onUnpublished;
    private onLeaving;
    private onIceFailed;
    getAvailableCodecs: () => RTCRtpCodecCapability[] | undefined;
    private onInternal;
    mute: () => Promise<any>;
    unmute: () => Promise<any>;
    pause: () => Promise<any>;
    resume: () => Promise<any>;
    private transaction;
    getRooms: () => Promise<any>;
    createRoom: (description: string, bitrate: number, bitrate_cap: boolean, videocodec: string, vp9_profile: string, permanent: boolean) => Promise<any>;
}
export { JanusClient, JanusPublisher, JanusSubscriber };
