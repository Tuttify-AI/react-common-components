import { isEmpty } from 'ramda';

export const videoIsEmpty = (video: HTMLVideoElement, provider: 'agora' | 'janus'): boolean => {
  if (!video) {
    return false;
  }

  if (!video.srcObject) {
    return true;
  }

  const stream = video.srcObject as MediaStream;

  const videoTracks = stream.getVideoTracks();

  if (provider === 'janus') {
    return isEmpty(videoTracks);
  } else {
    const first = videoTracks[0];

    if (!first) {
      return true;
    }

    return !first.enabled;
  }
};
