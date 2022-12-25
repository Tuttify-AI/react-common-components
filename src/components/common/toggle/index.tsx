import React, { useCallback } from 'react';
import classNames from 'classnames';
import { ToggleType } from './types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import theme from 'src/styles/theme';

const useStyles = makeStyles(() => ({
  bqToggleWrapper: {
    display: 'inline-flex',
    width: '100%',
    border: `${theme.spacing(0.125)}px solid ${theme.palette.primary.main}`,
    borderRadius: theme.spacing(2.5),
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  bqToggleItem: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    width: theme.spacing(0.23),
    borderRight: `${theme.spacing(0.125)}px solid ${theme.palette.primary.main}`,
    fontSize: 14,
    lineHeight: '22px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: theme.spacing(4.5),
    cursor: 'pointer',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
    },
    '&$:last-child': {
      borderRight: 'none',
    },
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));
const Toggle: React.FC<ToggleType> = (data: ToggleType) => {
  const classes = useStyles();
  const { items, value, onChange } = data;

  const handleToggleClick = useCallback(
    ({ value }) => {
      onChange && onChange(value);
    },
    [onChange]
  );

  return (
    <Grid className={classes.bqToggleWrapper}>
      {items?.map((item, index) => (
        <Grid
          key={index}
          className={classNames({ [`${classes.bqToggleItem}`]: true, [`${classes.active}`]: item.value === value })}
          onClick={() => handleToggleClick(item)}
        >
          {item.label}
        </Grid>
      ))}
    </Grid>
  );
};

export default Toggle;
