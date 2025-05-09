// src/pages/PaymentAuthority/UpdatePayment.js
import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../api';

export default function UpdatePayment() {
  const [paymentID, setPaymentID] = useState('');
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentID || !date || !amount || !description) {
      setSnackbar({ open: true, message: 'All required fields must be filled', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      await api.post('/payments', {
        paymentID,
        date,
        amount: parseFloat(amount),
        description,
        remarks
      });

      setSnackbar({ open: true, message: 'Payment submitted successfully', severity: 'success' });
      setPaymentID('');
      setDate(null);
      setAmount('');
      setDescription('');
      setRemarks('');
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Submit failed';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Submit New Payment</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Payment ID" fullWidth required value={paymentID} onChange={e => setPaymentID(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Amount" type="number" fullWidth required value={amount} onChange={e => setAmount(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth required multiline rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Remarks (Optional)" fullWidth multiline rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Button type="submit" variant="contained" fullWidth disabled={loading}>
                Submit Payment
              </Button>
              {loading && (
                <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
      <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  sx={{
    mb: 3,              // margin from bottom
    mr: 3,              // margin from right
    zIndex: 2000        // ensure it’s above other UI layers
  }}
>
  <Alert
    severity={snackbar.severity}
    variant="filled"
    onClose={() => setSnackbar({ ...snackbar, open: false })}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </Box>
  );
}
