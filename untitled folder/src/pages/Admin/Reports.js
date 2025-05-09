import React, { useState } from 'react';
import {
  Container, Typography, Paper, TextField, Button, Box,
  Table, TableHead, TableRow, TableCell, TableBody, Alert
} from '@mui/material';
import { progressService, paymentService } from '../../api';

const Reports = () => {
  const [date, setDate] = useState('');
  const [progressResults, setProgressResults] = useState([]);
  const [paymentResults, setPaymentResults] = useState([]);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setError('');
    setSearched(true);

    try {
      const [progressRes, paymentRes] = await Promise.all([
        progressService.getProgressByDate(date),
        paymentService.getPaymentsByDate(date),
      ]);

      setProgressResults(progressRes.data || []);
      setPaymentResults(paymentRes.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch date-wise data:', err);
      setError('Failed to load records. Please check server or date format.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>📊 Admin: Reports by Date</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Box>

        {searched && (
          <>
            {/* Progress Report */}
            <Typography variant="h6" gutterBottom>📁 Progress Uploads</Typography>
            {progressResults.length === 0 ? (
              <Typography>No progress found for selected date.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progressResults.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>{p.engineerName || 'N/A'}</TableCell>
                      <TableCell>{p.location || 'Unknown'}</TableCell>
                      <TableCell>{p.isApproved ? 'Approved' : 'Pending'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Payment Report */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>💰 Payments</Typography>
            {paymentResults.length === 0 ? (
              <Typography>No payments found for selected date.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentResults.map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>{p.customerName || 'N/A'}</TableCell>
                      <TableCell>{p.amount}</TableCell>
                      <TableCell>{p.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Reports;
