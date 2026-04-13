'use client';

import { DatasetProvider } from '../contexts/DatasetContext';
import { AppThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <DatasetProvider>{children}</DatasetProvider>
      </AppThemeProvider>
    </AuthProvider>
  );
}
