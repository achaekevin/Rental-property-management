import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useScrollTrigger,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Brightness4,
  Brightness7,
  Apartment as ApartmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../context/DarkModeContext';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
  });

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 4 : 0}
      sx={{
        backgroundColor: trigger
          ? theme.palette.mode === 'dark'
            ? 'rgba(18, 18, 18, 0.92)'
            : 'rgba(255, 255, 255, 0.92)'
          : theme.palette.background.default,
        backdropFilter: trigger ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: `1px solid ${
          trigger
            ? theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.08)'
            : 'transparent'
        }`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              }}
            >
              <ApartmentIcon fontSize="medium" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: theme.palette.text.primary,
                fontSize: '1.35rem',
              }}
            >
              RENTA
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                sx={{
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  textTransform: 'none',
                  px: 1.5,
                  '&:hover': {
                    color: theme.palette.primary.main,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Actions: Theme Toggle, Login, Register */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              onClick={toggleDarkMode}
              color="inherit"
              aria-label="Toggle dark/light mode"
              sx={{ p: 1 }}
            >
              {darkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>

            <Button
              variant="text"
              onClick={() => navigate('/tenant/login')}
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                textTransform: 'none',
                display: { xs: 'none', sm: 'inline-flex' },
              }}
            >
              Log In
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate('/tenant/register')}
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                px: 2.5,
                py: 0.9,
                borderRadius: 2,
                boxShadow: `0 4px 14px ${theme.palette.primary.main}35`,
                '&:hover': {
                  boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
                },
              }}
            >
              Sign Up
            </Button>

            {/* Mobile Hamburger Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            px: 2,
            py: 3,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={800}>
            Navigation
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => handleNavClick(item.href)}>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setMobileOpen(false);
              navigate('/tenant/login');
            }}
            sx={{ fontWeight: 700, py: 1.2 }}
          >
            Log In
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setMobileOpen(false);
              navigate('/tenant/register');
            }}
            sx={{ fontWeight: 700, py: 1.2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
