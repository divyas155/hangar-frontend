// src/pages/Admin/UserManagement.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Tabs, Tab } from '@mui/material';
import { userService } from '../../api';

const roles = ['admin', 'engineer', 'viewer', 'payment-authority']; // Add your role options here

export default function UserManagement() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('engineer'); // default role
  const [tab, setTab] = useState(0);

  const handleCreateUser = async () => {
    try {
      const newUser = { username, email, password, role };
      await userService.createUser(newUser);
      alert('✅ User created successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('engineer');
    } catch (error) {
      console.error('❌ Error creating user:', error);
      alert('Failed to create user');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 2 }}>
        <Tab label="Manage Users" />
        <Tab label="Approve Progress" />
        <Tab label="Approve Payments" />
        <Tab label="View Reports by Date" />
      </Tabs>

      {tab === 0 && (
        <Box display="flex" flexDirection="column" gap={2} maxWidth={500}>
          <Typography variant="h6">Create New User</Typography>
          <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" fullWidth />
          <TextField
            label="Role"
            select
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
          >
            {roles.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleCreateUser}>Create</Button>
        </Box>
      )}
    </Box>
  );
}
