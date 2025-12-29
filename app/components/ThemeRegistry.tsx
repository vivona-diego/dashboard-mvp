'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ReactNode, useMemo } from 'react';
import { getTheme } from './theme';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const globalTheme = useMemo(() => getTheme(theme === 'dark'), [theme]);

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
