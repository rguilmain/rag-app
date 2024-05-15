import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

const ChatWindow: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/search?q=${query}`);
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
      >
        <TextField
          sx={{ marginRight: 1 }}
          label="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </Box>
      <Typography variant="h6">Response:</Typography>
      <Typography sx={{ marginTop: 2, whiteSpace: "pre-wrap" }}>
        {response}
      </Typography>
    </Box>
  );
};

export default ChatWindow;
