const sequelize = require('../config/database');

const Organization = require('./Organization');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const Landlord = require('./Landlord');
const Tenant = require('./Tenant');
const Property = require('./Property');
const Building = require('./Building');
const Floor = require('./Floor');
const Unit = require('./Unit');
const Room = require('./Room');
const Lease = require('./Lease');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const Payment = require('./Payment');
const PaymentAllocation = require('./PaymentAllocation');
const MpesaTransaction = require('./MpesaTransaction');
const Vendor = require('./Vendor');
const Expense = require('./Expense');
const Maintenance = require('./Maintenance');
const Meter = require('./Meter');
const MeterReading = require('./MeterReading');
const UtilityBill = require('./UtilityBill');
const Inspection = require('./Inspection');
const InspectionItem = require('./InspectionItem');
const Document = require('./Document');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');

// --- Organization Associations ---
Organization.hasMany(User, { foreignKey: 'organizationId', as: 'users' });
User.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Property, { foreignKey: 'organizationId', as: 'properties' });
Property.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Landlord, { foreignKey: 'organizationId', as: 'landlords' });
Landlord.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Tenant, { foreignKey: 'organizationId', as: 'tenants' });
Tenant.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Lease, { foreignKey: 'organizationId', as: 'leases' });
Lease.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Invoice, { foreignKey: 'organizationId', as: 'invoices' });
Invoice.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Payment, { foreignKey: 'organizationId', as: 'payments' });
Payment.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Expense, { foreignKey: 'organizationId', as: 'expenses' });
Expense.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Organization.hasMany(Maintenance, { foreignKey: 'organizationId', as: 'maintenanceRequests' });
Maintenance.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

// --- Role & Permission Associations ---
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId', otherKey: 'permissionId', as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId', otherKey: 'roleId', as: 'roles' });

// --- Property, Building, Floor, Unit, Room Associations ---
Property.hasMany(Building, { foreignKey: 'propertyId', as: 'buildings', onDelete: 'CASCADE' });
Building.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Building.hasMany(Floor, { foreignKey: 'buildingId', as: 'floors', onDelete: 'CASCADE' });
Floor.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });

Property.hasMany(Unit, { foreignKey: 'propertyId', as: 'unitList', onDelete: 'CASCADE' });
Unit.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Unit.belongsTo(Building, { foreignKey: 'buildingId', as: 'building' });
Unit.belongsTo(Floor, { foreignKey: 'floorId', as: 'floor' });

Unit.hasMany(Room, { foreignKey: 'unitId', as: 'rooms', onDelete: 'CASCADE' });
Room.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

// --- Landlord & Tenant Property/Unit Associations ---
Property.hasMany(Tenant, { foreignKey: 'propertyId', as: 'tenants', onDelete: 'SET NULL' });
Tenant.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

Unit.hasMany(Tenant, { foreignKey: 'unitId', as: 'unitTenants', onDelete: 'SET NULL' });
Tenant.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

// --- Lease & Financial Associations ---
Tenant.hasMany(Lease, { foreignKey: 'tenantId', as: 'leases', onDelete: 'CASCADE' });
Lease.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Lease.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Lease.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

Lease.hasMany(Invoice, { foreignKey: 'leaseId', as: 'invoices', onDelete: 'SET NULL' });
Invoice.belongsTo(Lease, { foreignKey: 'leaseId', as: 'lease' });
Tenant.hasMany(Invoice, { foreignKey: 'tenantId', as: 'invoices', onDelete: 'CASCADE' });
Invoice.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Invoice.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Invoice.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

// --- Payment & Allocation Associations ---
Tenant.hasMany(Payment, { foreignKey: 'tenantId', as: 'payments', onDelete: 'SET NULL' });
Payment.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
Payment.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Payment.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Payment.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

Payment.hasMany(PaymentAllocation, { foreignKey: 'paymentId', as: 'allocations', onDelete: 'CASCADE' });
PaymentAllocation.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });
Invoice.hasMany(PaymentAllocation, { foreignKey: 'invoiceId', as: 'allocations' });
PaymentAllocation.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

Payment.hasMany(MpesaTransaction, { foreignKey: 'paymentId', as: 'mpesaTransactions' });
MpesaTransaction.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

// --- Expense & Vendor Associations ---
Property.hasMany(Expense, { foreignKey: 'propertyId', as: 'expenses', onDelete: 'CASCADE' });
Expense.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Expense.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Vendor.hasMany(Expense, { foreignKey: 'vendorId', as: 'expenses' });
Expense.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

// --- Maintenance Associations ---
Property.hasMany(Maintenance, { foreignKey: 'propertyId', as: 'maintenanceRequests', onDelete: 'CASCADE' });
Maintenance.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Maintenance.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Maintenance.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

// --- Utility & Meter Associations ---
Property.hasMany(Meter, { foreignKey: 'propertyId', as: 'meters', onDelete: 'CASCADE' });
Meter.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Meter.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Meter.hasMany(MeterReading, { foreignKey: 'meterId', as: 'readings', onDelete: 'CASCADE' });
MeterReading.belongsTo(Meter, { foreignKey: 'meterId', as: 'meter' });

// --- Inspection & Document Associations ---
Property.hasMany(Inspection, { foreignKey: 'propertyId', as: 'inspections' });
Inspection.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });
Inspection.hasMany(InspectionItem, { foreignKey: 'inspectionId', as: 'items', onDelete: 'CASCADE' });
InspectionItem.belongsTo(Inspection, { foreignKey: 'inspectionId', as: 'inspection' });

// --- Notification & Audit Associations ---
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });

module.exports = {
  sequelize,
  Organization,
  User,
  Role,
  Permission,
  RolePermission,
  Landlord,
  Tenant,
  Property,
  Building,
  Floor,
  Unit,
  Room,
  Lease,
  Invoice,
  InvoiceItem,
  Payment,
  PaymentAllocation,
  MpesaTransaction,
  Vendor,
  Expense,
  Maintenance,
  Meter,
  MeterReading,
  UtilityBill,
  Inspection,
  InspectionItem,
  Document,
  Notification,
  AuditLog
};
