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
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Site Engineer Dashboard
      </Typography>

      <Grid container spacing={3}>
        {modules.map((module) => (
          <Grid item xs={12} sm={6} md={4} key={module.to}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { boxShadow: 6, transform: 'scale(1.02)' },
              }}
              onClick={() => navigate(module.to)}
            >
              <CardContent>
                <Typography variant="h6" align="center">
                  {module.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
