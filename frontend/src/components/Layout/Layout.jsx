import React, {useState} from 'react';
import './Layout.css';
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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Chat as ChatIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom'; // Thêm Outlet

const drawerWidth = 250;

const Layout = () => { // Không cần prop children
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products-admin' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders-admin' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users-admin' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        className="AppBarStyled"
        position="fixed"
        sx={{
          borderBottomLeftRadius: 0,
          backgroundColor: '#ffffff',
          color: '#000',
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: `${drawerWidth}px`,
        }}
      >
        <Toolbar sx={{ pr: '24px' }}>
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
              <Typography variant="subtitle1">Name</Typography>
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
            <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
          </Popover>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            color: '#000',
            position: 'fixed',
            top: 0,
            height: '100vh',
            borderTopLeftRadius: 0,
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            LOGO
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={window.location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    borderRadius: '8px',
                    marginRight: '8px',
                    marginLeft: '8px',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    borderRadius: '8px',
                    transform: 'scale(1.02)',
                  },
                  padding: '12px 20px',
                  marginRight: '8px',
                  marginLeft: '8px',
                }}
              >
                <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '0px', // Giảm khoảng cách giữa sidebar và nội dung
          mt: 8,
          minHeight: '100vh',
        }}
      >
        <Outlet /> {/* Render các route con như Dashboard */}
      </Box>
    </Box>
  );
};

export default Layout;