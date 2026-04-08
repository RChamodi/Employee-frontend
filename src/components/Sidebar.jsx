import React from "react";
import { List, ListItemButton, ListItemText, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        height: 2000,
        position:"sticky",
        bgcolor: "#1976d2", 
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* App Title */}
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: "bold",
          flexShrink:0,
        }}
      >
        Employee Management System
      </Typography>

      <Box
        sx={{
          flex: 1,             
          overflowY: "auto",    
        }}
      >
      <List>
        <ListItemButton
          onClick={() => navigate("/admin/employees")}
          sx={{
            color: "#fff",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <ListItemText primary="Manage Employees" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/admin/skills")}
          sx={{
            color: "#fff",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <ListItemText primary="Manage Skills" />
        </ListItemButton>
      </List>
    </Box>
    </Box>
  );
}

export default Sidebar;