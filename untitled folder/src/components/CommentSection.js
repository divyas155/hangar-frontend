// src/components/CommentSection.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../api';

export default function CommentSection({ itemId, type }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // load comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/comments', {
        params: { itemId, type }
      });
      setComments(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load comments', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchComments();
  }, [itemId, type]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post('/comments', {
        itemId,
        type,
        comment: newComment.trim()
      });
      setNewComment('');
      setSnackbar({ open: true, message: 'Comment posted', severity: 'success' });
      fetchComments();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to post comment', severity: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" gutterBottom>
        Comments
      </Typography>

      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <List dense sx={{ maxHeight: 200, overflow: 'auto', mb: 1 }}>
          {comments.map((c) => (
            <ListItem key={c.id || c._id} alignItems="flex-start">
              <ListItemText
                primary={c.user?.username || c.author}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {new Date(c.createdAt).toLocaleString()}
                    </Typography>
                    {` — ${c.comment}`}
                  </>
                }
              />
            </ListItem>
          ))}
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}
        </List>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Add comment..."
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={!newComment.trim()}
        >
          Post
        </Button>
      </Box>

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
