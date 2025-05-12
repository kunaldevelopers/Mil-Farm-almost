import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ClickAwayListener } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import "../../styles/PremiumNavbar.css";

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if current path matches the given path
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Handle scroll effect for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      const names = user.name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return "A";
  };

  return (
    <header 
      className="premium-navbar" 
      style={{ 
        backgroundColor: scrolled 
          ? "rgba(18, 18, 18, 0.95)" 
          : "rgba(18, 18, 18, 0.75)",
        position: "fixed",
        width: "100%",
        zIndex: 1100,
      }}
    >
      <div className="premium-navbar-container">
        <div className="premium-navbar-brand">
          <img 
            src="https://cyberkunal.com/wp-content/uploads/2025/05/transparent-cow-milk-logo-735811697035809aczlkl89x9-removebg-preview.png" 
            alt="Sudha Diary Farm" 
            className="premium-navbar-logo" 
          />
          <span className="premium-navbar-title">
            Sudha Diary Farm
          </span>
        </div>
        
        <nav className="premium-navbar-nav">
          <Link 
            to="/admin" 
            className={`premium-navbar-link ${isActive("/admin") ? "active" : ""}`}
          >
            <DashboardOutlinedIcon className="premium-navbar-link-icon" />
            Dashboard
          </Link>
          <Link 
            to="/admin/clients" 
            className={`premium-navbar-link ${isActive("/admin/clients") ? "active" : ""}`}
          >
            <PeopleOutlineIcon className="premium-navbar-link-icon" />
            Client Management
          </Link>
          <Link 
            to="/admin/staff" 
            className={`premium-navbar-link ${isActive("/admin/staff") ? "active" : ""}`}
          >
            <PersonOutlineIcon className="premium-navbar-link-icon" />
            Staff Management
          </Link>
          <Link 
            to="/admin/assignments" 
            className={`premium-navbar-link ${isActive("/admin/assignments") ? "active" : ""}`}
          >
            <AssignmentOutlinedIcon className="premium-navbar-link-icon" />
            Assignments
          </Link>
          <Link 
            to="/admin/settings" 
            className={`premium-navbar-link ${isActive("/admin/settings") ? "active" : ""}`}
          >
            <SettingsOutlinedIcon className="premium-navbar-link-icon" />
            Settings
          </Link>
        </nav>
        
        <div className="premium-navbar-actions">
          <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
            <div className="premium-navbar-profile">
              <div 
                className="premium-navbar-avatar"
                onClick={toggleDropdown}
                style={{
                  backgroundColor: user?.role === "admin" ? "rgba(33, 150, 243, 0.2)" : "rgba(76, 175, 80, 0.2)"
                }}
              >
                {getUserInitials()}
              </div>
              {showDropdown && (
                <div className="premium-navbar-dropdown">
                  <div className="premium-navbar-user-name">
                    {user?.name || "User"}
                  </div>
                  <div className="premium-navbar-dropdown-divider"></div>
                  <div 
                    className="premium-navbar-dropdown-item"
                    onClick={handleLogout}
                  >
                    <LogoutIcon fontSize="small" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
