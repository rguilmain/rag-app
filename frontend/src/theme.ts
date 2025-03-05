import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    surface: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surface?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

// Color palette
const lightPalette = {
  primary: {
    main: '#1A5F7A',
    light: '#2D7D9A',
    dark: '#134C63',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#159895',
    light: '#1FB3B0',
    dark: '#0E7A77',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#FF6B35',
    light: '#FF8559',
    dark: '#E55A2A',
    contrastText: '#FFFFFF',
  },
  surface: {
    main: '#F8F9FA',
    light: '#FFFFFF',
    dark: '#E9ECEF',
  },
  background: {
    default: '#F8F9FA',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212529',
    secondary: '#6C757D',
  },
};

const darkPalette = {
  primary: {
    main: '#57C7FF',
    light: '#83D6FF',
    dark: '#2BA6E9',
    contrastText: '#121212',
  },
  secondary: {
    main: '#25CCC0',
    light: '#4DDED4',
    dark: '#18A59B',
    contrastText: '#121212',
  },
  tertiary: {
    main: '#FF8D58',
    light: '#FFA77C',
    dark: '#E57440',
    contrastText: '#121212',
  },
  surface: {
    main: '#1E1E1E',
    light: '#2D2D2D',
    dark: '#121212',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#E9ECEF',
    secondary: '#ADB5BD',
  },
};

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.0125em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.0125em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: false,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 24px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
        },
        containedPrimary: {
          '&:hover': {
            transform: 'translateY(-1px)',
            transition: 'transform 0.2s',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: mode === 'light' 
            ? '4px 0 16px rgba(0, 0, 0, 0.05)' 
            : '4px 0 16px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: mode === 'light' ? '#f1f1f1' : '#2d2d2d',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: mode === 'light' ? '#c1c1c1' : '#555',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: mode === 'light' ? '#a8a8a8' : '#666',
          },
          transition: 'background 0.2s, color 0.2s',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: mode === 'light' 
            ? '0 6px 18px rgba(0, 0, 0, 0.06)' 
            : '0 6px 18px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' 
              ? '0 12px 24px rgba(0, 0, 0, 0.1)' 
              : '0 12px 24px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '4px 8px',
          transition: 'background 0.2s',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
  },
});

// Create theme
const createAppTheme = (mode: PaletteMode) => {
  let theme = createTheme(getDesignTokens(mode));
  theme = responsiveFontSizes(theme);
  return theme;
};

export default createAppTheme;
