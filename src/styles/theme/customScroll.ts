import { makeStyles } from '@material-ui/core/styles';
import theme from '.';

export const useCustomScroll = makeStyles(() => ({
  scroll: {
    overflowY: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar': {
      width: theme.spacing(1),
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: theme.spacing(1),
    },
  },
}));
