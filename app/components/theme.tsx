import { createTheme, alpha } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Color Palette Definitions
const THEME_COLORS = {
  dark: {
    background: '#0F172A', // Deep Navy/Slate
    paper: '#1E293B',      // Lighter Navy/Slate for cards
    primary: '#6366F1',    // Indigo/Violet accent
    secondary: '#38BDF8',  // Sky Blue accent
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    border: '#334155',
  },
  light: {
    background: '#F1F5F9', // Light Gray/Slate
    paper: '#FFFFFF',      // White
    primary: '#4F46E5',    // Indigo
    secondary: '#0EA5E9',  // Sky Blue
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
    },
    border: '#E2E8F0',
  }
};

export const getTheme = (isDarkMode: boolean) => {
  const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
      divider: colors.border,
    },
    typography: {
      fontFamily: '"Topaz", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: colors.background,
            color: colors.text.primary,
            transition: 'background-color 0.3s ease, color 0.3s ease',
            '&::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isDarkMode ? '#475569' : '#cbd5e1',
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: isDarkMode ? '#64748b' : '#94a3b8',
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove default MUI overlay
            backgroundColor: colors.paper,
            borderRadius: 16,
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.16)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '8px 20px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: alpha(colors.primary, 0.1),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.border}`,
            padding: '16px',
            color: colors.text.secondary,
          },
          head: {
            backgroundColor: isDarkMode ? alpha(colors.primary, 0.05) : alpha(colors.primary, 0.02),
            color: colors.text.primary,
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: `2px solid ${colors.border}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDarkMode ? alpha(colors.primary, 0.05) : alpha(colors.primary, 0.02),
            },
          },
        },
      },
      // Keep existing specialized overrides if they are still relevant
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isDarkMode ? '#0f172a' : '#1e293b',
            color: '#fff',
            fontSize: '0.75rem',
            padding: '8px 12px',
            borderRadius: 6,
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          icon: <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${colors.text.secondary}` }} />,
          checkedIcon: <CheckIcon style={{ fontSize: 18 }} />,
        },
        styleOverrides: {
          root: {
            padding: 8,
            '&.Mui-checked': {
              color: colors.primary,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: isDarkMode ? alpha('#000', 0.2) : '#fff',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.border,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.text.secondary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary,
              borderWidth: 2,
            },
          },
          input: {
            padding: '12px 16px',
          },
        },
      },
    },
  });
};
