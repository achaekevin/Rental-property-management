import React, { useState, useEffect } from 'react';
import { CssBaseline, ThemeProvider, Box, CircularProgress, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PropertyManagement from './components/PropertyManagement';
import TenantManagement from './components/TenantManagement';
import RentPayment from './components/RentPayment';
import MaintenanceRequests from './components/MaintenanceRequests';
import ReportsAnalytics from './components/ReportsAnalytics';
import Profile from './components/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import TenantPortal from './components/TenantPortal';
import TenantLogin from './components/TenantLogin';
import TenantRegister from './components/TenantRegister';
import TenantResetPassword from './components/TenantResetPassword';
import AdminRoute from './components/AdminRoute';
import { auth } from './firebase';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import Chatbot from './components/Chatbot';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';

function AppContent() {
  const { darkMode } = useDarkMode();

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const authToken = localStorage.getItem('token') || localStorage.getItem('tenantToken');
        const role = localStorage.getItem('userRole');

        if (authToken && role) {
          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          setIsAuthenticated(false);
          setUserRole('');
        }
        setLoading(false);
      })
      .catch((error) => {
        const authToken = localStorage.getItem('token') || localStorage.getItem('tenantToken');
        const role = localStorage.getItem('userRole');
        if (authToken && role) {
          setIsAuthenticated(true);
          setUserRole(role);
        } else {
          setIsAuthenticated(false);
          setUserRole('');
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/tenant/login" />} />

            <Route path="/tenant/login" element={<TenantLogin />} />
            <Route path="/tenant/register" element={<TenantRegister />} />
            <Route path="/tenant/reset-password" element={<TenantResetPassword />} />

            <Route
              path="/tenant/*"
              element={
                <>
                  <TenantPortal />
                  {isAuthenticated && <Chatbot />}
                </>
              }
            />

            <Route
              path="/dashboard"
              element={
                <AdminRoute userRole={userRole}>
                  <Dashboard />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
            <Route
              path="/properties"
              element={
                <AdminRoute userRole={userRole}>
                  <PropertyManagement />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
            <Route
              path="/tenants"
              element={
                <AdminRoute userRole={userRole}>
                  <TenantManagement />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <AdminRoute userRole={userRole}>
                  <RentPayment />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
            <Route
              path="/maintenance"
              element={
                <AdminRoute userRole={userRole}>
                  <MaintenanceRequests />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <AdminRoute userRole={userRole}>
                  <ReportsAnalytics />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <AdminRoute userRole={userRole}>
                  <Profile />
                  {isAuthenticated && <Chatbot />}
                </AdminRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

const App = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DarkModeProvider>
  );
};

export default App;