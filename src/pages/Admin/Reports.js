import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, Grid, Paper, Chip
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../api';

export default function Reports() {
  const [tab, setTab] = useState(0);
  const [payments, setPayments] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);

  const fetchReports = async () => {
    try {
      // ✅ Payments: fetch approved and rejected separately
      const approvedRes = await api.get('/payments', {
        params: { status: 'approved' }
      });
      const rejectedRes = await api.get('/payments', {
        params: { status: 'rejected' }
      });
      setPayments([...(approvedRes.data || []), ...(rejectedRes.data || [])]);

      // ✅ Progress: fetch approved and rejected separately
      const approvedProg = await api.get('/progress', {
        params: { status: 'approved' }
      });
      const rejectedProg = await api.get('/progress', {
        params: { status: 'rejected' }
      });
      setProgressUpdates([...(approvedProg.data || []), ...(rejectedProg.data || [])]);
    } catch (err) {
      console.error('❌ Error fetching reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getStatusColor = (status) =>
    status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'default';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>Reports</Typography>

      <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Payment Reports" />
        <Tab label="Progress Reports" />
      </Tabs>

      {/* ✅ Payment Reports */}
      {tab === 0 && (
        <>
          {payments.length === 0 ? (
            <Typography>No approved or rejected payments found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {payments.map((payment) => (
                <Grid item xs={12} sm={6} md={4} key={payment._id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography fontWeight="bold">💳 Payment ID: {payment.paymentID}</Typography>
                    <Typography>Date: {format(new Date(payment.date), 'dd/MM/yyyy')}</Typography>
                    <Typography>Amount: ₹{payment.amount}</Typography>
                    <Typography>Description: {payment.description || 'N/A'}</Typography>
                    <Typography>Submitted by: {payment.createdBy?.username || 'N/A'}</Typography>
                    <Box mt={1}>
                      <Chip
                        label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        color={getStatusColor(payment.status)}
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* ✅ Progress Reports */}
      {tab === 1 && (
        <>
          {progressUpdates.length === 0 ? (
            <Typography>No approved or rejected progress updates found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {progressUpdates.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p._id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography fontWeight="bold">📦 Progress ID: {p._id}</Typography>
                    <Typography>Date: {format(new Date(p.date), 'dd/MM/yyyy')}</Typography>
                    <Typography>Description: {p.description || 'N/A'}</Typography>
                    <Typography>Uploaded by: {p.uploadedBy?.username || 'N/A'}</Typography>
                    <Box mt={1}>
                      <Chip
                        label={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        color={getStatusColor(p.status)}
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
