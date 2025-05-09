import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const modules = [
  { title: 'View Progress Updates', to: '/viewer/progress' },
  { title: 'View Approved Payments', to: '/viewer/payments' },
];

export default function ViewerDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Viewer Dashboard
      </Typography>

      <Grid container spacing={3}>
        {modules.map(({ title, to }) => (
          <Grid item xs={12} sm={6} md={4} key={to}>
            <Card
              role="button"
              tabIndex={0}
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
              onClick={() => navigate(to)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(to);
              }}
            >
              <CardContent>
                <Typography variant="h6">{title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
