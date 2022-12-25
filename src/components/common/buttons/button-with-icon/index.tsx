import React from 'react';
import classNames from 'classnames';
import { ButtonType } from './types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Image } from 'src/components/common';
import theme from 'src/styles/theme';

const useStyles = makeStyles(() => ({
  edu_btn: {
    height: theme.spacing(5),
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundImage: 'linear-gradient(107deg, #5a63d8, #cd90e1 102%)',
    textTransform: 'uppercase',
    color: theme.palette.common.white,
    whiteSpace: 'nowrap',
    '&:hover': {
      opacity: 0.8,
    },
  },
  initialWidth: ({ width }: Pick<ButtonType, 'width'>) => ({
    minWidth: width,
  }),
  rounded: {
    borderRadius: theme.spacing(6.125),
  },
  plain: {
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    backgroundImage: 'none',
    paddingLeft: 0,
  },
  disabled: {
    backgroundColor: '#d9d9d9',
    color: theme.palette.common.white,
    backgroundImage: 'none',
    cursor: 'not-allowed',
  },
  submitted: {
    border: `solid ${theme.spacing(0.5)}px ${theme.palette.primary.main}`,
  },
  icon: {
    marginLeft: theme.spacing(1.25),
  },
}));
const WithIcon: React.FC<ButtonType> = (data: ButtonType) => {
  const {
    children,
    icon,
    plain,
    rounded,
    disabled,
    submitted,
    width = 'initial',
    height,
    onClick,
    variant,
    className = '',
    color,
  } = data;
  const classes = useStyles({ width });
  return (
    <Button
      className={classNames(
        classes.edu_btn,
        classes.initialWidth,
        rounded && classes.rounded,
        plain && classes.plain,
        disabled && classes.disabled,
        submitted && classes.submitted,
        className
      )}
      id="button_with_icon"
      onClick={() => !disabled && onClick && onClick()}
      style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
      variant={variant}
      color={color}
    >
      {children}
      {icon && disabled && <Image className={classes.icon} staticImage src={icon} height="20" alt="" />}
    </Button>
  );
};

export default WithIcon;
