import { createTheme, darken, lighten } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export const getTheme = (dark_theme: any) => {
  return createTheme({
    palette: {
      mode: dark_theme ? 'dark' : 'light',
      background: {
        default: dark_theme ? '#0b1d35' : '#fafafa',
        paper: dark_theme ? '#0b1d35' : '#fff',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '&::-webkit-scrollbar': {
              width: '16px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: dark_theme ? '#333' : '#f0f0f0',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: dark_theme ? '#777' : '#c0c0c0',
              borderRadius: '10px',
              border: `2px solid ${dark_theme ? '#333' : '#f0f0f0'}`,
            },
            '*': {
              scrollbarWidth: 'thin',
              scrollbarColor: `${dark_theme ? '#777' : '#c0c0c0'} ${dark_theme ? '#333' : '#f0f0f0'}`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: `var(--MuiSvgIcon-color, ${dark_theme ? '#fff' : '#333'})`,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            ':hover': {
              backgroundColor: dark_theme ? lighten('#07101C', 0.2) : darken('#FAFCFF', 0.2),
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '10px 18px',
            whiteSpace: 'nowrap',
            borderBottom: dark_theme ? '1px solid #1B242F' : '1px solid #E1EAF5',
            textAlign: 'left',
          },
          head: {
            color: dark_theme ? '#9ca3af' : '#374151',
            backgroundColor: dark_theme ? '#07101C' : '#FAFCFF',
            borderTop: dark_theme ? '1px solid #344150' : '1px solid #D2DDEB',
            borderBottom: dark_theme ? '1px solid #344150' : '1px solid #D2DDEB',
            fontWeight: 500,
            textAlign: 'left',
            'z-index': 1,
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            minWidth: 650,
            overflow: 'auto',
          },
        },
        defaultProps: {
          size: 'small',
          stickyHeader: true,
        },
      },
      MuiTextField: {
        defaultProps: {
          autoComplete: 'off',
          InputLabelProps: {
            shrink: true,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: dark_theme ? '#07101c' : '#fff',
            color: dark_theme ? '#fff' : '#000',
            border: `1px solid ${dark_theme ? '#1C2533' : '#E5EAF2'}`,
            fontSize: 12,
            padding: '6px 12px',
            borderRadius: 8,
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          icon: <span style={{ width: 16, height: 16, borderRadius: '50%', display: 'inline-block' }} />,
          checkedIcon: <CheckIcon />,
        },
        styleOverrides: {
          root: {
            padding: 2,
            borderRadius: 8,
            '& .MuiSvgIcon-root': {
              fontSize: 16,
              borderRadius: 8,
            },

            '&.Mui-checked': {
              color: '#fff',
              backgroundColor: '#4F46E5',
              borderRadius: 8,
              border: '2px solid transparent',
              '&:hover': {
                backgroundColor: '#4338CA',
              },
            },

            '&:not(.Mui-checked)': {
              backgroundColor: 'transparent',
              border: dark_theme ? '2px solid #4B5563' : '2px solid #AEC0D6',
              borderRadius: 8,
            },
            '&.Mui-disabled': {
              backgroundColor: dark_theme ? '#1B242F' : '#E1EAF5',
              border: '2px solid transparent',
              color: dark_theme ? '#6B7280' : '#9CA3AF',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: dark_theme ? '#0c111d' : '#fff',
            borderRadius: 10,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: dark_theme ? '#2c3441' : '#ccc',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: dark_theme ? '#4c9aff' : '#333',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: dark_theme ? '#4c9aff' : '#1976d2',
              boxShadow: dark_theme ? '0 0 0 2px rgba(76, 154, 255, 0.2)' : 'none',
            },
            color: dark_theme ? '#fff' : '#000',
          },
          input: {
            color: dark_theme ? '#fff' : '#000',
            padding: '12px',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            width: 34,
            height: 20,
            padding: 0,
            margin: '0px 12px',
            '& .MuiSwitch-switchBase': {
              padding: 2,
              '&.Mui-checked': {
                transform: 'translateX(14px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#3D2EFF',
                  opacity: 1,
                },
              },
            },
            '& .MuiSwitch-thumb': {
              width: 16,
              height: 16,
              backgroundColor: '#fff',
            },
            '& .MuiSwitch-track': {
              borderRadius: 10,
              backgroundColor: '#435264',
              opacity: 1,
              transition: 'background-color 300ms',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: dark_theme ? '#aaa' : '#555',
            '&.Mui-focused': {
              color: dark_theme ? '#fff' : '#1976d2',
            },
          },
        },
      },
    },
  });
};
