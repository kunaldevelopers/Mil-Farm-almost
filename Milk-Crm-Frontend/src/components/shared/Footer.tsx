import React, { useState, useEffect } from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        weekday: "long",
      };
      setDateTime(now.toLocaleString("en-IN", options));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        py: 2,
        padding: "16px",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#fff",
          "& span": {
            opacity: 0.7,
          },
          "& strong": {
            color: "#87CEEB",
            opacity: 1,
          },
          "& a": {
            color: "#87CEEB",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      >
        <strong>Sudha Dairy CRM</strong>
        <span>|</span>
        <span>{dateTime}</span>
        <span>|</span>
        <span>Designed & Developed by</span>
        <Link
          href="https://enegixwebsolutions.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ opacity: 1 }}
        >
          EnegiX Global
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
