import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        {/* Loop through chat rooms or contacts */}
        <ListItem>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Thread 1" />
        </ListItem>
        {/* Repeat for other chat rooms or contacts */}
      </List>
    </Drawer>
  );
}

export default Sidebar;
