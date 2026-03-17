export interface User {
    id: string;
    first_name: string;
    last_name: string;
}
export interface BlipTrack {
    id: string;
    uid: string;
    provider: 'janus' | 'agora';
    type: 'video' | 'audio';
    stream: MediaStream | null;
    source?: any;
    local?: boolean;
}
export interface AgoraBlipConfig {
    appid: string;
    channel: string;
    token: string;
}
export interface ReconnectingWebsocketOptions {
    connectionTimeout: number;
    maxRetries: number;
    maxReconnectionDelay: number;
    minReconnectionDelay: number;
    reconnectionDelayGrowFactor: number;
    minUptime: number;
    maxEnqueuedMessages: number;
    startClosed: boolean;
    debug: boolean;
}
export interface JanusBlipConfig {
    appid: string;
    channel: string;
    token: string;
    server: string;
    transactionTimeout?: number;
    keepAliveInterval?: number;
    rtcConfiguration?: RTCConfiguration;
    websocketOptions?: ReconnectingWebsocketOptions;
}
export declare const minute: number;
export declare const hour: number;
export declare const day: number;
export declare const week: number;
export declare const month: number;
