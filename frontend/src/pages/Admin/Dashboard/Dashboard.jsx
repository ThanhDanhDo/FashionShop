import React, { useState, useEffect } from "react";
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
import { getReport, getRevenueChart } from '../../../services/dashboardService'
import { useLoading } from '../../../context/LoadingContext';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    value = Number(value);
  }
  return value.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace('₫', 'đ');
};

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
  const { setLoading } = useLoading();
  const [type, setType] = useState('daily');
  const [dropdownHover, setDropdownHover] = useState(false);
  const [data, setData] = useState([]);
  const [report, setReport] = useState(null);

  const handleMenuClick = ({ key }) => {
    setType(key);
  };

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await getRevenueChart(type);
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.log("Lỗi lấy dữ liệu chart: ", error);
    } finally {
      setLoading(false)
    }
  };

  const fetchStatsData = async () => {
    try {
      const res = await getReport();
      setReport(res);
      console.log(res);
    } catch (error) {
      console.log("Lỗi lấy dữ liệu chart: ", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [type]);

  useEffect(() => {
    fetchStatsData();
  }, []);

  if (!report) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          flexDirection: 'column',
        }}
      >
        <Spin indicator={antIcon} />
      </Box>
    );
  }

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
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                    />
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
            <StatCard title="Total revenue" value={formatCurrency(report.totalRevenue)} icon={AttachMoney} />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Total orders"
              value={report.totalOrders}
              icon={ShoppingCart}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Total users"
              value={report.totalUsers}
              icon={Group}
            />
          </Grid>

          {/* Stats Cards - Row 2 */}
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Total Refunds"
              value={formatCurrency(report.totalRefunds)}
              icon={Replay}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 3 }}>
            <StatCard
              title="Canceled Orders"
              value={report.canceledOrders}
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
