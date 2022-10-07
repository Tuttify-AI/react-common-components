import { lookup } from 'mime-types';
import { Nullable } from 'src/types';

type Data = Nullable<File | string> | undefined;

export const getLookup = (data?: Data) => {
  if (!data) {
    return '';
  } else if (data instanceof File) {
    return lookup(data.name) || '';
  } else {
    return lookup(data) || '';
  }
};

export const isImage = (data: Data) => getLookup(data)?.split('/')?.[0] === 'image';

export const isVideo = (data: Data) => getLookup(data)?.split('/')?.[0] === 'video';

export const onPauseAudios = async (ignoreEl?: HTMLAudioElement) => {
  const allAudios = Array.from(document.getElementsByTagName('audio'));
  await Promise.all(
    allAudios.map(async el => {
      if (ignoreEl !== el) {
        el.currentTime = 0;
        await el.pause();
      }
    })
  );
};
