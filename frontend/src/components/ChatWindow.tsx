import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Box } from "@mui/material";
import { MuiMarkdown } from "mui-markdown";

const ChatWindow: React.FC = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setResponse("Researching...");
      const params = new URLSearchParams();
      params.append("q", query);
      const serverResponse = await axios.get(
        `http://localhost:8000/search?${params.toString()}`
      );
      setResponse(serverResponse.data.answer);
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
            width: "600px",
            "& .MuiInputBase-root": {
              height: "60px",
            },
          }}
          label="Research anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Search
        </Button>
      </Box>
      <MuiMarkdown>{response}</MuiMarkdown>
    </Box>
  );
};

export default ChatWindow;
