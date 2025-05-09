import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../api';

export default function UploadProgress() {
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handlePhotoChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 10) {
      setSnackbar({ open: true, message: 'Max 10 photos allowed', severity: 'error' });
      return;
    }
    setPhotos(selected);
  };

  const handleVideoChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 1) {
      setSnackbar({ open: true, message: 'Only 1 video allowed', severity: 'error' });
      return;
    }
    setVideos(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !description) {
      setSnackbar({ open: true, message: 'Date and description are required', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('date', date.toISOString());
    formData.append('description', description);
    photos.forEach(file => formData.append('photos', file));
    videos.forEach(file => formData.append('video', file));

    setLoading(true);
    try {
      await api.post('/progress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSnackbar({ open: true, message: 'Progress uploaded successfully', severity: 'success' });
      setDate(null);
      setDescription('');
      setPhotos([]);
      setVideos([]);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Upload failed',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Upload Progress</Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handlePhotoChange}
                />
              </Button>
              {photos.length > 0 && (
                <Typography variant="body2" mt={1}>
                  {photos.length} photo(s) selected
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  hidden
                  onChange={handleVideoChange}
                />
              </Button>
              {videos.length > 0 && (
                <Typography variant="body2" mt={1}>
                  {videos.length} video selected
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ position: 'relative' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  Submit Progress
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      mt: '-12px',
                      ml: '-12px'
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </LocalizationProvider>

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
