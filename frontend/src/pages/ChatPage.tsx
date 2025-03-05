import React from "react";
import { Box, useTheme } from "@mui/material";

import ChatWindow from "../components/ChatWindow";

const ChatPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "95%",
          width: "100%",
          overflowY: "auto",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.grey[50],
        }}
      >
        <ChatWindow />
      </Box>
    </Box>
  );
};

export default ChatPage;
