import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "var(--dark-bg-secondary)",
        color: "var(--dark-text-primary)",
        borderTop: "1px solid var(--dark-border-light)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              letterSpacing: 0.5,
              background: "var(--dark-gradient-primary)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Milk Farm CRM
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--dark-text-secondary)",
              mb: 2,
            }}
          >
            Powered by EnegiX Global
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--dark-text-secondary)" }}
          >
            © {new Date().getFullYear()}{" "}
            <Link
              href="https://enegixwebsolutions.com/"
              sx={{
                color: "var(--dark-primary)",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                  color: "var(--dark-info)",
                },
              }}
            >
              EnegiX Global.
            </Link>{" "}
            All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
