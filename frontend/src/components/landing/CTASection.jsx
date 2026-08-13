import React from 'react';
import { Box, Container, Typography, Button, Stack, Paper, useTheme } from '@mui/material';
import { ArrowForward as ArrowForwardIcon, Login as LoginIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 4,
            textAlign: 'center',
            backgroundColor: isDark ? 'rgba(25, 118, 210, 0.12)' : 'rgba(25, 118, 210, 0.05)',
            border: `1px solid ${isDark ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.2)'}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Ready to manage your properties more simply?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '1rem', sm: '1.15rem' }, mb: 4, lineHeight: 1.6 }}
            >
              Join property managers, landlords, and tenants who rely on Renta for organized property operations and payment tracking.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/tenant/register')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                  boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                }}
              >
                Sign Up
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/tenant/login')}
                startIcon={<LoginIcon />}
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                  color: theme.palette.text.primary,
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                }}
              >
                Sign In to System
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CTASection;
