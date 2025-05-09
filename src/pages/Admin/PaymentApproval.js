import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, Snackbar, Alert, Stack, TextField
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../api';
import CommentSection from '../../components/CommentSection';

export default function PaymentApproval() {
  const [payments, setPayments] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [commentMap, setCommentMap] = useState({});

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments?status=pending');
      setPayments(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch payments:', err);
      setAlert({
        open: true,
        message: 'Failed to load payments',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (paymentID, isApprove) => {
    try {
      const payload = {
        status: isApprove ? 'approved' : 'rejected',
        comments: commentMap[paymentID] || ''
      };

      await api.patch(`/payments/by-payment-id/${paymentID}/approve`, payload);

      // 🔄 Re-fetch full list instead of just removing one
      fetchPayments();

      setAlert({
        open: true,
        message: `Payment ${isApprove ? 'approved' : 'rejected'} successfully`,
        severity: isApprove ? 'success' : 'warning'
      });
    } catch (err) {
      console.error(`❌ Payment ${isApprove ? 'approval' : 'rejection'} failed:`, err);
      setAlert({
        open: true,
        message: `Payment ${isApprove ? 'approval' : 'rejection'} failed`,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>
        Pending Payment Approvals
      </Typography>

      {payments.length === 0 ? (
        <Typography color="text.secondary">
          No pending payments found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {payments.map((payment) => (
            <Grid item xs={12} key={payment._id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  💳 Payment ID: {payment.paymentID}
                </Typography>
                <Typography>Date: {format(new Date(payment.date), 'dd/MM/yyyy')}</Typography>
                <Typography>Amount: ₹{payment.amount}</Typography>
                <Typography>Description: {payment.description || 'N/A'}</Typography>
                <Typography variant="body2" mt={1} color="text.secondary">
                  Submitted by: {payment.createdBy?.username || 'Unknown'}
                </Typography>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Approval/Rejection Comment (optional)"
                  value={commentMap[payment.paymentID] || ''}
                  onChange={(e) =>
                    setCommentMap((prev) => ({
                      ...prev,
                      [payment.paymentID]: e.target.value
                    }))
                  }
                />

                <Stack direction="row" spacing={1} mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(payment.paymentID, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleAction(payment.paymentID, false)}
                  >
                    Reject
                  </Button>
                </Stack>

                <Box mt={2}>
                  <CommentSection itemId={payment._id} type="payment" />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={alert.severity}
          onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
