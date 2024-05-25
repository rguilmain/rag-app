import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box } from "@mui/material";

const ChatWindow: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setResponse("Searching...");
      const params = new URLSearchParams();
      params.append("q", query);
      const response = await axios.get(
        `http://localhost:8000/search?${params.toString()}`
      );
      setResponse(response.data.answer);
      if (response.data.error) {
        console.error("Error response from server:", response.data.error);
      }
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
          sx={{
            marginRight: 1,
            width: "400px",
            "& .MuiInputBase-root": {
              height: "56px",
            },
          }}
          label="Search for anything ..."
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
