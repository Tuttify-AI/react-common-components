import { onError } from './onError';

export const verifyDevice = (device: MediaDeviceInfo): Promise<boolean> => {
  return navigator.mediaDevices
    .getUserMedia({
      [device.kind == 'audioinput' ? 'audio' : 'video']: {
        deviceId: {
          exact: device.deviceId,
        },
      },
    })
    .then(mediaStreamTrack => mediaStreamTrack.getVideoTracks())
    .then(tracks => {
      tracks.forEach(track => track.stop());
      return true;
    })
    .catch(error => {
      onError(error, 'verifyDevice');
      return false;
    });
};
