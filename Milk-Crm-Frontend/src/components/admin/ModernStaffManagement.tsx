import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  FormHelperText,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { staff } from "../../services/api";
import { Staff } from "../../types";
import { SelectChangeEvent } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import PasswordIcon from "@mui/icons-material/Password";
import LocationCityIcon from "@mui/icons-material/LocationCity";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  zone: string;
  shift: "AM" | "PM";
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  address: "",
  zone: "",
  shift: "AM",
};

const ModernStaffManagement: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");

  useEffect(() => {
    fetchStaff();
  }, []);
  const fetchStaff = async () => {
    try {
      const response = await staff.getAll();
      setStaffList(response.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear password error when typing
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }

    if (!editingId && formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId) {
        // Only send password if it's provided for update
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
          // Don't include password or confirmPassword if not provided
          const { password, confirmPassword, ...dataWithoutPassword } =
            dataToSend;
          await staff.update(editingId, dataWithoutPassword);
        } else {
          // Include password but not confirmPassword
          const { confirmPassword, ...dataWithPassword } = dataToSend;
          await staff.update(editingId, dataWithPassword);
        }
      } else {
        const { confirmPassword, ...dataToSend } = formData;
        await staff.add(dataToSend);
      }
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchStaff();
    } catch (err) {
      console.error("Error saving staff:", err);
      setError("Failed to save staff. Please check your input and try again.");
    }
  };
  const handleEdit = (staffMember: Staff) => {
    setFormData({
      name: staffMember.name,
      email: staffMember.username || "", // Use username as email
      phone: staffMember.contactNumber || "",
      password: "",
      confirmPassword: "",
      address: staffMember.location || "", // Use location as address
      zone: staffMember.location || "", // Use location as zone too since staff type doesn't have zone
      shift: staffMember.shift as "AM" | "PM",
    });
    setEditingId(staffMember._id);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await staff.delete(id);
        fetchStaff();
      } catch (err) {
        console.error("Error deleting staff:", err);
        setError("Failed to delete staff. Please try again.");
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
    setPasswordError("");
  };
  const filteredStaff = staffList.filter(
    (staffMember) =>
      staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staffMember.username &&
        staffMember.username
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (staffMember.location &&
        staffMember.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Staff Name",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "var(--accent-blue)",
              width: 32,
              height: 32,
              mr: 1,
            }}
          >
            {params.row.name.charAt(0)}
          </Avatar>
          <Typography sx={{ color: "var(--text-primary)" }}>
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "username",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EmailIcon
            sx={{ color: "var(--text-secondary)", mr: 1, fontSize: 16 }}
          />
          <span>{params.row.username}</span>
        </Box>
      ),
    },
    {
      field: "contactNumber",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PhoneIcon
            sx={{ color: "var(--text-secondary)", mr: 1, fontSize: 16 }}
          />
          <span>{params.row.contactNumber || "N/A"}</span>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Zone",
      width: 140,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationCityIcon
            sx={{ color: "var(--text-secondary)", mr: 1, fontSize: 16 }}
          />
          <span>{params.row.location || "Not assigned"}</span>
        </Box>
      ),
    },
    {
      field: "shift",
      headerName: "Shift",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.shift}
          size="small"
          sx={{
            backgroundColor:
              params.row.shift === "AM"
                ? "rgba(29, 161, 242, 0.1)"
                : "rgba(224, 36, 94, 0.1)",
            color:
              params.row.shift === "AM"
                ? "var(--accent-blue)"
                : "var(--accent-red)",
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row)}
            size="small"
            sx={{
              color: "var(--accent-blue)",
              "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.1)" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            size="small"
            sx={{
              color: "var(--accent-red)",
              "&:hover": { backgroundColor: "rgba(224, 36, 94, 0.1)" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <div>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "var(--text-primary)" }}
        >
          Staff Management
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Box
            sx={{
              position: "relative",
              backgroundColor: "var(--bg-card)",
              borderRadius: "8px",
              padding: "0 10px",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchIcon sx={{ color: "var(--text-secondary)" }} />
            <input
              placeholder="Search staff..."
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "var(--text-primary)",
                padding: "8px",
                outline: "none",
                width: "200px",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setShowForm(true)}
            className="dashboard-btn"
            sx={{
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 5px 15px rgba(29, 161, 242, 0.3)",
              },
            }}
          >
            Add Staff
          </Button>
        </Box>
      </Box>

      {error && (
        <Box
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: "rgba(224, 36, 94, 0.1)",
            color: "var(--accent-red)",
            borderRadius: "8px",
            border: "1px solid var(--accent-red)",
          }}
        >
          {error}
        </Box>
      )}

      {showForm && (
        <div className="dashboard-card" style={{ marginBottom: "24px" }}>
          <div className="card-header">
            {editingId ? "Edit Staff Member" : "Add New Staff Member"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <PersonIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <EmailIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                  >
                    <InputLabel id="shift-label">Shift</InputLabel>
                    <Select
                      labelId="shift-label"
                      name="shift"
                      value={formData.shift}
                      label="Shift"
                      onChange={handleSelectChange}
                      required
                      startAdornment={
                        <AccessTimeIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      }
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <LocationOnIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <LocationCityIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingId}
                    InputProps={{
                      startAdornment: (
                        <PasswordIcon
                          sx={{ color: "var(--text-secondary)", mr: 1 }}
                        />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: passwordError
                            ? "var(--accent-red)"
                            : "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                    }}
                    helperText={
                      editingId ? "Leave blank to keep current password" : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!editingId || !!formData.password}
                    error={!!passwordError}
                    helperText={passwordError}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "var(--text-primary)",
                        backgroundColor: "var(--bg-dark-light)",
                        "& fieldset": {
                          borderColor: passwordError
                            ? "var(--accent-red)"
                            : "var(--border-color)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--accent-blue)",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "var(--text-secondary)",
                      },
                      "& .MuiFormHelperText-root": {
                        color: "var(--accent-red)",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    sx={{
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-color)",
                      "&:hover": {
                        borderColor: "var(--text-primary)",
                        backgroundColor: "rgba(136, 153, 166, 0.08)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="dashboard-btn"
                  >
                    {editingId ? "Update Staff" : "Add Staff"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      )}

      <div className="dashboard-card">
        <DataGrid
          rows={filteredStaff}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
          autoHeight
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              color: "var(--text-primary)",
              borderBottom: "1px solid var(--border-color)",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "var(--bg-dark-light)",
              color: "var(--text-secondary)",
              borderBottom: "1px solid var(--border-color)",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-dark-light)",
            },
            "& .MuiTablePagination-root": {
              color: "var(--text-secondary)",
            },
            "& .MuiTablePagination-actions": {
              color: "var(--text-primary)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "rgba(136, 153, 166, 0.04)",
            },
          }}
        />
      </div>
    </div>
  );
};

export default ModernStaffManagement;
