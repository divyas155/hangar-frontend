import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, Grid, CircularProgress, Snackbar, Alert, TextField, Paper
} from '@mui/material';
import api from '../../api';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CommentSection from '../../components/CommentSection';

export default function ViewProgress() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (dateRange[0]) {
        const from = new Date(dateRange[0]);
        from.setHours(0, 0, 0, 0);
        params.from = from.toISOString();
      }
      if (dateRange[1]) {
        const to = new Date(dateRange[1]);
        to.setHours(23, 59, 59, 999);
        params.to = to.toISOString();
      }

      const res = await api.get('/progress', { params });
      setProgressList(res.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load progress', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Your Progress Updates</Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <DatePicker
              label="From"
              value={dateRange[0]}
              onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="To"
              value={dateRange[1]}
              onChange={(newValue) => setDateRange([dateRange[0], newValue])}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={fetchProgress}>Refresh</Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      {loading ? (
        <CircularProgress />
      ) : progressList.length === 0 ? (
        <Typography>No progress updates found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {progressList.map((row) => (
            <Grid item xs={12} key={row._id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography fontWeight="bold">📅 Date: {new Date(row.date).toLocaleDateString()}</Typography>
                <Typography>Description: {row.description}</Typography>
                <Typography>Status: {row.status || 'pending'}</Typography>

                {row.zip?.url && row.status === 'approved' ? (
                  <Box mt={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => window.open(row.zip.url, '_blank')}
                    >
                      Download ZIP
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    ZIP not available
                  </Typography>
                )}

                {/* 💬 Comments Section */}
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    💬 Comments
                  </Typography>
                  <CommentSection itemId={row._id} type="progress" />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
