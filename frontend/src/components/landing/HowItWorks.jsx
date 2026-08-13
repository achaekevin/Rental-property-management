import React from 'react';
import { Box, Container, Typography, Grid, Paper, useTheme } from '@mui/material';

const steps = [
  {
    step: '01',
    title: 'Set up your properties',
    description:
      'Add properties, building details, individual rental units, amenities, and default monthly rental rates.',
  },
  {
    step: '02',
    title: 'Manage tenants & leases',
    description:
      'Assign tenants to units, record start/end lease terms, store emergency contact details, and issue digital leases.',
  },
  {
    step: '03',
    title: 'Track rent & maintenance',
    description:
      'Generate monthly rent invoices, process online payments via M-Pesa, and resolve maintenance tickets efficiently.',
  },
  {
    step: '04',
    title: 'Monitor performance',
    description:
      'Review occupancy ratios, expected vs collected revenue, pending balances, and overall operating expense metrics.',
  },
];

const HowItWorks = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="how-it-works"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : '#f8fafc',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 6, md: 8 } }}>
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
            Workflow
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '2.8rem' },
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Four simple steps to organized management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Get your properties and tenancy records configured in minutes with our intuitive setup process.
          </Typography>
        </Box>

        {/* Steps Grid */}
        <Grid container spacing={3}>
          {steps.map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: '2.5rem',
                    color: theme.palette.primary.main,
                    opacity: 0.8,
                    mb: 1.5,
                    fontFamily: 'monospace',
                  }}
                >
                  {item.step}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
