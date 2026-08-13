import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  Apartment as PropertyIcon,
  CheckCircle as CheckIcon,
  PendingActions as PendingIcon,
  BuildCircle as MaintenanceIcon,
  MonetizationOn as MoneyIcon,
} from '@mui/icons-material';

const ProductPreview = ({ stats }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const propertiesCount = stats?.properties ?? '—';
  const unitsCount = stats?.units ?? '—';
  const occupancyRate = stats?.occupancyRate ? `${stats.occupancyRate}%` : '—';

  return (
    <Box id="preview" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 5, md: 7 } }}>
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
            System Interface
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
            Intuitive dashboard experience
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            A unified management dashboard designed for quick navigation, financial clarity, and operational control.
          </Typography>
        </Box>

        {/* Mocked Interface Container */}
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: isDark
              ? '0 24px 48px rgba(0, 0, 0, 0.6)'
              : '0 24px 48px rgba(25, 118, 210, 0.12)',
          }}
        >
          {/* Top Bar Window Chrome */}
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              backgroundColor: isDark ? '#0f172a' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <Box sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <Box sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#10b981' }} />
            </Box>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600, opacity: 0.7 }}>
              app.renta.com / dashboard
            </Typography>
            <Box sx={{ width: 40 }} />
          </Box>

          {/* Dashboard Preview Content */}
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            {/* Top Metrics Row */}
            <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(25, 118, 210, 0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      MANAGED PROPERTIES
                    </Typography>
                    <PropertyIcon fontSize="small" color="primary" />
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {propertiesCount}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(25, 118, 210, 0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      TOTAL UNITS
                    </Typography>
                    <CheckIcon fontSize="small" color="success" />
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {unitsCount}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(25, 118, 210, 0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      OCCUPANCY RATE
                    </Typography>
                    <MoneyIcon fontSize="small" color="primary" />
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {occupancyRate}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(25, 118, 210, 0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      SYSTEM STATUS
                    </Typography>
                    <PendingIcon fontSize="small" color="action" />
                  </Box>
                  <Chip label="OPERATIONAL" size="small" color="success" sx={{ fontWeight: 700, mt: 0.5 }} />
                </Paper>
              </Grid>
            </Grid>

            {/* Operations Table Preview */}
            <Paper variant="outlined" sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Active Operations Summary
                </Typography>
              </Box>
              <Table size="small">
                <TableHead sx={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Module</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Primary Function</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Automation Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Lease Invoicing</TableCell>
                    <TableCell>Monthly rent generation & balance tracking</TableCell>
                    <TableCell><Chip label="Active" color="success" size="small" variant="outlined" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Payment Gateway</TableCell>
                    <TableCell>Direct M-Pesa STK push & ACH reconciliation</TableCell>
                    <TableCell><Chip label="Active" color="success" size="small" variant="outlined" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Maintenance Routing</TableCell>
                    <TableCell>Tenant ticket logging & vendor assignment</TableCell>
                    <TableCell><Chip label="Active" color="success" size="small" variant="outlined" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProductPreview;
