import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/PremiumSidebar.css";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Tooltip from "@mui/material/Tooltip";

interface PremiumSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const PremiumSidebar: React.FC<PremiumSidebarProps> = ({
  collapsed = false,
  onToggle,
}) => {
  const location = useLocation();

  // Menu items for the sidebar
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      path: "/admin",
    },
    {
      text: "Client Management",
      icon: <PeopleOutlineIcon />,
      path: "/admin/clients",
    },
    {
      text: "Staff Management",
      icon: <PersonOutlineIcon />,
      path: "/admin/staff",
    },
    {
      text: "Assignments",
      icon: <AssignmentOutlinedIcon />,
      path: "/admin/assignments",
    },
    {
      text: "Settings",
      icon: <SettingsOutlinedIcon />,
      path: "/admin/settings",
    },
  ];

  // Check if current path matches the given path
  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Reset hover state when collapsing/expanding
  useEffect(() => {
    setHoveredItem(null);
  }, [collapsed]);

  // Animation delay for menu items
  const getAnimationDelay = (index: number) => {
    return {
      animationDelay: `${index * 0.05}s`,
    };
  };

  return (
    <div className={`premium-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="premium-sidebar-container">
        <div className="premium-sidebar-header">
          {!collapsed && (
            <h3
              style={{
                margin: 0,
                fontSize: "1.2rem",
                background: "linear-gradient(135deg, #ffffff 0%, #64b5f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}
            >
              Admin Dashboard
            </h3>
          )}
          <div
            className="premium-sidebar-toggle"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeftIcon className="sidebar-collapse-icon" />
          </div>
        </div>

        <div className="premium-sidebar-content">
          <ul className="premium-sidebar-nav">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="premium-sidebar-item"
                style={getAnimationDelay(index)}
              >
                <Tooltip
                  title={collapsed ? item.text : ""}
                  placement="right"
                  arrow
                  disableHoverListener={!collapsed}
                >
                  <Link
                    to={item.path}
                    className={`premium-sidebar-link ${
                      isActive(item.path) ? "active" : ""
                    } ${hoveredItem === item.path ? "hovered" : ""}`}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="premium-sidebar-icon">{item.icon}</span>
                    <span className="premium-sidebar-text">{item.text}</span>
                  </Link>
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>

        {!collapsed && (
          <div className="premium-sidebar-footer">
            <div
              style={{
                fontSize: "0.8rem",
                color: "rgba(255, 255, 255, 0.5)",
                textAlign: "center",
              }}
            >
              Sudha Diary Farm CRM v1.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumSidebar;
