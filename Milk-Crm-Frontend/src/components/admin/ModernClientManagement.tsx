import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { clients } from "../../services/api";
import { Client } from "../../types";
import { SelectChangeEvent } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

interface FormData {
  name: string;
  number: string;
  location: string;
  timeShift: "AM" | "PM";
  pricePerLitre: number;
  quantity: number;
  priorityStatus: boolean;
}

const initialFormData: FormData = {
  name: "",
  number: "",
  location: "",
  timeShift: "AM",
  pricePerLitre: 0,
  quantity: 0,
  priorityStatus: false,
};

const ModernClientManagement: React.FC = () => {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async () => {
    try {
      const response = await clients.getAll();
      setClientsList(response.data);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to fetch clients. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await clients.update(editingId, formData);
      } else {
        await clients.add(formData);
      }
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchClients();
    } catch (err) {
      console.error("Error saving client:", err);
      setError("Failed to save client. Please check your input and try again.");
    }
  };

  const handleEdit = (client: Client) => {
    setFormData({
      name: client.name,
      number: client.number,
      location: client.location,
      timeShift: client.timeShift as "AM" | "PM",
      pricePerLitre: client.pricePerLitre,
      quantity: client.quantity,
      priorityStatus: client.priorityStatus || false,
    });
    setEditingId(client._id);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await clients.delete(id);
        fetchClients();
      } catch (err) {
        console.error("Error deleting client:", err);
        setError("Failed to delete client. Please try again.");
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
  };

  const filteredClients = clientsList.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.number.includes(searchTerm)
  );

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Client Name",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: params.row.priorityStatus
                ? "var(--accent-red)"
                : "var(--accent-blue)",
              width: 32,
              height: 32,
              mr: 1,
            }}
          >
            {params.row.name.charAt(0)}
          </Avatar>
          <Typography sx={{ color: "var(--text-primary)" }}>
            {params.row.name}
            {params.row.priorityStatus && (
              <Tooltip title="Priority Client">
                <PriorityHighIcon
                  color="error"
                  fontSize="small"
                  sx={{ ml: 0.5, verticalAlign: "middle" }}
                />
              </Tooltip>
            )}
          </Typography>
        </Box>
      ),
    },
    { field: "number", headerName: "Contact", width: 140 },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationOnIcon
            sx={{ color: "var(--text-secondary)", mr: 1, fontSize: 16 }}
          />
          <span>{params.row.location}</span>
        </Box>
      ),
    },
    {
      field: "timeShift",
      headerName: "Shift",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.timeShift}
          size="small"
          sx={{
            backgroundColor:
              params.row.timeShift === "AM"
                ? "rgba(29, 161, 242, 0.1)"
                : "rgba(224, 36, 94, 0.1)",
            color:
              params.row.timeShift === "AM"
                ? "var(--accent-blue)"
                : "var(--accent-red)",
          }}
        />
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity (L)",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <WaterDropIcon
            sx={{ color: "var(--accent-blue)", mr: 0.5, fontSize: 16 }}
          />
          <span>{params.row.quantity.toFixed(1)}</span>
        </Box>
      ),
    },
    {
      field: "pricePerLitre",
      headerName: "Price/L (₹)",
      type: "number",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: "var(--accent-green)" }}>
            ₹{params.row.pricePerLitre.toFixed(2)}
          </span>
        </Box>
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
          Client Management
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
              placeholder="Search clients..."
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
            Add Client
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
            {editingId ? "Edit Client" : "Add New Client"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Client Name"
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
                    label="Contact Number"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
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
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
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
                    <InputLabel id="timeShift-label">Time Shift</InputLabel>
                    <Select
                      labelId="timeShift-label"
                      name="timeShift"
                      value={formData.timeShift}
                      label="Time Shift"
                      onChange={handleSelectChange}
                      required
                    >
                      <MenuItem value="AM">AM</MenuItem>
                      <MenuItem value="PM">PM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price Per Litre (₹)"
                    name="pricePerLitre"
                    type="number"
                    value={formData.pricePerLitre}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <LocalOfferIcon
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
                    label="Quantity (Litres)"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <WaterDropIcon
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="priorityStatus"
                        checked={formData.priorityStatus}
                        onChange={handleInputChange}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "var(--accent-red)",
                            "& + .MuiSwitch-track": {
                              backgroundColor: "rgba(224, 36, 94, 0.5)",
                            },
                          },
                        }}
                      />
                    }
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <PriorityHighIcon
                          sx={{ mr: 0.5, color: "var(--accent-red)" }}
                        />
                        Priority Client
                      </Box>
                    }
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
                    {editingId ? "Update Client" : "Add Client"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>
      )}

      <div className="dashboard-card">
        <DataGrid
          rows={filteredClients}
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

export default ModernClientManagement;
