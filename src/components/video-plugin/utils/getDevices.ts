import { onError } from './onError';
import { log } from './log';
import { verifyDevice } from './verifyDevice';

export const selectDefaultMicrophone = (audioDevices: MediaDeviceInfo[]): MediaDeviceInfo | null | undefined => {
  if (!audioDevices) {
    return null;
  }

  // select default microphone
  return audioDevices.find(device => device?.deviceId === 'default' && device?.kind === 'audioinput');
};

export const getDevices = async (): Promise<{
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
}> => {
  const d2 = await navigator.mediaDevices.enumerateDevices();

  const vDevices = d2.filter(d => d.kind === 'videoinput' && d.deviceId && d.deviceId.length > 0);

  const a = d2.filter(d => d.kind === 'audioinput' && d.deviceId && d.deviceId.length > 0);

  log.info(vDevices);

  log.info(a);

  const v = Array<MediaDeviceInfo>();

  for (const device of vDevices) {
    const good = await verifyDevice(device);
    if (good) {
      v.push(device);
    } else {
      const error = new Error(`device ${device.label} is not functioning correctly`);
      onError(error);
    }
  }

  const noVideo = !v || v.length === 0;
  const noAudio = !a || a.length === 0;

  if (noVideo && noAudio) {
    throw new Error('unable to access devices');
  }

  const result = {
    videoDevices: v,
    audioDevices: a,
  };

  return result;
};
