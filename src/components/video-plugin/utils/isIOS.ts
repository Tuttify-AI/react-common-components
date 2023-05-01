export const isIOS = () => {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
  return iOS;
};
