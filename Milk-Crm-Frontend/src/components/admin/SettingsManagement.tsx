import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SecurityIcon from "@mui/icons-material/Security";
import CustomSettingsIcon from "./SettingsIcon"; // Import our custom settings icon component
import { admin } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/SettingsManagement.css";

const SettingsManagement: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    adminId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await admin.getAll();
      setAdmins(response.data);
      setError("");
    } catch (error: any) {
      setError(error.message || "Failed to fetch admins");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      await admin.add(newAdmin);
      setSuccess("Admin added successfully");
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAdmin = async () => {
    try {
      setIsLoading(true);
      await admin.delete(deleteDialog.adminId);
      setSuccess("Admin deleted successfully");
      fetchAdmins();
      setDeleteDialog({ open: false, adminId: "" });
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete admin");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await admin.changePassword(
        passwordChange.currentPassword,
        passwordChange.newPassword
      );
      setSuccess("Password changed successfully");
      setPasswordChange({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }
  const renderAdminManagement = () => (
    <>
      <Grid item xs={12} md={6} lg={7}>
        <Paper className="settings-panel">
          <Box className="settings-panel-header">
            <CustomSettingsIcon
              icon={<AdminPanelSettingsIcon />}
              bgColor="rgba(33, 150, 243, 0.2)"
              size="medium"
            />
            <Typography className="settings-panel-title">
              Admin Users
            </Typography>
          </Box>
          <CardContent className="settings-panel-content">
            <List>
              {admins.map((admin) => (
                <ListItem key={admin._id} className="admin-list-item">
                  <Avatar
                    sx={{
                      bgcolor: "rgba(33, 150, 243, 0.15)",
                      color: "#64b5f6",
                      mr: 2,
                      fontSize: "1rem",
                    }}
                  >
                    {admin.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText primary={admin.name} secondary={admin.email} />
                  {user?._id !== admin._id && (
                    <ListItemSecondaryAction>
                      <Tooltip title="Delete admin">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setDeleteDialog({ open: true, adminId: admin._id })
                          }
                          className="settings-button-error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
              {admins.length === 0 && (
                <Box className="admin-list-empty">
                  <Typography variant="body2">No admins found</Typography>
                </Box>
              )}
            </List>
          </CardContent>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={5}>
        <Paper className="settings-panel">
          <Box className="settings-panel-header">
            <CustomSettingsIcon
              icon={<PersonAddIcon />}
              bgColor="rgba(76, 175, 80, 0.2)"
              size="medium"
            />
            <Typography className="settings-panel-title">
              Add New Admin
            </Typography>
          </Box>
          <CardContent className="settings-panel-content">
            <form onSubmit={handleAddAdmin} className="settings-form">
              <TextField
                label="Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                fullWidth
                required
                className="settings-form-field"
              />
              <TextField
                label="Email"
                type="email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                fullWidth
                required
                className="settings-form-field"
              />
              <TextField
                label="Password"
                type="password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                fullWidth
                required
                className="settings-form-field"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                className="settings-button settings-button-primary"
              >
                Add Admin
              </Button>
            </form>
          </CardContent>
        </Paper>
      </Grid>
    </>
  );
  const renderPasswordChange = () => (
    <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
      <Paper className="settings-panel">
        <Box className="settings-panel-header">
          <CustomSettingsIcon
            icon={<SecurityIcon />}
            bgColor="rgba(255, 152, 0, 0.2)"
            size="medium"
          />
          <Typography className="settings-panel-title">
            Change Password
          </Typography>
        </Box>
        <CardContent className="settings-panel-content">
          <form onSubmit={handlePasswordChange} className="settings-form">
            <TextField
              label="Current Password"
              type="password"
              value={passwordChange.currentPassword}
              onChange={(e) =>
                setPasswordChange({
                  ...passwordChange,
                  currentPassword: e.target.value,
                })
              }
              fullWidth
              required
              className="settings-form-field"
            />
            <TextField
              label="New Password"
              type="password"
              value={passwordChange.newPassword}
              onChange={(e) =>
                setPasswordChange({
                  ...passwordChange,
                  newPassword: e.target.value,
                })
              }
              fullWidth
              required
              className="settings-form-field"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={passwordChange.confirmPassword}
              onChange={(e) =>
                setPasswordChange({
                  ...passwordChange,
                  confirmPassword: e.target.value,
                })
              }
              fullWidth
              required
              className="settings-form-field"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              className="settings-button settings-button-primary"
            >
              Update Password
            </Button>
          </form>
        </CardContent>
      </Paper>
    </Grid>
  );

  return (
    <Box className="settings-container">
      {" "}
      <Box className="settings-header">
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CustomSettingsIcon
            icon={<SettingsOutlinedIcon />}
            bgColor="rgba(33, 150, 243, 0.2)"
            size="large"
          />
          <Typography className="settings-title" sx={{ ml: 2 }}>
            Settings Management
          </Typography>
        </Box>
        <Typography className="settings-subtitle">
          Manage system settings, admin users and account security
        </Typography>
      </Box>
      {(error || success) && (
        <Box mb={3}>
          {error && (
            <Alert severity="error" className="settings-alert">
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" className="settings-alert">
              {success}
            </Alert>
          )}
        </Box>
      )}
      <Paper className="settings-tab-selector">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="settings tabs"
          textColor="primary"
          indicatorColor="primary"
          centered
          variant="fullWidth"
        >
          <Tab
            label="Admin Management"
            className="settings-tab"
            icon={<AdminPanelSettingsIcon />}
            iconPosition="start"
          />
          <Tab
            label="Security"
            className="settings-tab"
            icon={<SecurityIcon />}
            iconPosition="start"
          />
          <Tab
            label="System Settings"
            className="settings-tab"
            icon={<SettingsOutlinedIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      <Grid container spacing={3}>
        {activeTab === 0 && renderAdminManagement()}
        {activeTab === 1 && renderPasswordChange()}{" "}
        {activeTab === 2 && (
          <Grid item xs={12}>
            <Paper className="settings-panel">
              <Box className="settings-panel-header">
                <CustomSettingsIcon
                  icon={<SettingsOutlinedIcon />}
                  bgColor="rgba(156, 39, 176, 0.2)"
                  size="medium"
                />
                <Typography className="settings-panel-title">
                  System Settings
                </Typography>
              </Box>
              <CardContent className="settings-panel-content">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                  }}
                >
                  <SettingsOutlinedIcon
                    sx={{
                      fontSize: "3rem",
                      mb: 1,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      textAlign: "center",
                      mb: 1,
                    }}
                  >
                    System settings configuration will be available in a future
                    update.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}
                  >
                    This section will allow you to configure system-wide
                    settings, notifications, and preferences.
                  </Typography>
                </Box>
              </CardContent>
            </Paper>
          </Grid>
        )}
      </Grid>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, adminId: "" })}
        PaperProps={{
          className: "settings-dialog",
        }}
      >
        <DialogTitle className="settings-dialog-title">
          Delete Admin
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.87)" }}>
            Are you sure you want to delete this admin? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, adminId: "" })}
            disabled={isLoading}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAdmin}
            className="settings-button-error"
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsManagement;
