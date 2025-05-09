import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Snackbar, Alert, IconButton, Paper, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DateRangePicker from '../../components/DateFilter';
import CommentSection from '../../components/CommentSection';
import api from '../../api';

export default function ViewPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPayments = async (range) => {
    setLoading(true);
    try {
      const params = { status: 'pending' };

      if (range[0] instanceof Date && !isNaN(range[0])) {
        const from = new Date(range[0]);
        from.setHours(0, 0, 0, 0);
        params.startDate = from.toISOString();
      }
      if (range[1] instanceof Date && !isNaN(range[1])) {
        const to = new Date(range[1]);
        to.setHours(23, 59, 59, 999);
        params.endDate = to.toISOString();
      }

      const res = await api.get('/payments', { params });
      setPayments(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch payments:', err);
      setSnackbar({ open: true, message: 'Failed to load payments', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments([null, null]); // initial load
  }, []);

  const handleApply = (from, to) => {
    const parsedFrom = from ? new Date(from) : null;
    const parsedTo = to ? new Date(to) : null;

    const validFrom = parsedFrom instanceof Date && !isNaN(parsedFrom);
    const validTo = parsedTo instanceof Date && !isNaN(parsedTo);

    const newRange = [validFrom ? parsedFrom : null, validTo ? parsedTo : null];
    setDateRange(newRange);

    fetchPayments(newRange);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      setSnackbar({ open: true, message: 'Payment deleted successfully', severity: 'success' });
      fetchPayments(dateRange);
    } catch (err) {
      console.error('❌ Delete failed:', err);
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const approvedTotal = payments
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingTotal = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>My Payment Submissions</Typography>

      <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <DateRangePicker
            from={dateRange[0]}
            to={dateRange[1]}
            onChange={({ from, to }) => setDateRange([from, to])}
            onApply={handleApply}
          />
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : payments.length === 0 ? (
        <Typography>No pending payments found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {payments.map((row) => (
            <Grid item xs={12} key={row._id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography fontWeight="bold">💳 Payment ID: {row.paymentID}</Typography>
                <Typography>Date: {new Date(row.date).toLocaleDateString()}</Typography>
                <Typography>Amount: ₹{row.amount}</Typography>
                <Typography>Description: {row.description || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {row.status}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  {row.status === 'pending' && (
                    <IconButton color="error" onClick={() => handleDelete(row._id)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Stack>

                {/* 💬 Comments below the payment block */}
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    💬 Comments
                  </Typography>
                  <CommentSection itemId={row._id} type="payment" />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={4} textAlign="right">
        <Typography variant="subtitle1">
          Total Paid: ₹{approvedTotal.toLocaleString()}
        </Typography>
        <Typography variant="subtitle1">
          Payment Pending Approval: ₹{pendingTotal.toLocaleString()}
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
