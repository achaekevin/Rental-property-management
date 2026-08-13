import React from 'react';
import { Box, Container, Typography, Grid, Paper, useTheme } from '@mui/material';
import {
  ApartmentOutlined,
  HomeWorkOutlined,
  PeopleAltOutlined,
  SpeedOutlined,
} from '@mui/icons-material';

const StatisticsSection = ({ stats, loading, error }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Extract actual data or handle empty/zero database
  const propertiesCount = stats?.properties ?? 0;
  const unitsCount = stats?.units ?? 0;
  const tenantsCount = stats?.tenants ?? 0;
  const occupancyRate = stats?.occupancyRate ?? 0;

  // Determine if database actually contains records
  const hasRealMetrics = propertiesCount > 0 || unitsCount > 0 || tenantsCount > 0;

  return (
    <Box
      id="statistics"
      sx={{
        py: { xs: 8, md: 10 },
        backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : '#f8fafc',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              mb: 1,
            }}
          >
            Platform Overview
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.4rem' },
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: theme.palette.text.primary,
              mb: 1.5,
            }}
          >
            Verified Platform Metrics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live database statistics reflecting active system usage.
          </Typography>
        </Box>

        {hasRealMetrics ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <ApartmentOutlined color="primary" sx={{ fontSize: 36, mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="primary" sx={{ mb: 0.5 }}>
                  {propertiesCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Managed Properties
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <HomeWorkOutlined color="primary" sx={{ fontSize: 36, mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="primary" sx={{ mb: 0.5 }}>
                  {unitsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Total Rental Units
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <PeopleAltOutlined color="primary" sx={{ fontSize: 36, mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="primary" sx={{ mb: 0.5 }}>
                  {tenantsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Active Tenants
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  textAlign: 'center',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <SpeedOutlined color="primary" sx={{ fontSize: 36, mb: 1 }} />
                <Typography variant="h3" fontWeight={800} color="primary" sx={{ mb: 0.5 }}>
                  {occupancyRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Occupancy Rate
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              backgroundColor: theme.palette.background.paper,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              Complete Property Management Automation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, maxWidth: 600, mx: 'auto' }}>
              Manage properties, leases, tenant records, rent collections, and maintenance requests seamlessly from a single unified platform.
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default StatisticsSection;
