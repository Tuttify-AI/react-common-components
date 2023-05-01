export const getTransceiver = (pc: RTCPeerConnection, kind: 'audio' | 'video'): RTCRtpTransceiver => {
  let transceiver: RTCRtpTransceiver | null = null;

  const transceivers = pc.getTransceivers();

  if (transceivers && transceivers.length > 0) {
    for (const t of transceivers) {
      if (
        (t.sender && t.sender.track && t.sender.track.kind === kind) ||
        (t.receiver && t.receiver.track && t.receiver.track.kind === kind)
      ) {
        transceiver = t;
        break;
      }
    }
  }

  return transceiver as RTCRtpTransceiver;
};
