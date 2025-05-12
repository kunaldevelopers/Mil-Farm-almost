import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
} from "@mui/material";
import { admin } from "../../services/api";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import "../admin/ModernDashboard.css";

// Keep all the interfaces from the original Dashboard.tsx
interface DashboardData {
  counts: {
    totalClients: number;
    totalStaff: number;
  };
  today: {
    date: string;
    quantity: number;
    revenue: number;
    successRate: number;
  };
  monthly: {
    quantity: number;
    revenue: number;
  };
  deliverySummary: {
    totalDeliveries: number;
    delivered: number;
    successRate: number;
    totalQuantity: number;
    totalRevenue: number;
  };
  assignmentStatus: {
    totalQuantityAssigned: number;
  };
  priorityClients: PriorityClient[];
  deliveryRecords: DeliveryRecord[];
  staffPerformance: StaffPerformance[];
  shiftAnalytics: ShiftAnalytic[];
}

interface DeliveryRecord {
  clientName: string;
  location: string;
  staff: string;
  shift: string;
  quantity: number;
  price: number;
  status: string;
}

interface StaffPerformance {
  staffName: string;
  deliveredCount: number;
  notDeliveredCount: number;
  totalQuantity: number;
  totalRevenue: number;
  successRate: number;
}

interface ShiftAnalytic {
  shift: string;
  deliveryCount: number;
  deliveredCount: number;
  successRate: number;
  totalQuantity: number;
  totalRevenue: number;
}

interface PriorityClient {
  _id: string;
  name: string;
  location: string;
  timeShift: string;
  quantity: number;
  deliveryStatus: string;
}

const initialDashboardData: DashboardData = {
  counts: {
    totalClients: 0,
    totalStaff: 0,
  },
  today: {
    date: new Date().toISOString(),
    quantity: 0,
    revenue: 0,
    successRate: 0,
  },
  monthly: {
    quantity: 0,
    revenue: 0,
  },
  deliverySummary: {
    totalDeliveries: 0,
    delivered: 0,
    successRate: 0,
    totalQuantity: 0,
    totalRevenue: 0,
  },
  assignmentStatus: {
    totalQuantityAssigned: 0,
  },
  priorityClients: [],
  deliveryRecords: [],
  staffPerformance: [],
  shiftAnalytics: [],
};

const ModernDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      console.log(
        `Fetching dashboard data for date: ${selectedDate}, shift: ${
          selectedShift || "All"
        }`
      );
      const response = await admin.getDashboardData(
        selectedDate,
        selectedShift
      );
      setDashboardData(response.data);
      console.log("Dashboard data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(initialDashboardData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate, selectedShift]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleShiftChange = (event: SelectChangeEvent) => {
    setSelectedShift(event.target.value);
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "AM":
        return "primary";
      case "PM":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Not Delivered":
        return "error";
      default:
        return "warning";
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 100px)",
        }}
      >
        <CircularProgress style={{ color: "var(--accent-blue)" }} />
      </div>
    );
  }

  return (
    <div>
      {" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h5" className="dashboard-overview-title">
          Dashboard Overview
        </Typography>

        <Box className="date-range-selector">
          <Box className="date-display">
            <DateRangeIcon />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "var(--dark-text-primary)",
                padding: "8px",
                outline: "none",
              }}
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedShift}
              onChange={handleShiftChange}
              displayEmpty
              className="shift-selector"
              inputProps={{ "aria-label": "Shift" }}
            >
              <MenuItem value="">All Shifts</MenuItem>
              <MenuItem value="AM">AM Shift</MenuItem>
              <MenuItem value="PM">PM Shift</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleRefresh}
            className="refresh-button"
          >
            Refresh
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card className="stats-card">
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "var(--dark-gradient-primary)",
                }}
              ></Box>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PeopleAltIcon
                    sx={{
                      fontSize: 18,
                      mr: 0.5,
                      color: "var(--dark-text-secondary)",
                    }}
                  />
                  <Typography variant="body2" className="stats-card-label">
                    Total Clients
                  </Typography>
                </Box>
                <Typography variant="h3" className="stats-card-value">
                  {dashboardData.counts.totalClients}
                </Typography>
                <Box className="stats-trend stats-trend-up">
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> +5% from
                  last month
                </Box>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className="stats-card">
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "var(--dark-gradient-primary)",
                }}
              ></Box>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonIcon
                    sx={{
                      fontSize: 18,
                      mr: 0.5,
                      color: "var(--dark-text-secondary)",
                    }}
                  />
                  <Typography variant="body2" className="stats-card-label">
                    Total Staff
                  </Typography>
                </Box>
                <Typography variant="h3" className="stats-card-value">
                  {dashboardData.counts.totalStaff}
                </Typography>
                <Box className="stats-trend stats-trend-up">
                  <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} /> +2% from
                  last month
                </Box>
              </CardContent>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <div className="dashboard-card">
            <div className="card-gradient"></div>
            <div className="card-body">
              <div className="card-label">
                <LocalShippingIcon
                  sx={{ fontSize: 18, mr: 0.5, verticalAlign: "text-top" }}
                />
                Today's Delivery (L)
              </div>
              <div className="card-value">
                {dashboardData.today.quantity.toFixed(1)}
              </div>
              <div className="card-trend">
                <AttachMoneyIcon
                  sx={{ fontSize: 16, mr: 0.5, color: "var(--accent-green)" }}
                />
                {formatCurrency(dashboardData.today.revenue)}
              </div>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <div className="dashboard-card">
            <div className="card-gradient"></div>
            <div className="card-body">
              <div className="card-label">
                <AttachMoneyIcon
                  sx={{ fontSize: 18, mr: 0.5, verticalAlign: "text-top" }}
                />
                Monthly Total (L)
              </div>
              <div className="card-value">
                {dashboardData.monthly.quantity.toFixed(1)}
              </div>
              <div className="card-trend">
                <AttachMoneyIcon
                  sx={{ fontSize: 16, mr: 0.5, color: "var(--accent-green)" }}
                />
                {formatCurrency(dashboardData.monthly.revenue)}
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      {/* Chart Container */}
      <div className="chart-container" style={{ marginBottom: "24px" }}>
        <div className="chart-header">
          <div className="chart-title">Delivery Trends</div>
          <div className="chart-legend">
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "var(--accent-blue)" }}
              ></div>{" "}
              Quantity
            </div>
            <div className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: "var(--accent-green)" }}
              ></div>{" "}
              Revenue
            </div>
          </div>
        </div>
        <div
          style={{
            height: "240px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography color="var(--text-secondary)">
            Chart visualization would appear here
          </Typography>
        </div>
      </div>
      {/* Priority Clients Section - Hidden */}
      <Box sx={{ mb: 3 }} data-section="priority-clients">
        <div className="dashboard-card">
          <div className="card-header">
            Priority Clients
            <Chip
              label="High Priority"
              color="error"
              size="small"
              sx={{ ml: 1 }}
            />
          </div>
          <div className="card-body">
            {dashboardData.priorityClients &&
            dashboardData.priorityClients.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Client Name</th>
                      <th>Location</th>
                      <th>Shift</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.priorityClients.map((client, index) => (
                      <tr key={index}>
                        <td>{client.name}</td>
                        <td>{client.location}</td>
                        <td>
                          <span
                            className={`table-status ${
                              client.timeShift === "AM"
                                ? "status-delivered"
                                : "status-pending"
                            }`}
                          >
                            {client.timeShift}
                          </span>
                        </td>
                        <td>{client.quantity.toFixed(1)} L</td>
                        <td>
                          <span
                            className={`table-status ${
                              client.deliveryStatus === "Delivered"
                                ? "status-delivered"
                                : "status-failed"
                            }`}
                          >
                            {client.deliveryStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Typography
                align="center"
                sx={{ py: 3, color: "var(--text-secondary)" }}
              >
                No priority clients found.
              </Typography>
            )}
          </div>
        </div>
      </Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <div className="dashboard-card">
            <div className="card-header">
              Delivery Summary
              {selectedShift && (
                <Chip
                  label={`${selectedShift} Shift`}
                  color={getShiftColor(selectedShift)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </div>
            <div className="card-body">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      mb: 0.5,
                    }}
                  >
                    Total Deliveries
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                    }}
                  >
                    {dashboardData.deliverySummary.totalDeliveries}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      mb: 0.5,
                    }}
                  >
                    Delivered
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                    }}
                  >
                    {dashboardData.deliverySummary.delivered} (
                    {Number(dashboardData.deliverySummary.successRate).toFixed(
                      1
                    )}
                    %)
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      mb: 0.5,
                    }}
                  >
                    Total Quantity
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                    }}
                  >
                    {dashboardData.deliverySummary.totalQuantity.toFixed(1)} L
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      mb: 0.5,
                    }}
                  >
                    Total Revenue
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--accent-green)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                    }}
                  >
                    {formatCurrency(dashboardData.deliverySummary.totalRevenue)}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={6}>
          <div className="dashboard-card">
            <div className="card-header">Assignment Status</div>
            <div className="card-body">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      mb: 0.5,
                    }}
                  >
                    Total Quantity Assigned
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "1.25rem",
                    }}
                  >
                    {dashboardData.assignmentStatus.totalQuantityAssigned.toFixed(
                      1
                    )}{" "}
                    L
                  </Typography>
                </div>
                <div className="circular-progress">
                  {/* Placeholder for circular progress */}
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background:
                        "conic-gradient(var(--accent-blue) 70%, var(--bg-dark-light) 0)",
                    }}
                  ></div>
                  <div className="progress-value">70%</div>
                </div>
              </Box>
            </div>
          </div>
        </Grid>
      </Grid>
      {dashboardData.staffPerformance.length > 0 && (
        <div className="dashboard-card" style={{ marginBottom: "24px" }}>
          <div className="card-header">Staff Performance</div>
          <div className="card-body">
            <div style={{ overflowX: "auto" }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Staff Name</th>
                    <th>Delivered</th>
                    <th>Not Delivered</th>
                    <th>Success Rate</th>
                    <th>Total Quantity</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.staffPerformance.map((staff, index) => (
                    <tr key={index}>
                      <td>{staff.staffName}</td>
                      <td>{staff.deliveredCount}</td>
                      <td>{staff.notDeliveredCount}</td>
                      <td>{staff.successRate.toFixed(1)}%</td>
                      <td>{staff.totalQuantity.toFixed(1)} L</td>
                      <td>{formatCurrency(staff.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="dashboard-card" style={{ marginBottom: "24px" }}>
        <div className="card-header">
          Today's Delivery Records
          {selectedShift && (
            <Chip
              label={`${selectedShift} Shift`}
              color={getShiftColor(selectedShift)}
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </div>
        <div className="card-body">
          {dashboardData.deliveryRecords.length === 0 ? (
            <Typography
              align="center"
              sx={{ py: 3, color: "var(--text-secondary)" }}
            >
              No delivery records found for this date and shift.
            </Typography>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Location</th>
                    <th>Staff</th>
                    <th>Shift</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.deliveryRecords.map((delivery, index) => (
                    <tr key={index}>
                      <td>{delivery.clientName}</td>
                      <td>{delivery.location}</td>
                      <td>{delivery.staff}</td>
                      <td>
                        <span
                          className={`table-status ${
                            delivery.shift === "AM"
                              ? "status-delivered"
                              : "status-pending"
                          }`}
                        >
                          {delivery.shift}
                        </span>
                      </td>
                      <td>{delivery.quantity.toFixed(1)} L</td>
                      <td>{formatCurrency(delivery.price)}</td>
                      <td>
                        <span
                          className={`table-status ${
                            delivery.status === "Delivered"
                              ? "status-delivered"
                              : "status-failed"
                          }`}
                        >
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {dashboardData.shiftAnalytics.length > 0 && (
        <div className="dashboard-card">
          <div className="card-header">Shift Analytics</div>
          <div className="card-body">
            <div style={{ overflowX: "auto" }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Shift</th>
                    <th>Delivery Count</th>
                    <th>Success Rate</th>
                    <th>Total Quantity</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.shiftAnalytics.map((shift, index) => (
                    <tr key={index}>
                      <td>
                        <span
                          className={`table-status ${
                            shift.shift === "AM"
                              ? "status-delivered"
                              : "status-pending"
                          }`}
                        >
                          {shift.shift}
                        </span>
                      </td>
                      <td>{shift.deliveryCount}</td>
                      <td>{shift.successRate.toFixed(1)}%</td>
                      <td>{shift.totalQuantity.toFixed(1)} L</td>
                      <td>{formatCurrency(shift.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDashboard;
