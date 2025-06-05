import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
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
import { AttachMoney, ShoppingCart, Group, Replay, Cancel } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Typography as AntdTypography } from 'antd';

const data = [
  { date: "Oct 23", value: 55 },
  { date: "Oct 27", value: 75 },
  { date: "Oct 31", value: 65 },
  { date: "Nov 04", value: 70 },
  { date: "Nov 08", value: 80 },
  { date: "Nov 12", value: 85 },
  { date: "Nov 16", value: 82 },
];

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

const dropdownItems = [
  { key: 'daily', label: 'Daily' },
  { key: 'monthly', label: 'Monthly' },
];

const dashboardDropdownStyle = {
  padding: "8px 16px",
  border: "1px solid #ddd",
  borderRadius: "5px",
  background: "#fff",
  color: "#1a202c",
  fontWeight: 500,
  fontSize: 16,
  cursor: "pointer",
  transition: "border 0.2s, background 0.2s",
  marginLeft: 8,
  minWidth: 130, // Đặt minWidth và width cố định
  width: 130,
  boxSizing: "border-box",
  display: "inline-block",
};

const dashboardDropdownHover = {
  border: "1.5px solid #1a73e8",
  background: "#f5f8fa",
};

const Dashboard = () => {
  const [type, setType] = useState('daily');
  const [dropdownHover, setDropdownHover] = useState(false);

  const handleMenuClick = ({ key }) => {
    setType(key);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ mr: 2, mt: "5px" }} 
                >
                  Deals Analytics
                </Typography>
                <Dropdown
                  menu={{
                    items: dropdownItems,
                    selectable: true,
                    selectedKeys: [type],
                    onSelect: handleMenuClick,
                  }}
                >
                  <AntdTypography.Link
                    style={{
                      ...dashboardDropdownStyle,
                      ...(dropdownHover ? dashboardDropdownHover : {}),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      width: 130, // Đảm bảo luôn cố định
                      minWidth: 130,
                    }}
                    onMouseEnter={() => setDropdownHover(true)}
                    onMouseLeave={() => setDropdownHover(false)}
                  >
                    <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {type === 'daily' ? 'Daily' : 'Monthly'}
                    </span>
                    <DownOutlined style={{ marginLeft: 8, flexShrink: 0 }} />
                  </AntdTypography.Link>
                </Dropdown>
              </Box>
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

          {/* Stats Cards - Row 1 */}
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard title="Total revenue" value="30 000" icon={AttachMoney} />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Total orders"
              value="30 000"
              icon={ShoppingCart}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Total users"
              value="30 000"
              icon={Group}
            />
          </Grid>

          {/* Stats Cards - Row 2 */}
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Total Refunds"
              value="1 000"
              icon={Replay}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Canceled Orders"
              value="500"
              icon={Cancel}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }} />
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Dashboard;
