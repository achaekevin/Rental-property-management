import React from 'react';
import { Box, Container, Typography, Grid, Paper, Chip, useTheme } from '@mui/material';
import {
  AdminPanelSettings as SuperAdminIcon,
  ManageAccounts as ManagerIcon,
  HomeWork as LandlordIcon,
  Person as TenantRoleIcon,
} from '@mui/icons-material';

const roles = [
  {
    title: 'Super Administrator',
    roleCode: 'SUPER_ADMINISTRATOR',
    icon: <SuperAdminIcon fontSize="large" color="primary" />,
    tag: 'Platform Governance',
    description:
      'Control users, organizations, permissions and system-wide configurations with complete oversight.',
    capabilities: ['Organization management', 'Role & access controls', 'System health diagnostics', 'Platform activity logs'],
  },
  {
    title: 'Property Manager',
    roleCode: 'PROPERTY_MANAGER',
    icon: <ManagerIcon fontSize="large" color="primary" />,
    tag: 'Day-to-Day Operations',
    description:
      'Manage properties, tenants, leases, rent, maintenance and daily property management workflow.',
    capabilities: ['Unit inventory & leases', 'Rent invoicing & receipts', 'Maintenance dispatching', 'Operational reporting'],
  },
  {
    title: 'Landlord / Owner',
    roleCode: 'LANDLORD',
    icon: <LandlordIcon fontSize="large" color="primary" />,
    tag: 'Asset Performance',
    description:
      'Monitor properties, occupancy rates, rental income collections, operating expenses and net yields.',
    capabilities: ['Property portfolio metrics', 'Collected vs expected rent', 'Operating expense logs', 'Net cash flow summaries'],
  },
  {
    title: 'Tenant',
    roleCode: 'TENANT',
    icon: <TenantRoleIcon fontSize="large" color="primary" />,
    tag: 'Self-Service Portal',
    description:
      'View your lease agreement, rent invoices, digital payment history, lease documents and maintenance requests.',
    capabilities: ['Digital rent payments (M-Pesa)', 'Submit maintenance tickets', 'Lease agreement view', 'Instant notifications'],
  },
];

const RolesSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box id="roles" sx={{ py: { xs: 8, md: 12 } }}>
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
            Role-Based Access
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
            Tailored experiences for every stakeholder
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Renta adapts to your exact role in the property ecosystem, delivering specialized dashboards and permission-controlled workflows.
          </Typography>
        </Box>

        {/* Roles Grid */}
        <Grid container spacing={3.5}>
          {roles.map((role, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  height: '100%',
                  borderRadius: 3,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  backgroundColor: theme.palette.background.paper,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s ease-in-out',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: isDark
                      ? '0 12px 28px rgba(0,0,0,0.4)'
                      : '0 12px 28px rgba(25, 118, 210, 0.1)',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: isDark ? 'rgba(25, 118, 210, 0.15)' : 'rgba(25, 118, 210, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {role.icon}
                    </Box>
                    <Chip
                      label={role.tag}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </Box>

                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {role.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {role.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    pt: 2,
                    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Typography variant="caption" color="primary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Key Focus Areas
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {role.capabilities.map((cap, capIdx) => (
                      <Chip
                        key={capIdx}
                        label={cap}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RolesSection;
