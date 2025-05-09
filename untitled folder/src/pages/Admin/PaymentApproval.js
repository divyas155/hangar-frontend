import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, CircularProgress, Alert,
  Table, TableHead, TableRow, TableCell, TableBody, Button
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../api'; // ✅ centralized service

const PaymentApproval = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPendingPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.getPendingPayments(); // ✅ use service
      setPayments(res.data);
      setError('');
    } catch (err) {
      console.error('❌ Failed to fetch payments:', err);
      setError('Error fetching pending payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      await paymentService.approvePayment(paymentId); // ✅ use service
      setSuccess('✅ Payment approved successfully');
      fetchPendingPayments();
    } catch (err) {
      console.error('❌ Failed to approve payment:', err);
      setError('Error approving payment');
    }
  };

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>💳 Admin: Payment Approval</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <CircularProgress />
        ) : payments.length === 0 ? (
          <Typography>No pending payments found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment._id}</TableCell>
                  <TableCell>{payment.customerName || 'N/A'}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {payment.status !== 'approved' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleApprove(payment._id)}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentApproval;
