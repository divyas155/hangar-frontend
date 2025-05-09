import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import ListAltIcon from '@mui/icons-material/ListAlt';

const modules = [
  { title: 'Submit New Payment', to: '/payment/submit', icon: <PaymentIcon fontSize="large" /> },
  { title: 'View Submitted Payments', to: '/payment/view', icon: <ListAltIcon fontSize="large" /> },
];

export default function PaymentAuthorityDashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Payment Authority Dashboard
      </Typography>
      <Grid container spacing={3}>
        {modules.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.to}>
            <Card sx={{ height: '100%' }}>
              <CardActionArea onClick={() => navigate(m.to)} sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {m.icon}
                    <Typography variant="h6">{m.title}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
