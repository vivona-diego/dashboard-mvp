import { createTheme, alpha, ThemeOptions } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Color Palette Definitions
const THEME_COLORS = {
  dark: {
    text: {
      title: '#F3F4F6',
      primaryButton: '#F3F4F6',
      secondaryButton: '#F3F4F6',
    },
    button: {
      primary: '#4C91F7',
      secondary: '#090C10',
      outlinedSecondary: '#374151',
    },
    background: '#090C10',
    filterBar: {
      background: '#2F253E',
      button: '#302C54',
      buttonHover: '#302C54',
      buttonSelected: '#4C91F7',
      buttonOutlined: '#F3F4F6',
      buttonText: '#F3F4F6',
    },
    container: {
      title: '#F3F4F6',
      background: '#1A1423',
      horizontalLines: '#2D333B',
      xyText: '#9CA3AF',
      barColumns: '#2F3C89',
      primaryText: '#F3F4F6',
      secondaryText: '#9CA3AF',
    }
  },
  light: {
    text: {
      title: '#111827',
      primaryButton: '#111827',
      secondaryButton: '#111827',
    },
    button: {
      primary: '#003E82',
      secondary: '#E8EEF5',
      outlinedSecondary: '#A9C0DB',
    },
    background: '#E8EEF5',
    filterBar: {
      background: '#DFECF8',
      button: '#DFECF8',
      buttonHover: '#E5F2F9',
      buttonSelected: '#003E82',
      buttonOutlined: '#111827',
      buttonText: '#111827',
    },
    container: {
      title: '#111827',
      background: '#FFFFFF',
      horizontalLines: '#D1DCE5',
      xyText: '#464A53',
      barColumns: '#A9C0DB',
      primaryText: '#111827',
      secondaryText: '#464A53',
    },
  },
};

export const getTheme = (isDarkMode: boolean) => {
  const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  const themeOptions: ThemeOptions & { customColors?: any } = {
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: colors.background,
        paper: colors.container.background,
      },
      primary: {
        main: colors.button.primary,
      },
      secondary: {
        main: colors.button.secondary,
      },
      text: {
        primary: colors.text.title,
        secondary: colors.text.secondaryButton,
      },
      divider: colors.container.horizontalLines,
    },
    customColors: {
      text: colors.text,
      button: colors.button,
      filterBar: colors.filterBar,
      container: colors.container,
      background: colors.background,
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
            color: colors.text.title,
            transition: 'background-color 0.3s ease, color 0.3s ease',
            '&::-webkit-scrollbar': {
              width: '10px',
              height: '10px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: colors.container.horizontalLines,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: colors.container.horizontalLines,
              borderRadius: '5px',
              '&:hover': {
                backgroundColor: colors.container.secondaryText,
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove default MUI overlay
            backgroundColor: colors.container.background,
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
              backgroundColor: alpha(colors.button.primary, 0.1),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${colors.container.horizontalLines}`,
            padding: '16px',
            color: colors.container.secondaryText,
          },
          head: {
            backgroundColor: isDarkMode ? alpha(colors.button.primary, 0.05) : alpha(colors.button.primary, 0.02),
            color: colors.container.primaryText,
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderBottom: `2px solid ${colors.container.horizontalLines}`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDarkMode ? alpha(colors.button.primary, 0.05) : alpha(colors.button.primary, 0.02),
            },
          },
        },
      },
      // Keep existing specialized overrides if they are still relevant
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: colors.background,
            color: colors.text.title,
            fontSize: '0.75rem',
            padding: '8px 12px',
            borderRadius: 6,
            border: `1px solid ${colors.container.horizontalLines}`,
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          icon: <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${colors.container.secondaryText}` }} />,
          checkedIcon: <CheckIcon style={{ fontSize: 18 }} />,
        },
        styleOverrides: {
          root: {
            padding: 8,
            '&.Mui-checked': {
              color: colors.button.primary,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: colors.container.background,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.container.horizontalLines,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.container.secondaryText,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.button.primary,
              borderWidth: 2,
            },
          },
          input: {
            padding: '12px 16px',
            color: colors.container.primaryText,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
