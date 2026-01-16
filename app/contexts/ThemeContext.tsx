'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get('theme') as Theme | null;
  const [theme, setTheme] = useState<Theme>(themeParam || 'light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = themeParam || 'light';
    setTheme(currentTheme);
    
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeParam]);

  return <ThemeContext.Provider value={{ theme, mounted }}>{children}</ThemeContext.Provider>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ThemeProviderContent>{children}</ThemeProviderContent>
    </Suspense>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
