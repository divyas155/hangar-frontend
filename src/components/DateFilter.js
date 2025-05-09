// ✅ src/components/DateFilter.js
import React from 'react';
import { TextField, Box, Button } from '@mui/material';

export default function DateFilter({ start, end, onChange = () => {}, onApply = () => {} }) {
  const handleStartChange = (e) => {
    const newStart = e.target.value;
    onChange([newStart, end]);
  };

  const handleEndChange = (e) => {
    const newEnd = e.target.value;
    onChange([start, newEnd]);
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="From"
        type="date"
        value={start || ''}
        onChange={handleStartChange}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <TextField
        label="To"
        type="date"
        value={end || ''}
        onChange={handleEndChange}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <Button
        variant="contained"
        size="medium"
        onClick={() => onApply([start, end])}
      >
        Apply
      </Button>
    </Box>
  );
}
