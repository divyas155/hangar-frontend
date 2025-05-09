// src/components/FileUpload.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FileUpload({
  label = 'Upload Files',
  accept = '*',
  multiple = false,
  onChange
}) {
  const [files, setFiles] = useState([]);

  // whenever files change, propagate to parent
  useEffect(() => {
    if (onChange) {
      // pass array of { file, caption }
      onChange(files);
    }
  }, [files, onChange]);

  const handleFilesSelected = (e) => {
    const selected = Array.from(e.target.files).map((file) => ({
      file,
      caption: ''
    }));
    setFiles((prev) => multiple ? [...prev, ...selected] : selected);
    e.target.value = null; // reset input
  };

  const handleCaptionChange = (index, caption) => {
    setFiles((prev) => {
      const next = [...prev];
      next[index].caption = caption;
      return next;
    });
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadFileIcon />}
      >
        {label}
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={handleFilesSelected}
        />
      </Button>

      {files.length > 0 && (
        <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
          {files.map((item, idx) => (
            <Paper
              key={idx}
              variant="outlined"
              sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2">
                  {item.file.name}
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Add caption (optional)"
                  value={item.caption}
                  onChange={(e) => handleCaptionChange(idx, e.target.value)}
                  sx={{ mt: 1 }}
                />
              </Box>
              <IconButton
                color="error"
                onClick={() => handleRemove(idx)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
);
}
