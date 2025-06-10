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
} from '@mui/icons-material';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ClusterOutlined, // Add this Ant Design icon for Recommendation System
  BulbOutlined,    // For Recommend Products
  InteractionOutlined, // For User Interactions
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const drawerWidth = 250;
const collapsedWidth = 80;
const navbarHeight = 64; 

const Layout = () => {
  const navigate = useNavigate();
  const { logout, userName } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [collapsed, setCollapsed] = useState(false); // Default to expanded sidebar

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

  // Add submenu for Recommendation System
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
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/users-admin'),
    },
    {
      key: 'recommendation',
      icon: <ClusterOutlined />,
      label: 'Recommendation',
      children: [
        {
          key: 'recommend-products',
          icon: <BulbOutlined />,
          label: 'Recommend Products',
          onClick: () => navigate('/recommend-products'),
        },
        {
          key: 'user-interactions',
          icon: <InteractionOutlined />,
          label: 'User Interactions',
          onClick: () => navigate('/user-interactions'),
        },
      ],
    },
  ];

  // For submenu open state
  const [openKeys, setOpenKeys] = useState([]);
  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach(item => {
        if (item.key) key[item.key] = level;
        if (item.children) func(item.children, level + 1);
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(menuItems);

  const onOpenChange = (openKeysNew) => {
    const currentOpenKey = openKeysNew.find(key => openKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeysNew
        .filter(key => key !== currentOpenKey)
        .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);
      setOpenKeys(
        openKeysNew
          .filter((_, index) => index !== repeatIndex)
          .filter(key => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      setOpenKeys(openKeysNew);
    }
  };

  // Update selected key logic to support new menu
  const getSelectedKey = () => {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/products-admin')) return 'products';
    if (path.startsWith('/orders-admin')) return 'orders';
    if (path.startsWith('/users-admin')) return 'users';
    if (path.startsWith('/recommend-products')) return 'recommend-products';
    if (path.startsWith('/user-interactions')) return 'user-interactions';
    return 'dashboard';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'row' }}>
      <Box
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: 1100,
          transition: 'width 0.3s ease-in-out',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ p: 1 }}>
          <img
            src="/images/logo4.png"
            alt="Logo"
            style={{
              height: '22px',
              marginTop: 16,
              marginLeft: collapsed ? 0 : 16,
              marginRight: collapsed ? 0 : 0,
            }}
          />
        </Box>
        <Menu
          className="admin-sidebar-menu"
          style={{ width: '100%', backgroundColor: '#ffffff', flexGrow: 1 }}
          mode="inline"
          inlineCollapsed={collapsed}
          items={menuItems}
          selectedKeys={[getSelectedKey()]}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={({ key, item }) => {
            // Call onClick if defined in menu item
            const found = menuItems
              .flatMap(i => i.children ? [i, ...i.children] : [i])
              .find(i => i.key === key);
            if (found && found.onClick) found.onClick();
          }}
        />
      </Box>
      <Box
        sx={{
          ml: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
          display: 'flex',
          flexDirection: 'column',
          width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          height: '100vh',
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
            left: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`,
            top: 0,
            zIndex: 1200,
            boxShadow: 'none',
           
            transition: 'background-color 0.3s',
          }}
        >
          <Toolbar sx={{ pr: '24px', height: `${navbarHeight}px` }}>
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
          component="main"
          className="main"
          sx={{
            flexGrow: 1,
            mt: `${navbarHeight}px`, // Đẩy nội dung xuống dưới AppBar đúng bằng chiều cao navbar
            padding: '24px',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Button
        type="text"
        onClick={toggleCollapsed}
        style={{ position: 'fixed', top: '20px', left: collapsed ? `${collapsedWidth}px` : `${drawerWidth - 40}px`, zIndex: 1300 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    </Box>
  );
};

export default Layout;