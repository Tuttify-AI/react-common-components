import React, { FC, useEffect } from 'react';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Image } from '../common';
import { UserModel } from 'src/types/users';
import theme from 'src/styles/theme';

const useStyles = makeStyles(() => ({
  questionItem: {
    padding: theme.spacing(2),
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: `solid ${theme.spacing(0.25)}px ${theme.palette.fonts.grey_1}`,
    borderRadius: theme.spacing(1.25),
    cursor: 'pointer',
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    border: 'none',
  },
  profile: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    overflow: 'hidden',
    marginRight: theme.spacing(1),
    flexShrink: 0,
    objectFit: 'cover',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1.25),
    img: {
      marginRight: theme.spacing(1),
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  },
  questionName: {
    fontSize: 14,
    lineHeight: '20px',
  },
  questionTitle: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 'bold',
  },
}));

interface Props {
  userId: string;
  getUser: (userId: string) => Promise<void>;
  user: UserModel | null;
  title: string | null | undefined;
  selected: boolean;
  onClick?: () => void;
}

const AskedListItem: FC<Props> = ({ userId, getUser, user, title, selected = false, onClick }) => {
  const classes = useStyles();

  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId, getUser]);

  return (
    <Grid
      onClick={onClick}
      className={classNames({ [`${classes.active}`]: selected }, classes.questionItem)}
      id="asked_list_item"
    >
      {user && (
        <Grid className={classes.questionHeader}>
          <Image
            staticImage
            src={user?.profile_image ?? `${process.env.PUBLIC_URL}/images/user-0.png`}
            alt="Profile image"
            className={classes.profile}
          />
          <Typography className={classes.questionName}>
            {user?.first_name} {user?.last_name}
          </Typography>
        </Grid>
      )}

      <Typography className={classes.questionTitle}>{title}</Typography>
    </Grid>
  );
};

export default AskedListItem;
