import React, { useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, Container, LinearProgress, Chip
} from '@mui/material';
import { Analytics, Money, Home, People, Build } from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';

const ReportsAnalytics = () => {
  const [darkMode, setDarkMode] = useState(false);
  useAutoLogout();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics sx={{ fontSize: '2rem' }} />
                Reports & Financial Analytics
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Financial performance, occupancy metrics & maintenance reporting
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                <Typography variant="subtitle2" color="text.secondary">Net Profit</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>KSh 450,000</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                <Typography variant="subtitle2" color="text.secondary">Avg Occupancy</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>92.5%</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #FF9800' }}>
                <Typography variant="subtitle2" color="text.secondary">Tenant Retention</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>88%</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 2, borderLeft: '4px solid #9C27B0' }}>
                <Typography variant="subtitle2" color="text.secondary">Maintenance ROI</Typography>
                <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>3.4x</Typography>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Monthly Financial Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed breakdown of rent collections, operational expenses, utility costs, and net operating income (NOI).
            </Typography>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default ReportsAnalytics;
