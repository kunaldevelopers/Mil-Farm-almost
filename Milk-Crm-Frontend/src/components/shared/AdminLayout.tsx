import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AdminHeader from "./AdminHeader";
import PremiumSidebar from "./PremiumSidebar";
import MenuIcon from "@mui/icons-material/Menu";
import "../admin/ModernDashboard.css";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Automatically collapse sidebar on mobile
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarWidth = sidebarCollapsed ? 82 : 260;

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "var(--dark-bg-primary)",
        minHeight: "100vh",
      }}
      className="admin-layout"
    >
      <AdminHeader />

      {/* Mobile Drawer */}
      {isMobile && (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{
              position: "fixed",
              top: "80px",
              left: "16px",
              zIndex: 1000,
              backgroundColor: "rgba(33, 150, 243, 0.15)",
              color: "#64b5f6",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(33, 150, 243, 0.25)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            open={mobileOpen}
            onClose={handleMobileDrawerToggle}
            sx={{
              "& .MuiDrawer-paper": {
                background: "transparent",
                boxShadow: "none",
                width: "260px",
                marginTop: "70px",
                height: "calc(100% - 70px)",
              },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <PremiumSidebar
              collapsed={false}
              onToggle={handleMobileDrawerToggle}
            />
          </Drawer>
        </>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: "width 0.3s ease",
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: "70px",
              left: 0,
              height: "calc(100vh - 70px)",
              width: sidebarWidth,
              transition: "width 0.3s ease",
              overflow: "hidden",
              zIndex: 100,
            }}
          >
            <PremiumSidebar
              collapsed={sidebarCollapsed}
              onToggle={handleToggleSidebar}
            />
          </Box>
        </Box>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "1.5rem",
          paddingTop: "calc(70px + 1.5rem)",
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
          backgroundColor: "var(--dark-bg-primary)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
