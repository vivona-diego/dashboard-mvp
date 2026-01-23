// src/contexts/ThemeContext.tsx
'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useMemo, 
  type ReactNode, 
  Suspense 
} from 'react';
import { useSearchParams } from 'next/navigation';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/app/theme/themeConfig' // Asegúrate de importar tu configuración

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// 1. Creamos el contexto (vacío por defecto)
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

function ThemeLogic({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get('theme') as ThemeMode | null;
  
  // Estado local
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // 2. Efecto para sincronizar con la URL y montar
  useEffect(() => {
    setMounted(true);
    const targetMode = themeParam === 'dark' ? 'dark' : 'light';
    setMode(targetMode);
  }, [themeParam]);

  // 3. Efecto para manejar la clase 'dark' de Tailwind en el HTML tag
  useEffect(() => {
    if (!mounted) return;
    
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode, mounted]);

  // 4. Generamos el tema de MUI usando useMemo para rendimiento
  const muiTheme = useMemo(() => getTheme(mode === 'dark'), [mode]);

  // Función opcional por si quieres cambiar el tema manualmente (sin URL)
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    // Aquí podrías agregar lógica para actualizar la URL si quisieras
  };

  // Si no está montado, renderizamos un fragmento vacío o un loader para evitar mismatch
  if (!mounted) {
    return <>{children}</>; 
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {/* Aquí inyectamos MUI directamente */}
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

// 5. Componente Principal exportado
export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ThemeLogic>{children}</ThemeLogic>
    </Suspense>
  );
}

// Hook personalizado para usar en tus componentes
export function useAppTheme() {
  return useContext(ThemeContext);
}