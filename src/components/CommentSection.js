import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Stack
} from '@mui/material';
import api from '../api';
import { format } from 'date-fns';

export default function CommentSection({ itemId, type }) {
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
    <Card variant="outlined" sx={{ mt: 1 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>Comments</Typography>

        <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, backgroundColor: '#f9f9f9', p: 1, borderRadius: 1 }}>
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

        <Stack spacing={1}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSubmit}
          >
            Submit Comment
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
