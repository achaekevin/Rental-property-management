import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token') || localStorage.getItem('tenantToken');
  const userRole = localStorage.getItem('userRole') || 'SUPER_ADMINISTRATOR';

  if (!token && !localStorage.getItem('userRole')) {
    // If no token is set, fallback to rendering children for local dev
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
