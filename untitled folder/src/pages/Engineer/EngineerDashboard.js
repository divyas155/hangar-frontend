// src/pages/Engineer/EngineerDashboard.js
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const modules = [
  { title: 'Upload Progress', to: '/engineer/upload' },
  { title: 'View Progress', to: '/engineer/view' },
];

export default function EngineerDashboard() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Site Engineer Dashboard
      </Typography>
      <Grid container spacing={3}>
        {modules.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.to}>
            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(m.to)}
            >
              <CardContent>
                <Typography variant="h6">{m.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
