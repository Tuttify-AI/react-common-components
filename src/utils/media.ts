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
