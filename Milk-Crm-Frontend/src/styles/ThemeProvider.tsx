// Custom ThemeProvider to apply our dark theme to Material UI components
import React from "react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Create a theme that provides just enough styling to make components work
// Most visual styling will be handled by our custom CSS files
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Slightly lighter dark background
    },
    primary: {
      main: "#2196f3", // Keep this for component states
    },
    secondary: {
      main: "#4caf50",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#03a9f4",
    },
    success: {
      main: "#4caf50",
    },
    text: {
      primary: "#ffffff", // Using white instead of 'inherit'
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.5)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    button: {
      textTransform: "none", // Disable the uppercase transform
    },
  },
  shape: {
    borderRadius: 0, // Reset to 0, let our CSS handle border radius
  },
  // Minimal component overrides - our CSS will handle most styling
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#121212",
          color: "#ffffff",
        },
      },
    },
    // Disable ripple effect globally
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    // Remove text transform from buttons
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    // Remove borders from inputs unless focused
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgba(255, 255, 255, 0.23)",
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
