import { colors, darken } from '@material-ui/core';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  overrides: {
    MuiSelect: {
      outlined: {
        borderRadius: 24,
        '&:focus': {
          borderRadius: 24,
        },
      },
    },
    MuiChip: {
      root: {
        height: 'auto',
        minHeight: 32,
      },
      label: {
        paddingTop: 4,
        paddingBottom: 4,
        whiteSpace: 'normal',
        wordBreak: 'break-all',
      },
      sizeSmall: {
        height: 'auto',
        minHeight: 24,
      },
      labelSmall: {
        paddingTop: 2,
        paddingBottom: 2,
      },
    },
    MuiButton: {
      root: {
        borderRadius: 22,
        textTransform: 'initial',
        fontWeight: 600,
        fontSize: 14,
        paddingTop: 14,
        paddingBottom: 14,
        lineHeight: 1.15,
        minWidth: 150,
        '@media (max-width:768px)': {
          minWidth: 100,
        },
      },
      sizeLarge: {
        paddingTop: 18,
        paddingBottom: 18,
      },
      outlined: {
        paddingTop: 14,
        paddingBottom: 14,
      },
    },
    MuiPaper: {
      elevation2: {
        padding: 8,
        borderRadius: 24,
      },
      elevation5: {
        boxShadow: '0 5px 20px 0 rgba(0, 0, 0, 0.15)',
      },
    },
    MuiFormHelperText: {
      root: {
        '&$error': {
          color: '#d22a2a',
          fontSize: 13,
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        color: 'black',
        backgroundColor: 'transparent',
        borderRadius: 24,
        '& fieldset': {
          borderColor: '#eedcf4',
        },
        '&:hover $notchedOutline': {
          borderColor: darken('#eedcf4', 0.1),
        },
        '&$focused': {
          borderColor: '#eedcf4',
        },
        '&$focused $notchedOutline': {
          borderColor: '#eedcf4',
        },
      },
    },
    MuiMenuItem: {
      root: {
        fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
      },
    },
  },
  palette: {
    type: 'light',
    action: {
      active: colors.blueGrey[600],
    },
    background: {
      default: colors.common.white,
      paper: colors.common.white,
    },
    primary: {
      main: '#00cdd5',
      contrastText: '#fff',
      dark: '#00a6a8',
    },
    secondary: {
      main: '#8900ff',
      contrastText: '#fff',
      dark: '#6b00f0',
    },
    error: {
      main: '#ef5350',
    },
    text: {
      primary: '#000000',
    },
    backgrounds: {
      white: '#fafafa',
      black: '#212121',
      disabled: '#d9d9d9',
      babyBoard: '#d6fbe4',
      conference: '#ff6502',
      invitationCard: 'rgba(255,255,255,0.8)',
      grey_1: '#e9e9e9',
      grey_2: '#fafafa',
      grey_4: '#6e6e6f',
      grey_3: '#eaeaea',
      grey_5: 'rgba(54, 52, 61, 0.9)',
      p2p: '#00bcd4',
      divider: '#c4c4c4',
      cyan: '#00cdd5',
      blue: '#326bb4',
      orange: '#ff9100',
      yellow: '#ffac00',
      purple: '#8900ff',
      lightBlue: '#00e5ff',
      red: '#e02020',
      lightCyan: 'rgba(0, 205, 213, 0.1)',
      lightOrange: 'rgba(255, 162, 0, 0.1)',
      lightYellow: 'rgba(255, 204, 0, 0.1)',
      lightPurple: 'rgba(188, 126, 255, 0.1)',
    },
    fonts: {
      purple_1: '#9e45ff',
      purple_2: '#8900ff',
      grey: '#7b7b7b',
      grey_1: '#6f6f6f',
      grey_2: '#555555',
      grey_3: '#f9f7fd',
      grey_4: '#eedcf4',
      grey_5: '#414141',
      grey_6: '#36343d',
      grey_7: '#6e6e6f',
      cyan: '#00cdd5',
      darkCyan: '#00a6a8',
      navy: '#3a5998',
      dark: '#000000de',
      orange_1: '#ffa200',
      yellow: '#ffcc00',
      white: '#ffffff',
    },
    answers: {
      correct: '#44d7b6',
      incorrect: '#d22a2a',
    },
    shadows: {
      card: `0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`,
      cardThin: `0 8px 42px 0 rgba(0, 0, 0, 0.12)`,
      cardHover: `0px 9px 12px rgba(0, 0, 0, 0.14), 0px 3px 16px rgba(0, 0, 0, 0.12), 0px 5px 6px rgba(0, 0, 0, 0.2)`,
      navigationDropdown: '0 1px 5px rgba(0, 0, 0, 0.2)',
      popover: '0 22px 35px 0 rgba(0, 0, 0, 0.14)',
    },
    gradients: {
      button: 'linear-gradient(107deg, #5a63d8, #cd90e1 102%)',
    },
  },

  typography: {
    fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: 14,
      padding: '0 20px',
    },
    h1: {
      fontSize: 96,
      fontWeight: 400,
      fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),
    },
    h2: {
      fontSize: 54,
      fontWeight: 900,
      fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),
    },
    h3: {
      fontSize: 48,
      fontWeight: 900,
      fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),
    },
    h4: {
      fontSize: 34,
      fontWeight: 500,
      fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),
    },
    h5: {
      fontSize: 24,
      fontWeight: 500,
      fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),
    },
    h6: {
      fontSize: 20,
      fontWeight: 700,
      fontFamily: ['Alegreya Sans', 'sans-serif'].join(','),
    },
    body1: {
      fontSize: 16,
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontWeight: 500,
    },
    body2: {
      fontSize: 14,
      lineHeight: '16px',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 600,
    },
    caption: {
      fontSize: 12,
      fontWeight: 500,
    },
    overline: {
      fontSize: 10,
      fontWeight: 500,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1240,
      xl: 1440,
    },
  },
});

export default theme;
