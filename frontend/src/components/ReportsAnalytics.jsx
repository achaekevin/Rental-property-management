import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, Container, CircularProgress
} from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';
import Navigation from './Navigation';
import useAutoLogout from '../hooks/useAutoLogout';
import api from '../services/api';

const ReportsAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useAutoLogout();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/stats');
      if (res.data && res.data.success) {
        setMetrics(res.data.data.metrics || {});
      }
    } catch (err) {
      console.error('Error fetching analytics statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon sx={{ fontSize: '2rem' }} />
                Reports & Financial Analytics
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Calculated directly from real system database records
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #4CAF50' }}>
                    <Typography variant="subtitle2" color="text.secondary">Total Rent Collected</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      KSh {(metrics?.totalRentCollected || metrics?.collectedRent || metrics?.rentCollected || 0).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #2196F3' }}>
                    <Typography variant="subtitle2" color="text.secondary">Occupancy Rate</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      {metrics?.occupancyRate !== undefined ? `${metrics.occupancyRate}%` : `${metrics?.totalUnits > 0 ? Math.round((metrics.occupiedUnits / metrics.totalUnits) * 100) : 0}%`}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #FF9800' }}>
                    <Typography variant="subtitle2" color="text.secondary">Outstanding Rent Balance</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      KSh {(metrics?.outstandingRent || 0).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ p: 2, borderLeft: '4px solid #9C27B0' }}>
                    <Typography variant="subtitle2" color="text.secondary">Total Properties / Units</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                      {metrics?.totalProperties || 0} / {metrics?.totalUnits || 0}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Card sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Real-time Database Financial Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Statistics on this page are fetched directly from your MySQL database tables (`properties`, `tenants`, `payments`, `expenses`, `invoices`). As you add, edit, or delete items in the system, these figures update automatically and persist across logouts and page refreshes.
                </Typography>
              </Card>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default ReportsAnalytics;
