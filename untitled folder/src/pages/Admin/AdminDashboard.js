import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Tabs, Tab, Box, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Snackbar, Alert
} from '@mui/material';
import { userService, progressService, paymentService } from '../../api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);

  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'siteEngineer' });
  const [users, setUsers] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [date, setDate] = useState('');
  const [filteredProgress, setFilteredProgress] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (_, newValue) => setTab(newValue);

  const fetchData = async () => {
    const [progressRes, paymentRes] = await Promise.all([
      progressService.getAllProgress(),
      paymentService.getAllPayments(),
    ]);
    setProgressList(progressRes.data || []);
    setPaymentList(paymentRes.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async () => {
    try {
      await userService.createUser(form);
      setAlert({ open: true, message: 'User created successfully', severity: 'success' });
    } catch (err) {
      setAlert({ open: true, message: 'Error creating user', severity: 'error' });
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      setAlert({ open: true, message: 'User deleted successfully', severity: 'success' });
    } catch {
      setAlert({ open: true, message: 'Error deleting user', severity: 'error' });
    }
  };

  const handleApproveProgress = async (id) => {
    await progressService.approveProgress(id);
    fetchData();
  };

  const handleApprovePayment = async (id) => {
    await paymentService.approvePayment(id);
    fetchData();
  };

  const handleFilterByDate = async () => {
    try {
      const [progressRes, paymentRes] = await Promise.all([
        progressService.getProgressByDate(date),
        paymentService.getPaymentsByDate(date),
      ]);
      setFilteredProgress(progressRes.data || []);
      setFilteredPayments(paymentRes.data || []);
    } catch {
      setAlert({ open: true, message: 'Failed to fetch date-wise records', severity: 'error' });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Manage Users" />
        <Tab label="Approve Progress" />
        <Tab label="Approve Payments" />
        <Tab label="View Reports by Date" />
      </Tabs>

      {/* Manage Users */}
      {tab === 0 && (
        <Box mt={3}>
          <Typography variant="h6">Create New User</Typography>
          <Box display="flex" gap={2} my={2}>
            <TextField label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <TextField label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button variant="contained" onClick={handleCreateUser}>Create</Button>
          </Box>
          {/* Optional: Add table of users and delete buttons if endpoint available */}
        </Box>
      )}

      {/* Approve Progress */}
      {tab === 1 && (
        <Box mt={3}>
          <Typography variant="h6">Pending Progress Approvals</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Date</TableCell><TableCell>Approve</TableCell></TableRow></TableHead>
              <TableBody>
                {progressList.filter(p => !p.isApproved).map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p._id}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell><Button onClick={() => handleApproveProgress(p._id)}>Approve</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Approve Payments */}
      {tab === 2 && (
        <Box mt={3}>
          <Typography variant="h6">Pending Payment Approvals</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Date</TableCell><TableCell>Approve</TableCell></TableRow></TableHead>
              <TableBody>
                {paymentList.filter(p => !p.isApproved).map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p._id}</TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell><Button onClick={() => handleApprovePayment(p._id)}>Approve</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* View Reports by Date */}
      {tab === 3 && (
        <Box mt={3}>
          <Typography variant="h6">Filter by Date</Typography>
          <Box display="flex" gap={2} my={2}>
            <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button variant="outlined" onClick={handleFilterByDate}>Search</Button>
          </Box>

          <Typography variant="subtitle1">Progress on {date}:</Typography>
          <ul>{filteredProgress.map((p) => <li key={p._id}>{p._id} - {p.date}</li>)}</ul>

          <Typography variant="subtitle1">Payments on {date}:</Typography>
          <ul>{filteredPayments.map((p) => <li key={p._id}>{p._id} - {p.date}</li>)}</ul>
        </Box>
      )}

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
