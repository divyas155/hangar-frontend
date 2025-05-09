// src/pages/PaymentAuthority/UpdatePayment.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

export default function UpdatePayment() {
  const { id } = useParams();          // payment ID from route, if editing
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // if editing existing payment, fetch its current data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/payments/${id}`)
      .then(res => {
        const p = res.data;
        setDate(new Date(p.date));
        setAmount(p.amount);
        setDescription(p.description);
      })
      .catch(err => {
        console.error(err);
        setSnackbar({ open: true, message: 'Failed to load payment', severity: 'error' });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = e => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!date || !amount || !description) {
      setSnackbar({ open: true, message: 'All fields are required', severity: 'warning' });
      return;
    }
    const formData = new FormData();
    formData.append('date', date.toISOString());
    formData.append('amount', amount);
    formData.append('description', description);
    documents.forEach(file => formData.append('documents', file));
    
    setLoading(true);
    try {
      if (id) {
        // update existing
        await api.put(`/payments/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSnackbar({ open: true, message: 'Payment updated successfully', severity: 'success' });
      } else {
        // create new
        await api.post('/payments', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSnackbar({ open: true, message: 'Payment added successfully', severity: 'success' });
      }
      navigate('/payment/view');
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Submit failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Update Payment' : 'Add Payment'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Payment Date"
              value={date}
              onChange={newDate => setDate(newDate)}
              renderInput={params => <TextField fullWidth required {...params} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              required
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" component="label" fullWidth>
              {id ? 'Replace Documents' : 'Upload Documents'}
              <input
                type="file"
                accept="application/pdf,image/*,video/*"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {documents.length > 0 && (
              <Typography variant="body2" mt={1}>
                {documents.length} file(s) selected
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {id ? 'Update Payment' : 'Add Payment'}
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px'
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
