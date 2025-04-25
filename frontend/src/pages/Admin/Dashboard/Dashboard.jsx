import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Popover,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AttachMoney, ShoppingCart, Group } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const data = [
  { date: "Oct 23", value: 55 },
  { date: "Oct 27", value: 75 },
  { date: "Oct 31", value: 65 },
  { date: "Nov 04", value: 70 },
  { date: "Nov 08", value: 80 },
  { date: "Nov 12", value: 85 },
  { date: "Nov 16", value: 82 },
];

const activities = [
  {
    id: 1,
    description: "Add Product #01 into table Clothes",
    user: "User01",
    time: "10:00:30 AM",
    date: "28/03/2025",
  },
  {
    id: 2,
    description: "Add Product #02 into table Shoes",
    user: "User02",
    time: "11:00:30 AM",
    date: "28/03/2025",
  },
  {
    id: 3,
    description: "Add Product #03 into table Accessories",
    user: "User03",
    time: "12:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 4,
    description: "Add Product #04 into table Electronics",
    user: "User04",
    time: "01:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 5,
    description: "Add Product #03 into table Accessories",
    user: "User03",
    time: "12:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 6,
    description: "Add Product #04 into table Electronics",
    user: "User04",
    time: "01:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 7,
    description: "Add Product #03 into table Accessories",
    user: "User03",
    time: "12:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 8,
    description: "Add Product #04 into table Electronics",
    user: "User04",
    time: "01:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 9,
    description: "Add Product #03 into table Accessories",
    user: "User03",
    time: "12:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 10,
    description: "Add Product #04 into table Electronics",
    user: "User04",
    time: "01:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 11,
    description: "Add Product #03 into table Accessories",
    user: "User03",
    time: "12:00:30 PM",
    date: "28/03/2025",
  },
  {
    id: 12,
    description: "Add Product #04 into table Electronics",
    user: "User04",
    time: "01:00:30 PM",
    date: "28/03/2025",
  },
];

const itemsPerPage = 5; // Số lượng hoạt động trên mỗi trang

const StatCard = ({ title, value, icon: Icon }) => (
  <Paper
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",
      height: 140,
      position: "relative",
      overflow: "hidden",
      borderRadius: 2,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: -20,
        right: -20,
        opacity: 0.1,
        transform: "rotate(-15deg)",
      }}
    >
      <Icon sx={{ fontSize: 120 }} />
    </Box>
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

const Dashboard = () => {
  console.log("Rendering Dashboard");

  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElTime, setAnchorElTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const handleUserPopoverOpen = (event) => {
    setAnchorElUser(event.currentTarget);
    setUserPopoverOpen(true);
  };

  const handleUserPopoverClose = () => {
    setUserPopoverOpen(false);
  };

  const handleTimePopoverOpen = (event) => {
    setAnchorElTime(event.currentTarget);
    setTimePopoverOpen(true);
  };

  const handleTimePopoverClose = () => {
    setTimePopoverOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const displayedActivities = activities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Deals Analytics
              </Typography>
              <Box sx={{ height: 360 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={data}
                    margin={{
                      top: 16,
                      right: 16,
                      bottom: 0,
                      left: 24,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#1976d2"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <StatCard title="Total revenue" value="30 000" icon={AttachMoney} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Number of new orders"
              value="30 000"
              icon={ShoppingCart}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Total number of users"
              value="30 000"
              icon={Group}
            />
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6">Recent Activities</Typography>
                <Box>
                  <Button variant="outlined" onClick={handleUserPopoverOpen}>
                    All Users
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleTimePopoverOpen}
                    sx={{ ml: 2 }}
                  >
                    All Time
                  </Button>
                </Box>
              </Box>

              {/* User Popover */}
              <Popover
                open={userPopoverOpen}
                anchorEl={anchorElUser}
                onClose={handleUserPopoverClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">User List</Typography>
                  <Typography variant="body2">User01</Typography>
                  <Typography variant="body2">User02</Typography>
                  <Typography variant="body2">User03</Typography>
                </Box>
              </Popover>

              {/* Time Popover */}
              <Popover
                open={timePopoverOpen}
                anchorEl={anchorElTime}
                onClose={handleTimePopoverClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6">Select Date and Time</Typography>
                  <DateTimePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              </Popover>

              {displayedActivities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    py: 2,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">
                      {activity.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.user}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {activity.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.date}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    variant={
                      currentPage === index + 1 ? "contained" : "outlined"
                    }
                    sx={{ mx: 1 }}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Dashboard;
