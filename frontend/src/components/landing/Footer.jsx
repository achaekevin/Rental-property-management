import React from 'react';
import { Box, Container, Typography, Grid, Link, useTheme } from '@mui/material';
import { Apartment as ApartmentIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const scrollToSection = (href) => {
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: isDark ? '#0b0f19' : '#0f172a',
        color: '#f8fafc',
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <ApartmentIcon fontSize="small" />
              </Box>
              <Typography variant="h6" fontWeight={800} letterSpacing="-0.5px" color="#fff">
                RENTA
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, maxWidth: 320 }}>
              Commercial-grade property management software streamlining real-estate operations, tenancy records, rent collection, and maintenance tracking.
            </Typography>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 2 }}>
              Product Navigation
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Link
                component="button"
                onClick={() => scrollToSection('#hero')}
                underline="none"
                sx={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', '&:hover': { color: '#fff' } }}
              >
                Home
              </Link>
              <Link
                component="button"
                onClick={() => scrollToSection('#features')}
                underline="none"
                sx={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', '&:hover': { color: '#fff' } }}
              >
                Core Features
              </Link>
              <Link
                component="button"
                onClick={() => scrollToSection('#how-it-works')}
                underline="none"
                sx={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', '&:hover': { color: '#fff' } }}
              >
                How It Works
              </Link>
            </Box>
          </Grid>

          {/* User Roles */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 2 }}>
              System Portals
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Super Administrator
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Property Manager
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Landlord / Owner
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Tenant Portal
              </Typography>
            </Box>
          </Grid>

          {/* Account Links */}
          <Grid item xs={12} sm={4} md={2.5}>
            <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 2 }}>
              Account Access
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              <Link
                component="button"
                onClick={() => navigate('/tenant/login')}
                underline="none"
                sx={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', '&:hover': { color: '#fff' } }}
              >
                System Sign In
              </Link>
              <Link
                component="button"
                onClick={() => navigate('/tenant/register')}
                underline="none"
                sx={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left', '&:hover': { color: '#fff' } }}
              >
                Account Registration
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            © {new Date().getFullYear()} Renta Property Management System. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Enterprise Property & Rental Solutions
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
