import { isMobile } from './isMobile';
import { videoStyles } from './videoStyles';

export const getContainerStyle = (participants: number, containerHeight: number, containerWidth: number) => {
  if (isMobile()) {
    return {
      width: 'calc(100% - 10px)',
      height: '70%',
      marginTop: '5px',
      marginLeft: '5px',
      marginRight: '5px',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateRows: 'auto',
      outline: `none`,
    };
  }

  const key = String(participants);

  const selectedStyles = videoStyles[key];

  if (!selectedStyles) {
    return {
      width: 'calc(100% - 10px)',
      height: 'calc(100% - 10px)',
      overflow: 'hidden',
      margin: '5px',
      display: 'grid',
      gridTemplateColumns: participants > 9 ? 'auto auto auto auto' : 'auto auto auto',
      outline: `none`,
    };
  }

  const containerStyle = {
    ...selectedStyles.containerStyle,
  };

  if (participants === 2) {
    if (containerHeight >= containerWidth) {
      containerStyle.gridTemplateColumns = undefined;
      containerStyle.gridTemplateRows = 'auto auto';
    } else {
      containerStyle.gridTemplateColumns = 'auto auto';
      containerStyle.gridTemplateRows = undefined;
    }
  } else if (participants === 3 || participants === 5) {
    if (containerHeight >= containerWidth) {
      containerStyle.flexFlow = 'row wrap';
    } else {
      containerStyle.flexFlow = 'column wrap';
    }
  }

  return containerStyle;
};
