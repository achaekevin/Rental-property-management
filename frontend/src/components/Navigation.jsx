import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Home as PropertiesIcon,
  People as TenantsIcon,
  Payment as PaymentsIcon,
  Build as MaintenanceIcon,
  Assessment as ReportsIcon,
  ExitToApp as LogoutIcon,
  Shield as ShieldIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import api from '../services/api';

const DRAWER_WIDTH = 260;

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        setCurrentUser(res.data.user);
      }
    } catch (e) {
      console.log('Error fetching user profile info:', e);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenProfileMenu = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    localStorage.removeItem('token');
    localStorage.removeItem('tenantToken');
    localStorage.removeItem('userRole');
    navigate('/tenant/login', { replace: true });
  };

  // Role-tailored navigation items on the Left Sidebar
  const getNavItems = () => {
    const commonItems = [
      { text: "My Profile", path: "/profile", icon: <PersonIcon /> }
    ];

    switch (userRole) {
      case 'SUPER_ADMINISTRATOR':
        return [
          { text: "Platform Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "All Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Tenants Directory", path: "/tenants", icon: <TenantsIcon /> },
          { text: "Rental Applications", path: "/applications", icon: <ReportsIcon /> },
          { text: "Lease Management", path: "/leases", icon: <ReportsIcon /> },
          { text: "Rent Payments", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Log", path: "/maintenance", icon: <MaintenanceIcon /> },
          { text: "Reports & Analytics", path: "/reports", icon: <ReportsIcon /> },
          ...commonItems
        ];
      case 'PROPERTY_MANAGER':
        return [
          { text: "Operations Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "Managed Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Tenants Directory", path: "/tenants", icon: <TenantsIcon /> },
          { text: "Rental Applications", path: "/applications", icon: <ReportsIcon /> },
          { text: "Lease Management", path: "/leases", icon: <ReportsIcon /> },
          { text: "Rent Payments", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Requests", path: "/maintenance", icon: <MaintenanceIcon /> },
          { text: "Financial Reports", path: "/reports", icon: <ReportsIcon /> },
          ...commonItems
        ];
      case 'LANDLORD':
        return [
          { text: "Investment Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "My Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Tenants Overview", path: "/tenants", icon: <TenantsIcon /> },
          { text: "Rental Applications", path: "/applications", icon: <ReportsIcon /> },
          { text: "Lease Management", path: "/leases", icon: <ReportsIcon /> },
          { text: "Financial Records", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Log", path: "/maintenance", icon: <MaintenanceIcon /> },
          { text: "Income Reports", path: "/reports", icon: <ReportsIcon /> },
          ...commonItems
        ];
      case 'TENANT':
      default:
        return [
          { text: "Tenant Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "Available Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Rental Application", path: "/applications", icon: <ReportsIcon /> },
          { text: "My Lease Agreement", path: "/leases", icon: <ReportsIcon /> },
          { text: "Payments", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Tickets", path: "/maintenance", icon: <MaintenanceIcon /> },
          ...commonItems
        ];
    }
  };

  const navItems = getNavItems();

  const drawerContent = (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: "linear-gradient(180deg, #1a237e 0%, #121858 100%)",
        color: '#ffffff'
      }}
    >
      <Box>
        {/* Brand Logo & Header */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36, fontWeight: 700 }}>
            R
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: 0.5, lineHeight: 1.1 }}>
              Renta Hive
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Property Management
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />

        {/* User Role Badge */}
        <Box sx={{ px: 3, py: 2 }}>
          <Chip 
            icon={<ShieldIcon style={{ color: '#fff', fontSize: 16 }} />}
            label={userRole.replace('_', ' ')}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.75rem',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 1
            }}
          />
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 1 }} />

        {/* Vertical Feature Navigation Menu */}
        <Typography variant="caption" sx={{ px: 3, pt: 1, pb: 0.5, display: 'block', opacity: 0.6, fontWeight: 600, letterSpacing: 1 }}>
          NAVIGATION MENU
        </Typography>

        <List sx={{ px: 1.5 }}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  px: 2,
                  py: 1.2,
                  my: 0.5,
                  borderRadius: 2,
                  background: isActive ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
                  borderLeft: isActive ? '4px solid #ff4081' : '4px solid transparent',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.12)',
                    transform: 'translateX(3px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#ff4081' : 'inherit', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem'
                  }} 
                />
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer & Logout Button */}
      <Box sx={{ p: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1,
            borderRadius: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#fff',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Top Bar for Desktop Profile Header & Mobile Toggle */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: '#ffffff',
          color: '#1a237e',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={700} color="primary">
              Renta Property Portal
            </Typography>
          </Box>

          {/* Top Right User Profile Widget */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Tooltip title="View Profile & Credentials">
              <Box 
                onClick={handleOpenProfileMenu}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  cursor: 'pointer',
                  p: 0.8,
                  borderRadius: 3,
                  '&:hover': { bgcolor: 'rgba(26, 35, 126, 0.04)' }
                }}
              >
                <Avatar 
                  src={currentUser?.avatar || undefined}
                  sx={{ bgcolor: 'primary.main', width: 38, height: 38, fontWeight: 700 }}
                >
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </Avatar>

                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                  <Typography variant="subtitle2" fontWeight={700} color="text.primary" lineHeight={1.2}>
                    {currentUser?.name || 'User Profile'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {currentUser?.email || userRole}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleCloseProfileMenu}
              PaperProps={{
                elevation: 4,
                sx: { mt: 1.5, minWidth: 200, borderRadius: 2 }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {currentUser?.name || 'Signed In User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {currentUser?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem 
                onClick={() => {
                  handleCloseProfileMenu();
                  navigate('/profile');
                }}
              >
                <ListItemIcon><PersonIcon fontSize="small" color="primary" /></ListItemIcon>
                My Profile &amp; Credentials
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Vertical Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Left Sidebar Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: DRAWER_WIDTH, 
              boxSizing: 'border-box',
              borderRight: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;