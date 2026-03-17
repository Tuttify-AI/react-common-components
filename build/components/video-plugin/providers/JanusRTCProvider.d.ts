import { Detection, JanusClient, JanusPublisher, JanusSubscriber } from './janus-client';
import { BlipTrack, ReconnectingWebsocketOptions } from '../types';
import { Response } from './janus-client';
interface JanusOptions {
    janus_room_id: string;
    user_id: string;
    server: string;
    token: string;
    appid: string;
    audioDeviceId: string | null;
    videoDeviceId: string | null;
    rtcConfiguration?: RTCConfiguration;
    websocketOptions?: ReconnectingWebsocketOptions;
    transactionTimeout?: number;
    keepAliveInterval?: number;
    callbacks: {
        onParticipantConnected: (participant: JanusSubscriber) => void;
        onParticipantDisconnected: (participant: JanusSubscriber) => void;
        onIceDisconnected: (participant: JanusSubscriber) => void;
        onReconnect: (error?: any) => void;
        addTrack: (track: BlipTrack) => void;
        removeTrack: (uid: string) => void;
        onError: (error: Error) => void;
        onInternal: (message: Response<any>) => void;
        onMigrate: (handle_id: number) => void;
        onClosed: (handle_id: number) => void;
        onDetection: (data: Detection<any>) => void;
        onDisconnected: (error: Error) => void;
    };
}
/**
this class contains logic for interaction with janus server which is currently deployed at https://dev-janus.blipiq.com
janus project involves multiple repositories, here are some of the links (documentation contained inside):
https://github.com/meetecho/janus-gateway
https://github.com/meetecho/janus-gateway/tree/master/html
*/
declare class JanusRTCProvider {
    client: JanusClient;
    options: JanusOptions;
    rtcConfiguration: RTCConfiguration;
    publisher: JanusPublisher;
    connected: boolean;
    joined: boolean;
    suspended: boolean;
    constructor(options: JanusOptions);
    initialize: () => Promise<void>;
    private activateSubscriber;
    private onPublisher;
    suspend: () => Promise<void>;
    suspendAsync: () => Promise<void>;
    suspendInstantly: () => void;
    getLocalTrack: () => BlipTrack;
    getUserIdFromTrack: (track: BlipTrack) => string;
    toggleAudio: ({ mute }: {
        mute: boolean;
    }) => Promise<{
        success: boolean;
    }>;
    toggleVideo: ({ enable }: {
        enable: boolean;
    }) => Promise<{
        success: boolean;
    }>;
    setVideoDevice: (deviceId: string) => Promise<void>;
    setAudioDevice: (deviceId: string) => Promise<void>;
    getSubscribers: () => JanusSubscriber[];
    forward: () => Promise<any> | null;
    stopForward: () => Promise<any> | null;
    getStats: () => Promise<{
        stats: any;
        codecs: any;
    }>;
}
export default JanusRTCProvider;
