// src/components/DateFilter.js
import React from 'react';
import { TextField, Box, Button } from '@mui/material';

export default function DateFilter({ from, to, onChange, onApply }) {
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        label="From"
        type="date"
        value={from}
        onChange={e => onChange({ from: e.target.value, to })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="To"
        type="date"
        value={to}
        onChange={e => onChange({ from, to: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" onClick={() => onApply(from, to)}>
        Apply
      </Button>
    </Box>
  );
}
