// src/components/DataTable.js
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function DataTable({
  rows,
  columns,
  loading,
  pageSize = 10,
  rowsPerPageOptions = [5, 10, 20],
  autoHeight = true,
  onRowClick,
  ...props
}) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No records found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        autoHeight={autoHeight}
        disableSelectionOnClick
        onRowClick={onRowClick}
        getRowId={(row) => row.id || row._id}
        {...props}
      />
    </Box>
  );
}
