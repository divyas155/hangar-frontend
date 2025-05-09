import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  ListItemButton,
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
    ...(user?.role === 'site_engineer'
      ? [
          { text: 'Upload Progress', icon: <ProgressIcon />, path: '/engineer/upload' },
          { text: 'View Progress', icon: <ProgressIcon />, path: '/engineer/view' },
        ]
      : []),
    ...(user?.role === 'paying_authority'
      ? [
          { text: 'Submit New Payment', icon: <PaymentIcon />, path: '/payment/submit' },
          { text: 'View Submitted Payments', icon: <ReportIcon />, path: '/payment/view' },
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
          { text: 'User Management', icon: <UsersIcon />, path: '/admin/user-management' },
          { text: 'Payment Approval', icon: <PaymentIcon />, path: '/admin/payment-approval' },
          { text: 'Progress Approval', icon: <ProgressIcon />, path: '/admin/progress-approval' },
          { text: 'Reports', icon: <ReportIcon />, path: '/admin/reports' }, // ✅ merged reports tab
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
          <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
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

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
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
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
