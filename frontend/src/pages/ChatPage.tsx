import React from "react";
import { Box } from "@mui/material";

import ChatWindow from "../components/ChatWindow";

const ChatPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        padding: 2,
      }}
    >
      <ChatWindow />
    </Box>
  );
};

export default ChatPage;
