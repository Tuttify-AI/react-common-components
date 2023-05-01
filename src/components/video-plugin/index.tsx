/**
 * Copyright © 2020 BlipIQ, Inc.
 * Permission to include in application software or to make digital or hard copies in part or all of this work is strictly prohibited.
 */
import 'regenerator-runtime/runtime.js';
import AgoraRTCProvider from './providers/AgoraRTCProvider';
import JanusRTCProvider from './providers/JanusRTCProvider';
import { JanusClient, JanusPublisher, JanusSubscriber } from './providers/janus-client';
import { AgoraBlipConfig, BlipTrack, JanusBlipConfig, User } from './types';
import { VideoChatV2Wrapper } from './VideoChatV2Wrapper';
import { VideoChatV2 } from './VideoV2';

// turn server configuration
// rtcConfiguration: {
//     "iceServers": [
//         {
//             urls: "stun:stun.voip.eutelia.it:3478"
//         },
//         // {
//         //     urls: 'turn:my-turn-server.mycompany.com:19403',
//         //     username: 'optional-username',
//         //     credentials: 'auth-token'
//         // }
//     ],
//     "sdpSemantics" : "unified-plan"
// } as RTCConfiguration,

export {
  VideoChatV2,
  VideoChatV2Wrapper as VideoChat,
  User,
  BlipTrack,
  AgoraBlipConfig,
  JanusBlipConfig,
  JanusClient,
  JanusPublisher,
  JanusSubscriber,
  JanusRTCProvider,
  AgoraRTCProvider,
};
