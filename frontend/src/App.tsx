import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container, Switch, Typography } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

const cache = createCache({
  key: "my-app",
  prepend: true,
});

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#3f51b5",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
    },
  });

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
              minHeight: "8vh",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography variant="h3">Research Assistant</Typography>
            </Box>
            <Container maxWidth="md" sx={{ mt: 0, mb: 0, flex: 1 }}>
              <Routes>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ChatPage />} />
              </Routes>
            </Container>
            <Box sx={{ display: "flex", justifyContent: "center", py: 0 }}>
              <Switch checked={darkMode} onChange={toggleDarkMode} />
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
