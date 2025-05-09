// src/pages/Welcome.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGo = () => {
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'engineer':
        navigate('/engineer');
        break;
      case 'payment_authority':
        navigate('/payment');
        break;
      case 'viewer':
        navigate('/viewer');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome back, {user.username}!
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        You are logged in as <strong>{user.role.replace('_', ' ')}</strong>.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleGo}
        sx={{ mt: 3 }}
      >
        Go to Dashboard
      </Button>
    </Box>
  );
}
