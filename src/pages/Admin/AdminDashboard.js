import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Grid, Box, CircularProgress, Snackbar, Alert, Button
} from '@mui/material';
import api from '../../api';
import CommentSection from '../../components/CommentSection';

const AdminDashboard = () => {
  const [progressReports, setProgressReports] = useState([]);
  const [paymentReports, setPaymentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const progressRes = await api.get('/progress?status=approved,rejected');
      const paymentRes = await api.get('/payments?status=approved,rejected');
      setProgressReports(progressRes.data || []);
      setPaymentReports(paymentRes.data || []);
    } catch (err) {
      console.error('❌ Report fetch failed:', err);
      setAlert({ open: true, message: 'Failed to load reports', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Reports</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {/* Payment Reports */}
          <Typography variant="h6" gutterBottom>Payment Reports</Typography>
          <Grid container spacing={2} mb={4}>
            {paymentReports.length === 0 ? (
              <Typography ml={2}>No approved or rejected payments found.</Typography>
            ) : (
              paymentReports.map((payment) => (
                <Grid item xs={12} key={payment._id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography fontWeight="bold">💳 Payment ID: {payment.paymentID}</Typography>
                    <Typography>Date: {new Date(payment.date).toLocaleDateString()}</Typography>
                    <Typography>Amount: ₹{payment.amount}</Typography>
                    <Typography>Status: {payment.status}</Typography>
                    <Typography>Description: {payment.description || 'N/A'}</Typography>

                    <Box mt={2}>
                      <CommentSection itemId={payment._id} type="payment" />
                    </Box>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>

          {/* Progress Reports */}
          <Typography variant="h6" gutterBottom>Progress Reports</Typography>
          <Grid container spacing={2}>
            {progressReports.length === 0 ? (
              <Typography ml={2}>No approved or rejected progress entries found.</Typography>
            ) : (
              progressReports.map((progress) => (
                <Grid item xs={12} key={progress._id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography fontWeight="bold">📅 Date: {new Date(progress.date).toLocaleDateString()}</Typography>
                    <Typography>Status: {progress.status}</Typography>
                    <Typography>Description: {progress.description}</Typography>
                    {progress.zip?.url && progress.status === 'approved' && (
                      <Box mt={1}>
                        <Button variant="outlined" size="small" onClick={() => window.open(progress.zip.url, '_blank')}>
                          Download ZIP
                        </Button>
                      </Box>
                    )}

                    <Box mt={2}>
                      <CommentSection itemId={progress._id} type="progress" />
                    </Box>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={alert.open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard;
