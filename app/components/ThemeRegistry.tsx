'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ReactNode, useMemo } from 'react';
import { getTheme } from './theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const dark_theme = true; // You can replace this with your theme logic
  const theme = useMemo(() => getTheme(dark_theme), [dark_theme]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
