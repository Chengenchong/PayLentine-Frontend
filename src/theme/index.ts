'use client';

import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9C89B8',
      light: '#B4A2CD',
      dark: '#856DA9',
    },
    secondary: {
      main: '#4DA1A9',
      light: '#6ABDBF',
      dark: '#41898F',
    },
    background: {
      default: '#F8F6F6',
      paper: '#ffffff',
    },
    text: {
      primary: '#171635',
      secondary: '#FFA630',
    },
  },
  typography: {
    fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: '8px',
          fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#B4A2CD',
      light: '#D4C7E6',
      dark: '#9C89B8',
    },
    secondary: {
      main: '#6ABDBF',
      light: '#8BD3D5',
      dark: '#4DA1A9',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#ffffff',
      secondary: '#FFA630',
    },
  },
  typography: {
    fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h6: {
      fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    body1: {
      fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: '8px',
          fontFamily: '"Fredoka", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
