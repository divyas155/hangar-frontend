import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Snackbar, Alert,
  Button, CircularProgress, Stack
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../api';
import CommentSection from '../../components/CommentSection';

export default function ProgressApproval() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await api.get('/progress');
      setProgressList(res.data.filter(p => p.status === 'pending'));
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load progress updates', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.patch(`/progress/${id}/approve`, { status });
      fetchProgress();
      setSnackbar({
        open: true,
        message: status === 'approved' ? 'Progress approved' : 'Progress rejected',
        severity: status === 'approved' ? 'success' : 'warning'
      });
    } catch {
      setSnackbar({ open: true, message: 'Action failed', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Pending Progress Approvals</Typography>
      {loading ? <CircularProgress /> : (
        progressList.map((p) => (
          <Paper key={p._id} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><Typography><strong>Engineer:</strong> {p.uploadedBy?.username || 'N/A'}</Typography></Grid>
              <Grid item xs={12} sm={6}><Typography><strong>Date:</strong> {format(new Date(p.date), 'dd/MM/yyyy')}</Typography></Grid>
              <Grid item xs={12}><Typography><strong>Description:</strong> {p.description}</Typography></Grid>
              <Grid item xs={12}>
                <Button href={p.zip?.url} target="_blank" variant="outlined">Download ZIP</Button>
              </Grid>
              <Grid item xs={12}><CommentSection itemId={p._id} type="progress" /></Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" onClick={() => handleAction(p._id, 'approved')}>Approve</Button>
                  <Button variant="contained" color="error" onClick={() => handleAction(p._id, 'rejected')}>Reject</Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
