import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Blue 600
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f0f5ff',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(226, 232, 240, 0.8)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          fontWeight: 600
        }
      }
    }
  }
});

export default theme;
