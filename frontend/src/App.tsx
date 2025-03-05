import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Box,
  Container,
  Switch,
  Typography,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import createAppTheme from "./theme";

const cache = createCache({
  key: "my-app",
  prepend: true,
});

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(() => {
    // Try to get saved preference from localStorage, otherwise use system preference
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null ? JSON.parse(savedMode) : prefersDarkMode;
  });

  // Generate the theme based on current mode
  const theme = createAppTheme(darkMode ? "dark" : "light");

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100vh",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                px: 4,
                backgroundColor: "background.paper",
                boxShadow: theme.shadows[1],
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                Research Assistant
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    icon={<Brightness7Icon />}
                    checkedIcon={<Brightness4Icon />}
                    sx={{
                      "& .MuiSwitch-switchBase": {
                        color: theme.palette.tertiary.main,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: theme.palette.tertiary.main,
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: theme.palette.tertiary.main,
                        },
                    }}
                  />
                }
                label={darkMode ? "Dark" : "Light"}
              />
            </Box>
            <Container
              maxWidth="lg"
              sx={{
                mt: 3,
                mb: 3,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  overflow: "hidden",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Routes>
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/" element={<ChatPage />} />
                </Routes>
              </Box>
            </Container>
          </Box>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
