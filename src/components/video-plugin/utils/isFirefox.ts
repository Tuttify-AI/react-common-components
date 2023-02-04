export const isFirefox = () => {
  const f = navigator.userAgent.search('Firefox');

  return f > -1;
};
