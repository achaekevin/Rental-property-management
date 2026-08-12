const sequelize = require('../config/database');
const User = require('./User');
const Property = require('./Property');
const Unit = require('./Unit');
const Tenant = require('./Tenant');
const Lease = require('./Lease');
const Payment = require('./Payment');
const Expense = require('./Expense');
const Maintenance = require('./Maintenance');
const Notification = require('./Notification');

// Property & Unit
Property.hasMany(Unit, { foreignKey: 'propertyId', as: 'unitList', onDelete: 'CASCADE' });
Unit.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Property & Tenant
Property.hasMany(Tenant, { foreignKey: 'propertyId', as: 'tenants', onDelete: 'SET NULL' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// Lease Associations
Tenant.hasMany(Lease, { foreignKey: 'tenantId', as: 'leases', onDelete: 'CASCADE' });
Lease.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Lease.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Lease.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

// Payment Associations
Payment.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Payment.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Payment.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

// Expense Associations
Expense.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Expense.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

// Maintenance Associations
Maintenance.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Maintenance.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Maintenance.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// Notification Associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Property,
  Unit,
  Tenant,
  Lease,
  Payment,
  Expense,
  Maintenance,
  Notification
};
