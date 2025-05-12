import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import MilkIcon from "@mui/icons-material/OpacityOutlined";

const drawerWidth = 260;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Client Management", icon: <PeopleIcon />, path: "/admin/clients" },
  { text: "Staff Management", icon: <PersonIcon />, path: "/admin/staff" },
  { text: "Assignments", icon: <AssignmentIcon />, path: "/admin/assignments" },
  { text: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "var(--dark-bg-secondary)",
          borderRight: "1px solid var(--dark-border-light)",
        },
      }}
      className="admin-sidebar"
    >
      <Box
        className="sidebar-logo"
        sx={{ borderBottom: "1px solid var(--dark-border-light)" }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 700,
            background: "var(--dark-gradient-primary)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <MilkIcon sx={{ mr: 1 }} /> Milk Farm CRM
        </Typography>
      </Box>
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              className={`sidebar-menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              sx={{
                py: 1.5,
                px: 2,
                mb: 0.5,
                borderRadius: "8px",
                margin: "4px 8px",
                transition: "var(--dark-transition)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                ...(location.pathname === item.path && {
                  background: "var(--dark-gradient-primary)",
                  boxShadow: "var(--dark-shadow-1)",
                }),
              }}
            >
              <ListItemIcon
                className="sidebar-icon"
                sx={{
                  color:
                    location.pathname === item.path
                      ? "var(--dark-text-primary)"
                      : "var(--dark-text-secondary)",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  className: "sidebar-text",
                  sx: {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color:
                      location.pathname === item.path
                        ? "var(--dark-text-primary)"
                        : "var(--dark-text-primary)",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;
