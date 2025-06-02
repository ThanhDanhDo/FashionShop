import React, { useState, useContext } from 'react';
import './LayoutAdmin.css';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Popover,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const drawerWidth = 250;
const collapsedWidth = 0;

const Layout = () => {
  const navigate = useNavigate();
  const { logout, userName } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [collapsed, setCollapsed] = useState(true); // Mặc định thu gọn (ẩn)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const isPopoverOpen = Boolean(anchorEl);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'products',
      icon: <AppstoreOutlined />,
      label: 'Products',
      onClick: () => navigate('/products-admin'),
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
      onClick: () => navigate('/orders-admin'),
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: 'Users',
      onClick: () => navigate('/users-admin'),
    },
  ];

  // Chuẩn hóa selectedKeys để khớp với key của menuItems
  const getSelectedKey = () => {
    const path = window.location.pathname.split('/').pop() || 'dashboard';
    const pathToKeyMap = {
      'dashboard': 'dashboard',
      'products-admin': 'products',
      'orders-admin': 'orders',
      'users-admin': 'users',
    };
    return pathToKeyMap[path] || 'dashboard';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff',
          color: '#000',
          width: '100%',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ pr: '24px' }}>
          <Button
            type="text"
            onClick={toggleCollapsed}
            style={{ marginRight: 16 }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          <img
            src="/images/logo4.png"
            alt="Logo"
            style={{ height: '28px', marginRight: 16 }} // Đặt chiều cao và margin phù hợp
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <ChatIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Box
            sx={{ display: 'flex', alignItems: 'center', ml: 2, cursor: 'pointer', gap: 1 }}
            onClick={handleClick}
          >
            <Avatar alt="Account" src="/path/to/avatar.jpg" />
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1">{userName || 'Admin'}</Typography>
              <Typography variant="body2" color="textSecondary">Admin</Typography>
            </Box>
            <ArrowDropDownIcon />
          </Box>
          <Popover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>Tài khoản</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Popover>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: drawerWidth,
          display: collapsed ? 'none' : 'block',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          backgroundColor: '#ffffff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          zIndex: 1300,
          transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            paddingRight: 2,
          }}
        >
          <img
            src="/images/logo4.png"
            alt="Logo"
            style={{ height: '28px', margin: 'auto' }} // Căn giữa và đặt chiều cao giống navbar
          />
          <IconButton
            edge="end"
            color="inherit"
            onClick={toggleCollapsed}
            sx={{ marginLeft: 'auto' }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
        <Menu
          style={{ width: '100%', backgroundColor: '#ffffff' }}
          mode="inline"
          inlineCollapsed={false}
          items={menuItems}
          selectedKeys={[getSelectedKey()]}
        />
      </Box>
      {!collapsed && (
        <Box
          className="overlay"
          onClick={toggleCollapsed}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1100,
          }}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          p: 3,
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          backgroundColor: '#F2F7FB',
          zIndex: 1000,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;