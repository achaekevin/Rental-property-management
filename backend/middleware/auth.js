const jwt = require('jsonwebtoken');
const { Tenant, Landlord } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'rental_property_secret_jwt_key_2026';

// Central Permission Matrix Mapping for the 4 Core Roles
const ROLE_PERMISSIONS = {
  SUPER_ADMINISTRATOR: [
    'user.view', 'user.create', 'user.update', 'user.delete',
    'role.view', 'role.create', 'role.update', 'role.delete',
    'system.settings.view', 'system.settings.update', 'audit.view',
    'property.view', 'property.create', 'property.update', 'property.delete',
    'unit.view', 'unit.create', 'unit.update', 'unit.delete',
    'tenant.view', 'tenant.create', 'tenant.update',
    'lease.view', 'lease.create', 'lease.update', 'lease.renew', 'lease.terminate',
    'invoice.view', 'invoice.create', 'invoice.update',
    'payment.view', 'payment.create', 'payment.refund',
    'expense.view', 'expense.create', 'expense.update',
    'maintenance.view', 'maintenance.create', 'maintenance.assign', 'maintenance.update', 'maintenance.complete',
    'report.view', 'report.financial', 'report.occupancy'
  ],
  PROPERTY_MANAGER: [
    'property.view', 'property.create', 'property.update', 'property.delete',
    'unit.view', 'unit.create', 'unit.update', 'unit.delete',
    'tenant.view', 'tenant.create', 'tenant.update',
    'lease.view', 'lease.create', 'lease.update', 'lease.renew', 'lease.terminate',
    'invoice.view', 'invoice.create', 'invoice.update',
    'payment.view', 'payment.create',
    'expense.view', 'expense.create', 'expense.update',
    'maintenance.view', 'maintenance.create', 'maintenance.assign', 'maintenance.update', 'maintenance.complete',
    'report.view', 'report.financial', 'report.occupancy',
    'user.view', 'user.create', 'user.update'
  ],
  LANDLORD: [
    'property.view',
    'unit.view',
    'tenant.view',
    'lease.view',
    'maintenance.view',
    'expense.view',
    'payment.view',
    'report.view', 'report.financial', 'report.occupancy'
  ],
  TENANT: [
    'tenant.view', 'tenant.update',
    'lease.view',
    'invoice.view',
    'payment.view', 'payment.create',
    'maintenance.view', 'maintenance.create', 'maintenance.update'
  ]
};

// 1. JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failure: Authorization token required'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failure: Invalid or expired token'
    });
  }
};

// 2. Role-Based Authorization Helper
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'Anonymous'}' is not authorized to perform this action.`
      });
    }
    next();
  };
};

// 3. Granular Permission Middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'TENANT';
    const allowedPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (!allowedPermissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${userRole}' lacks permission '${permission}' required for this action.`
      });
    }
    next();
  };
};

// 4. Resource-Level Data Isolation Scoping Middleware
const enforceResourceAccess = (moduleName) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthenticated user' });
      }

      req.resourceScope = {};

      if (user.role === 'SUPER_ADMINISTRATOR') {
        req.resourceScope = { isGlobal: true };
        return next();
      }

      if (user.role === 'PROPERTY_MANAGER') {
        req.resourceScope = { organizationId: user.organizationId || null };
        return next();
      }

      if (user.role === 'LANDLORD') {
        if (['users', 'organizations', 'roles'].includes(moduleName)) {
          return res.status(403).json({
            success: false,
            message: `Forbidden: Landlords are strictly prohibited from accessing administrative module '${moduleName}'.`
          });
        }
        let landlordId = null;
        try {
          const landlord = await Landlord.findOne({ where: { userId: user.id } });
          if (landlord) landlordId = landlord.id;
        } catch (e) {}
        req.resourceScope = { landlordId, userId: user.id };
        return next();
      }

      if (user.role === 'TENANT') {
        if (['users', 'organizations', 'roles', 'landlords'].includes(moduleName)) {
          return res.status(403).json({
            success: false,
            message: `Forbidden: Tenants are strictly prohibited from accessing administrative module '${moduleName}'.`
          });
        }
        let tenantId = null;
        try {
          const tenant = await Tenant.findOne({ where: { userId: user.id } });
          if (tenant) tenantId = tenant.id;
        } catch (e) {}
        req.resourceScope = { tenantId, userId: user.id };
        return next();
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'Authorization error: ' + err.message });
    }
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
  requirePermission,
  enforceResourceAccess,
  ROLE_PERMISSIONS,
  JWT_SECRET
};
