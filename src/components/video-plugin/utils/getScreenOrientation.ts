import { isNil, path } from 'ramda';

export const getScreenOrientation = () => {
  let orientation: any = 0;

  try {
    orientation = window.orientation;

    if (isNil(orientation)) {
      orientation = path(['orientation', 'angle'], screen);
    }
  } catch (error) {
    //
  }

  return orientation;
};
