// src/pages/Admin/UserManagement.js
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Snackbar, Alert,
  Grid, Card, CardContent, CardActions, IconButton, MenuItem,
  Tabs, Tab, Dialog, DialogActions, DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import { userService } from '../../api';

export default function UserManagement() {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: '' });
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null });

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch {
      setAlert({ open: true, message: 'Failed to fetch users', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    const { username, email, password, role } = form;
    if (!username || !email || !password || !role) {
      return setAlert({ open: true, message: 'Please fill all fields', severity: 'warning' });
    }
    try {
      await userService.createUser(form);
      setAlert({ open: true, message: 'User created', severity: 'success' });
      setForm({ username: '', email: '', password: '', role: '' });
      fetchUsers();
    } catch {
      setAlert({ open: true, message: 'Error creating user', severity: 'error' });
    }
  };

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setAlert({ open: true, message: 'User deleted', severity: 'success' });
      fetchUsers();
    } catch {
      setAlert({ open: true, message: 'Error deleting user', severity: 'error' });
    } finally {
      setConfirmDialog({ open: false, userId: null });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom><PersonIcon sx={{ mb: -0.5 }} /> Admin Dashboard</Typography>

      <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} sx={{ mb: 2 }}>
        <Tab label="CREATE USER" />
        <Tab label="ALL USERS" />
      </Tabs>

      {tab === 0 && (
        <Box component="form" sx={{ maxWidth: 400, mx: 'auto', p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Create New User</Typography>
          <TextField label="Username" fullWidth sx={{ mb: 2 }} value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <TextField label="Email" fullWidth sx={{ mb: 2 }} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <TextField label="Role" select fullWidth sx={{ mb: 2 }} value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="site_engineer">Site Engineer</MenuItem>
            <MenuItem value="viewer">Viewer</MenuItem>
            <MenuItem value="paying_authority">Paying Authority</MenuItem>
          </TextField>
          <Button variant="contained" fullWidth onClick={handleCreate}>Create User</Button>
        </Box>
      )}

      {tab === 1 && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>All Registered Users</Typography>
          <Grid container spacing={2}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">{user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.role.replace('_', ' ')}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    {user.role !== 'admin' && (
                      <IconButton color="error" onClick={() => setConfirmDialog({ open: true, userId: user._id })}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, userId: null })}
      >
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, userId: null })}>Cancel</Button>
          <Button color="error" onClick={() => handleDelete(confirmDialog.userId)}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
}
