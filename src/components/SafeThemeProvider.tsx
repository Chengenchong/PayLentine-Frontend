'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme } from '../theme';
import ThemeProvider from './ThemeProvider';

interface SafeThemeProviderProps {
  children: ReactNode;
}

export default function SafeThemeProvider({ children }: SafeThemeProviderProps) {
  return (
    <ThemeProvider>
      <MuiThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeProvider>
  );
}
