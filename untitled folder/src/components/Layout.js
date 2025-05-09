// src/components/Layout.js
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as ProgressIcon,
  Payment as PaymentIcon,
  People as UsersIcon,
  Assessment as ReportIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    ...(user?.role === 'engineer'
      ? [
          { text: 'Upload Progress', icon: <ProgressIcon />, path: '/engineer/upload' },
          { text: 'View Progress', icon: <ProgressIcon />, path: '/engineer/view' },
        ]
      : []),
    ...(user?.role === 'payment_authority'
      ? [
          { text: 'Review Payments', icon: <PaymentIcon />, path: '/payment/review' },
          { text: 'Payment Reports', icon: <ReportIcon />, path: '/payment/reports' },
        ]
      : []),
    ...(user?.role === 'viewer'
      ? [
          { text: 'View Progress', icon: <ProgressIcon />, path: '/viewer/progress' },
          { text: 'View Payments', icon: <PaymentIcon />, path: '/viewer/payments' },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [
          { text: 'User Management', icon: <UsersIcon />, path: '/admin/users' },
          { text: 'Payment Approval', icon: <PaymentIcon />, path: '/admin/pay-approval' },
          { text: 'Progress Approval', icon: <ProgressIcon />, path: '/admin/prog-approval' },
          { text: 'Payment Reports', icon: <ReportIcon />, path: '/admin/reports/payments' },
          { text: 'Progress Reports', icon: <ReportIcon />, path: '/admin/reports/progress' },
        ]
      : []),
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Hangar Management
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Hangar Management System
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          position: 'relative', // ✅ Enables dropdowns to render properly
          zIndex: 1,             // ✅ Avoid overlap by drawer or navbar
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
