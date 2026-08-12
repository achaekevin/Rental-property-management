import React, { useState } from 'react';
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
  Button
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
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Receipt as InvoiceIcon,
  MonetizationOn as ExpenseIcon,
  Shield as ShieldIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const DRAWER_WIDTH = 260;

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    switch (userRole) {
      case 'SUPER_ADMINISTRATOR':
        return [
          { text: "Platform Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Tenants", path: "/tenants", icon: <TenantsIcon /> },
          { text: "Payments", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance", path: "/maintenance", icon: <MaintenanceIcon /> },
          { text: "Reports & Analytics", path: "/reports", icon: <ReportsIcon /> }
        ];
      case 'PROPERTY_MANAGER':
        return [
          { text: "Operations Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "Managed Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Tenants & Leases", path: "/tenants", icon: <TenantsIcon /> },
          { text: "Rent Payments", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Requests", path: "/maintenance", icon: <MaintenanceIcon /> },
          { text: "Financial Reports", path: "/reports", icon: <ReportsIcon /> }
        ];
      case 'LANDLORD':
        return [
          { text: "Investment Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "My Properties", path: "/properties", icon: <PropertiesIcon /> },
          { text: "Tenants Overview", path: "/tenants", icon: <TenantsIcon /> },
          { text: "Financial Records", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Log", path: "/maintenance", icon: <MaintenanceIcon /> },
          { text: "Income Reports", path: "/reports", icon: <ReportsIcon /> }
        ];
      case 'TENANT':
      default:
        return [
          { text: "Tenant Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "My Tenancy", path: "/properties", icon: <PropertiesIcon /> },
          { text: "M-Pesa Payments", path: "/payments", icon: <PaymentsIcon /> },
          { text: "Maintenance Tickets", path: "/maintenance", icon: <MaintenanceIcon /> }
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
          FEATURES MENU
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
      {/* Top Bar for Mobile Toggle */}
      {isMobile && (
        <AppBar position="sticky" sx={{ bgcolor: '#1a237e' }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>
              Renta Hive
            </Typography>
          </Toolbar>
        </AppBar>
      )}

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