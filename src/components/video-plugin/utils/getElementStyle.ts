import { isMobile } from './isMobile';
import { videoStyles } from './videoStyles';

export const getElementStyle = (participants: number, index: number) => {
  if (isMobile()) {
    return {
      position: 'relative',
      width: 'calc(100% - 10px)',
      height: 'calc(100% - 10px)',
      maxHeight: participants === 1 ? '50%' : undefined,
      display: 'flex',
      overflow: 'hidden',
      outline: 'none',
      borderRadius: '14px',
      margin: '5px',
    };
  }

  const key = String(participants);

  const selectedStyles = videoStyles[key];

  if (!selectedStyles) {
    return {
      position: 'relative',
      width: 'calc(100% - 10px)',
      height: 'calc(100% - 10px)',
      display: 'flex',
      overflow: 'hidden',
      outline: 'none',
      borderRadius: '27px',
      margin: '5px',
    };
  }

  const elementStyle = {
    ...selectedStyles.elementStyle,
  };

  if (participants === 5 && index > 2) {
    elementStyle.flexBasis = '50%';
  }

  return elementStyle;
};
