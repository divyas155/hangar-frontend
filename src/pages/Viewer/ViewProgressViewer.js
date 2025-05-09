// src/pages/Viewer/ViewProgressViewer.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Snackbar, Alert,
  Button, Paper, TextField, Stack
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import api from '../../api';

function CommentSection({ itemId, type }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const loadComments = useCallback(async () => {
    try {
      const res = await api.get('/comments', { params: { itemId, type } });
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  }, [itemId, type]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post('/comments', { itemId, type, text: newComment });
      setNewComment('');
      loadComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="subtitle2" gutterBottom>Comments</Typography>
      <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 1, maxHeight: 180, overflowY: 'auto', mb: 1, backgroundColor: '#fafafa' }}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No comments yet.</Typography>
        ) : (
          comments.map((c, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {c.user?.username || 'User'} – {format(new Date(c.createdAt), 'dd/MM/yyyy, hh:mm a')}
              </Typography>
              <Typography variant="body2" sx={{ ml: 1 }}>{c.text}</Typography>
            </Box>
          ))
        )}
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <TextField
          size="small"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ whiteSpace: 'nowrap' }}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
}

export default function ViewProgressViewer() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate instanceof Date && !isNaN(startDate)) {
        params.startDate = startDate.toISOString();
      }
      if (endDate instanceof Date && !isNaN(endDate)) {
        params.endDate = endDate.toISOString();
      }

      const res = await api.get('/progress', { params });
      const data = res.data.map((p, idx) => ({
        ...p,
        id: p._id,
        zipUrl: p.zip?.url || '',
        uploadedBy: p.uploadedBy?.username || 'Unknown',
        serial: idx + 1
      }));
      setProgressList(data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load progress updates', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchProgress(); // Show all on first load
  }, [fetchProgress]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>View Approved Progress Updates</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <DatePicker
                label="From"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <DatePicker
                label="To"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" onClick={fetchProgress}>Apply</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {loading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={3}>
          {progressList.map((entry) => (
            <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Engineer:</strong> {entry.uploadedBy}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Date:</strong> {format(new Date(entry.date), 'dd/MM/yyyy')}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Description:</strong> {entry.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button href={entry.zipUrl} target="_blank" variant="outlined">
                    Download ZIP
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <CommentSection itemId={entry.id} type="progress" />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Stack>
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
