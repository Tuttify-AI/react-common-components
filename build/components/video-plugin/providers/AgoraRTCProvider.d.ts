import { Subscription } from 'rxjs';
import { CameraVideoTrackInitConfig, ConnectionDisconnectedReason, ConnectionState, IAgoraRTCClient, IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, MicrophoneAudioTrackInitConfig } from 'agora-rtc-sdk-ng';
import { BlipTrack } from '../types';
interface AgoraRTCProviderOptions {
    user_id: string;
    token: string;
    app_id: string;
    callbacks: {
        onParticipantConnected: (participant: IAgoraRTCRemoteUser) => void;
        onParticipantDisconnected: (participant: IAgoraRTCRemoteUser) => void;
        onReconnect: (error: any) => void;
        onConnecting: () => void;
        onNetworkQuality: (event: any) => void;
        addTrack: (track: BlipTrack) => void;
        removeTrack: (uid: string) => void;
        onDisconnected: (error: any) => void;
        onError: (error: any) => void;
    };
    micConfig?: MicrophoneAudioTrackInitConfig;
    videoConfig?: CameraVideoTrackInitConfig;
    agora_channel: string;
}
declare class AgoraRTCProvider {
    id: string;
    options: AgoraRTCProviderOptions;
    client: IAgoraRTCClient;
    defaultMicConfig: MicrophoneAudioTrackInitConfig;
    defaultVideoConfig: CameraVideoTrackInitConfig;
    localAudio: IMicrophoneAudioTrack;
    localVideo: ICameraVideoTrack;
    subscriptions: Subscription[];
    initializing: boolean;
    constructor(options: AgoraRTCProviderOptions);
    initialize: () => Promise<void>;
    suspend: () => Promise<void>;
    private _getVideoFromTrack;
    private agoraTrackIntoBlipTrack;
    onUserJoined: (user: IAgoraRTCRemoteUser) => void;
    onUserPublished: ([user, type]: [IAgoraRTCRemoteUser, 'audio' | 'video']) => void;
    onUserLeft: ([user, type]: [IAgoraRTCRemoteUser, string]) => void;
    onUserUnpublished: ([user, type]: [IAgoraRTCRemoteUser, 'audio' | 'video']) => void;
    onConnectionStateChange: ([currentState, previousState, reason]: [
        ConnectionState,
        ConnectionState,
        ConnectionDisconnectedReason
    ]) => void;
    onNetworkQuality: (event: {
        downlinkNetworkQuality: number;
        uplinkNetworkQuality: number;
    }) => void;
    onException: (event: any) => void;
    onCryptError: (event: any) => void;
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
    setVideoDevice: (videoDeviceId: string) => Promise<void>;
    setAudioDevice: (audioDeviceId: string) => void;
    forward: () => void;
    getStats: () => Promise<any>;
    observeClient: () => void;
}
export default AgoraRTCProvider;
