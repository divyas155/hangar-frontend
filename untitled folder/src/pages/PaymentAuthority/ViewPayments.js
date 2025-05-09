// src/pages/PaymentAuthority/ViewPayments.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DateRangePicker from '../../components/DateFilter';
import api from '../../api';
import CommentSection from '../../components/CommentSection';

export default function ViewPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange[0]) params.from = dateRange[0].toISOString();
      if (dateRange[1]) params.to = dateRange[1].toISOString();
      // you can add status filter if needed, e.g. only 'approved'
      const res = await api.get('/payments', { params });
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load payments', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [dateRange]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: ({ row }) => new Date(row.date).toLocaleDateString()
    },
    { field: 'amount', headerName: 'Amount', width: 120 },
    { field: 'description', headerName: 'Description', flex: 1 },
    {
      field: 'documents',
      headerName: 'Docs',
      width: 120,
      renderCell: ({ row }) => (
        <Button
          size="small"
          onClick={() => window.open(row.documentsZipUrl, '_blank')}
        >
          Download
        </Button>
      )
    },
    {
      field: 'comments',
      headerName: 'Comments',
      width: 200,
      renderCell: ({ row }) => (
        <CommentSection itemId={row.id} type="payment" />
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        View Payments
      </Typography>

      <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <DateRangePicker
            start={dateRange[0]}
            end={dateRange[1]}
            onChange={setDateRange}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={fetchPayments}>
            Refresh
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={payments}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
