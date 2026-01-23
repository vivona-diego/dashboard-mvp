'use client';

import { DatasetProvider } from '../contexts/DatasetContext';
import { AppThemeProvider } from '../contexts/ThemeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider>
      <DatasetProvider>{children}</DatasetProvider>
    </AppThemeProvider>
  );
}
