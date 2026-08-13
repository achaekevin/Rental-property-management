import React from 'react';
import { Box, Container, Typography, Grid, Paper, useTheme } from '@mui/material';
import {
  Apartment as PropertyIcon,
  People as TenantIcon,
  Payment as PaymentIcon,
  Build as MaintenanceIcon,
  Assessment as ReportsIcon,
  FolderSpecial as DocumentIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <PropertyIcon fontSize="large" color="primary" />,
    title: 'Property & Unit Management',
    description:
      'Organize real estate portfolios by building, unit count, amenities, rental rates, and real-time occupancy status.',
  },
  {
    icon: <TenantIcon fontSize="large" color="primary" />,
    title: 'Tenant Records & Leases',
    description:
      'Store tenant profiles, active lease agreements, contact details, unit assignments, and emergency numbers in one place.',
  },
  {
    icon: <PaymentIcon fontSize="large" color="primary" />,
    title: 'Rent Collection & Payments',
    description:
      'Automate monthly rent invoices, track balance histories, and support direct digital payment processing including M-Pesa STK Push.',
  },
  {
    icon: <MaintenanceIcon fontSize="large" color="primary" />,
    title: 'Maintenance Work Orders',
    description:
      'Allow tenants to submit maintenance issues directly. Track repair tickets from submission through assignment to completion.',
  },
  {
    icon: <ReportsIcon fontSize="large" color="primary" />,
    title: 'Financial Reports & Analytics',
    description:
      'Monitor expected vs. collected revenue, track operating expenses, calculate occupancy rates, and evaluate property yields.',
  },
  {
    icon: <DocumentIcon fontSize="large" color="primary" />,
    title: 'Notifications & Documents',
    description:
      'Send instant system notifications for due rent, lease renewals, and maintenance updates while managing lease documentation securely.',
  },
];

const FeaturesSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : '#f8fafc',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
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
            Core Capabilities
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
            Built for modern property operations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Renta provides a streamlined suite of real-estate tools to eliminate operational friction and keep managers, owners, and tenants aligned.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3.5}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.25s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: theme.palette.primary.main,
                    boxShadow: isDark
                      ? '0 12px 28px rgba(0, 0, 0, 0.4)'
                      : '0 12px 28px rgba(25, 118, 210, 0.1)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 2.5,
                    backgroundColor: isDark ? 'rgba(25, 118, 210, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
