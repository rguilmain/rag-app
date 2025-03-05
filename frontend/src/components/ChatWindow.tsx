import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade,
  useTheme,
  Grow,
} from "@mui/material";
import { MuiMarkdown } from "mui-markdown";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import MemoryIcon from "@mui/icons-material/Memory";

const ChatWindow: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const handleClear = () => {
    setQuery("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setHasSearched(true);
      setResponse("Researching...");
      const params = new URLSearchParams();
      params.append("q", query);
      const serverResponse = await axios.get(
        `http://localhost:8000/search?${params.toString()}`
      );
      setResponse(serverResponse.data.answer);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse(
        "Sorry, I encountered an error while researching. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // No auto-scroll effect needed as we want the user to control scrolling

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 4,
          width: "100%",
          maxWidth: "95%", // Using most of the screen width
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What would you like to know?"
          label="Ask anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            marginRight: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              transition: "all 0.3s",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                transform: "translateY(-2px)",
              },
              "& fieldset": {
                borderWidth: 1,
              },
              "&.Mui-focused fieldset": {
                borderWidth: 2,
                borderColor: theme.palette.primary.main,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={handleClear} size="small">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={!query.trim() || isLoading}
          sx={{
            borderRadius: "12px",
            padding: "12px 24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Search"
          )}
        </Button>
      </Box>

      {!hasSearched ? (
        <Grow in={!hasSearched} timeout={800}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              padding: 3,
              opacity: 0.8,
            }}
          >
            <LightbulbIcon
              sx={{
                fontSize: 64,
                color: theme.palette.tertiary.main,
                marginBottom: 2,
              }}
            />
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              What would you like to know?
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="textSecondary"
              sx={{ maxWidth: "800px" }}
            >
              Ask me anything! I can help with research, answer questions,
              explain concepts, and provide information on a wide range of
              topics.
            </Typography>
          </Box>
        </Grow>
      ) : (
        <Fade in={hasSearched} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              padding: "28px 36px", // Even more generous padding
              marginTop: 2,
              width: "100%",
              maxWidth: "95%", // Using most of the screen width
              borderRadius: "12px",
              transition: "all 0.3s",
              backgroundColor: theme.palette.background.paper,
              position: "relative",
              minHeight: "200px", // Minimum height
              maxHeight: "82vh", // Maximum height to prevent too large containers
              height: "auto", // Allow height to adjust based on content
              display: "flex",
              flexDirection: "column",
              overflow: "hidden", // Prevent Paper itself from scrolling
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  backgroundColor: theme.palette.primary.main,
                  backgroundImage: `linear-gradient(
                    to right,
                    ${theme.palette.primary.main},
                    ${theme.palette.secondary.main},
                    ${theme.palette.primary.main}
                  )`,
                  backgroundSize: "200% 100%",
                  animation: "loading 2s linear infinite",
                  "@keyframes loading": {
                    "0%": { backgroundPosition: "0 0" },
                    "100%": { backgroundPosition: "200% 0" },
                  },
                }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: 3, // Increased spacing
              }}
            >
              <MemoryIcon
                sx={{
                  color: theme.palette.secondary.main,
                  marginRight: 1,
                  fontSize: 24, // Slightly increased
                }}
              />
              <Typography
                variant="h6" // Changed from subtitle1 to h6 for better visibility
                sx={{
                  fontWeight: 600,
                  color: theme.palette.secondary.main,
                }}
              >
                Research Result
              </Typography>
            </Box>

            <Box
              ref={responseRef}
              sx={{
                overflowY: "auto !important", // Force scrolling
                overflowX: "hidden",
                flex: "1 1 auto",
                paddingRight: 3, // Increased from 2
                paddingBottom: 3, // Increased from 2
                height: "calc(100% - 50px)", // Account for header
                WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                msOverflowStyle: "scrollbar", // Scrollbar styling for IE
                scrollbarWidth: "thin", // Firefox scrollbar
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                },
                "& .MuiMarkdown-root": {
                  fontSize: "1.25rem", // Larger font
                  lineHeight: 1.9, // Increased from 1.8 for even better readability
                  letterSpacing: "0.015em", // Better letter spacing
                  "& h1": {
                    fontSize: "2.75rem", // Increased from 2.5rem
                    fontWeight: 700,
                    marginBottom: "1.25rem",
                    marginTop: "1.5rem",
                    lineHeight: 1.3,
                  },
                  "& h2": {
                    fontSize: "2.2rem", // Increased from 2rem
                    fontWeight: 600,
                    marginBottom: "1rem",
                    marginTop: "1.75rem",
                    lineHeight: 1.3,
                  },
                  "& h3": {
                    fontSize: "1.75rem", // Increased from 1.5rem
                    fontWeight: 600,
                    marginBottom: "0.875rem",
                    marginTop: "1.5rem",
                    lineHeight: 1.4,
                  },
                  "& p": {
                    marginBottom: "1.5rem", // Increased paragraph spacing
                    maxWidth: "80ch", // Optimal reading width
                  },
                  "& pre": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
                    borderRadius: "8px",
                    padding: "16px",
                    overflowX: "auto",
                    margin: "24px 0", // Increased margin
                    border: `1px solid ${
                      theme.palette.mode === "dark" ? "#444" : "#e0e0e0"
                    }`,
                    fontSize: "1.1rem", // Slightly smaller than regular text
                  },
                  "& code": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2d2d2d" : "#f5f5f5",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontFamily: "monospace",
                    fontSize: "1.1rem", // Consistent with pre
                  },
                  "& blockquote": {
                    borderLeft: `4px solid ${theme.palette.tertiary.main}`,
                    paddingLeft: "20px", // Increased from 16px
                    margin: "24px 0", // Increased from 16px
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  },
                  "& a": {
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    borderBottom: `1px solid ${theme.palette.primary.main}`,
                    transition: "all 0.2s",
                    "&:hover": {
                      color: theme.palette.primary.dark,
                      borderBottomWidth: "2px",
                    },
                  },
                  "& img": {
                    maxWidth: "100%",
                    borderRadius: "8px",
                    margin: "24px 0", // Increased from 16px
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  "& ul, & ol": {
                    paddingLeft: "2.5rem", // Increased from 2rem
                    marginBottom: "1.5rem", // Increased from 1.25rem
                  },
                  "& li": {
                    marginBottom: "0.75rem", // Increased from 0.5rem
                  },
                  "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: "1.5rem",
                    marginTop: "1.5rem",
                  },
                  "& th": {
                    borderBottom: `2px solid ${theme.palette.divider}`,
                    padding: "12px 16px",
                    textAlign: "left",
                    fontWeight: "bold",
                  },
                  "& td": {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: "12px 16px",
                  },
                  // Add support for horizontal rule
                  "& hr": {
                    margin: "32px 0",
                    border: "none",
                    height: "1px",
                    backgroundColor: theme.palette.divider,
                  },
                },
              }}
            >
              <MuiMarkdown>{response}</MuiMarkdown>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default ChatWindow;
