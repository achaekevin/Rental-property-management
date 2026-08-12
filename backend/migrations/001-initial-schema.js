'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Organizations
    await queryInterface.createTable('organizations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: true },
      phone: { type: Sequelize.STRING, defaultValue: '' },
      address: { type: Sequelize.STRING, defaultValue: '' },
      taxId: { type: Sequelize.STRING, defaultValue: '' },
      logo: { type: Sequelize.STRING, defaultValue: '' },
      status: { type: Sequelize.ENUM('Active', 'Inactive', 'Suspended'), defaultValue: 'Active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 2. Roles
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING, defaultValue: '' },
      isSystem: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 3. Permissions
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      module: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING, defaultValue: '' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 4. Role Permissions
    await queryInterface.createTable('role_permissions', {
      roleId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'roles', key: 'id' }, onDelete: 'CASCADE' },
      permissionId: { type: Sequelize.INTEGER, primaryKey: true, references: { model: 'permissions', key: 'id' }, onDelete: 'CASCADE' }
    });

    // 5. Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: {
        type: Sequelize.ENUM('SuperAdmin', 'Admin', 'PropertyManager', 'Landlord', 'Tenant', 'Accountant', 'MaintenanceStaff', 'Staff'),
        defaultValue: 'Tenant'
      },
      phone: { type: Sequelize.STRING, defaultValue: '' },
      avatar: { type: Sequelize.STRING, defaultValue: '' },
      status: { type: Sequelize.ENUM('Active', 'Inactive', 'Suspended'), defaultValue: 'Active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 6. Properties
    await queryInterface.createTable('properties', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      propertyTypeId: { type: Sequelize.INTEGER, allowNull: true },
      name: { type: Sequelize.STRING, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.STRING, allowNull: false },
      city: { type: Sequelize.STRING, defaultValue: '' },
      state: { type: Sequelize.STRING, defaultValue: '' },
      zipCode: { type: Sequelize.STRING, defaultValue: '' },
      country: { type: Sequelize.STRING, defaultValue: 'Kenya' },
      units: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      occupiedUnits: { type: Sequelize.INTEGER, defaultValue: 0 },
      rentAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      amenities: { type: Sequelize.JSON, defaultValue: '[]' },
      status: { type: Sequelize.ENUM('Vacant', 'Occupied', 'UnderMaintenance', 'Active', 'Inactive'), defaultValue: 'Active' },
      photos: { type: Sequelize.JSON, defaultValue: '[]' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 7. Buildings
    await queryInterface.createTable('buildings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      propertyId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'properties', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      floorsCount: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 8. Floors
    await queryInterface.createTable('floors', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      buildingId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'buildings', key: 'id' }, onDelete: 'CASCADE' },
      floorNumber: { type: Sequelize.INTEGER, allowNull: false },
      name: { type: Sequelize.STRING, defaultValue: '' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 9. Units
    await queryInterface.createTable('units', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      propertyId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'properties', key: 'id' }, onDelete: 'CASCADE' },
      buildingId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'buildings', key: 'id' }, onDelete: 'SET NULL' },
      floorId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'floors', key: 'id' }, onDelete: 'SET NULL' },
      unitTypeId: { type: Sequelize.INTEGER, allowNull: true },
      unitNumber: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.STRING, defaultValue: 'Apartment' },
      bedrooms: { type: Sequelize.INTEGER, defaultValue: 1 },
      bathrooms: { type: Sequelize.INTEGER, defaultValue: 1 },
      sizeSqft: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.00 },
      rentAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      depositAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      status: { type: Sequelize.ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE'), defaultValue: 'AVAILABLE' },
      amenities: { type: Sequelize.JSON, defaultValue: '[]' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 10. Landlords
    await queryInterface.createTable('landlords', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      userId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, defaultValue: '' },
      taxId: { type: Sequelize.STRING, defaultValue: '' },
      address: { type: Sequelize.STRING, defaultValue: '' },
      bankDetails: { type: Sequelize.JSON, defaultValue: '{}' },
      status: { type: Sequelize.ENUM('Active', 'Inactive'), defaultValue: 'Active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 11. Tenants
    await queryInterface.createTable('tenants', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      userId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, defaultValue: '' },
      nationalId: { type: Sequelize.STRING, defaultValue: '' },
      idType: { type: Sequelize.STRING, defaultValue: 'National ID' },
      propertyId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'properties', key: 'id' }, onDelete: 'SET NULL' },
      unitId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'SET NULL' },
      leaseStart: { type: Sequelize.DATE, allowNull: true },
      leaseEnd: { type: Sequelize.DATE, allowNull: true },
      rentAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      depositAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      emergencyContact: { type: Sequelize.JSON, defaultValue: '{}' },
      status: { type: Sequelize.ENUM('Active', 'Inactive', 'Pending', 'Archived'), defaultValue: 'Active' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 12. Leases
    await queryInterface.createTable('leases', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      tenantId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      propertyId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'properties', key: 'id' }, onDelete: 'CASCADE' },
      unitId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'units', key: 'id' }, onDelete: 'CASCADE' },
      leaseNumber: { type: Sequelize.STRING, allowNull: true },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE, allowNull: false },
      rentAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      depositAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      paymentFrequency: { type: Sequelize.STRING, defaultValue: 'Monthly' },
      dueDay: { type: Sequelize.INTEGER, defaultValue: 1 },
      status: { type: Sequelize.ENUM('DRAFT', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'TERMINATED', 'RENEWED'), defaultValue: 'ACTIVE' },
      documents: { type: Sequelize.JSON, defaultValue: '[]' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 13. Invoices
    await queryInterface.createTable('invoices', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      propertyId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'properties', key: 'id' }, onDelete: 'SET NULL' },
      unitId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'SET NULL' },
      leaseId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'leases', key: 'id' }, onDelete: 'SET NULL' },
      tenantId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'tenants', key: 'id' }, onDelete: 'CASCADE' },
      invoiceNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      issueDate: { type: Sequelize.DATEONLY, allowNull: false },
      dueDate: { type: Sequelize.DATEONLY, allowNull: false },
      subtotal: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      taxAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      totalAmount: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      paidAmount: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      balance: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.00 },
      status: { type: Sequelize.ENUM('DRAFT', 'UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'), defaultValue: 'UNPAID' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 14. Payments
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      tenantId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'tenants', key: 'id' }, onDelete: 'SET NULL' },
      propertyId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'properties', key: 'id' }, onDelete: 'SET NULL' },
      unitId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'SET NULL' },
      invoiceId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'invoices', key: 'id' }, onDelete: 'SET NULL' },
      paymentMethodId: { type: Sequelize.INTEGER, allowNull: true },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      paymentMethod: { type: Sequelize.ENUM('M-Pesa', 'ACH', 'Credit Card', 'Cash', 'Bank Transfer'), defaultValue: 'M-Pesa' },
      reference: { type: Sequelize.STRING, defaultValue: '' },
      checkoutRequestId: { type: Sequelize.STRING, defaultValue: '' },
      phoneNumber: { type: Sequelize.STRING, defaultValue: '' },
      invoiceNumber: { type: Sequelize.STRING, defaultValue: '' },
      status: { type: Sequelize.ENUM('SUCCESS', 'PENDING', 'FAILED', 'CANCELLED'), defaultValue: 'PENDING' },
      paidAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 15. Expenses
    await queryInterface.createTable('expenses', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      propertyId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'properties', key: 'id' }, onDelete: 'CASCADE' },
      unitId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'SET NULL' },
      categoryId: { type: Sequelize.INTEGER, allowNull: true },
      vendorId: { type: Sequelize.INTEGER, allowNull: true },
      category: { type: Sequelize.ENUM('Maintenance', 'Utilities', 'Insurance', 'Taxes', 'Repairs', 'Other'), allowNull: false },
      description: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      date: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      receiptUrl: { type: Sequelize.STRING, defaultValue: '' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 16. Maintenance
    await queryInterface.createTable('maintenance_requests', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      propertyId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'properties', key: 'id' }, onDelete: 'CASCADE' },
      unitId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'units', key: 'id' }, onDelete: 'SET NULL' },
      tenantId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'tenants', key: 'id' }, onDelete: 'SET NULL' },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      category: { type: Sequelize.ENUM('Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'), defaultValue: 'Plumbing' },
      priority: { type: Sequelize.ENUM('Low', 'Medium', 'High', 'Urgent'), defaultValue: 'Medium' },
      status: { type: Sequelize.ENUM('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'), defaultValue: 'OPEN' },
      assignedTo: { type: Sequelize.STRING, defaultValue: '' },
      cost: { type: Sequelize.DECIMAL(12, 2), defaultValue: 0.00 },
      photos: { type: Sequelize.JSON, defaultValue: '[]' },
      completionDate: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 17. Notifications
    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      userId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      title: { type: Sequelize.STRING, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      type: { type: Sequelize.ENUM('Payment', 'Maintenance', 'Lease', 'System', 'Alert'), defaultValue: 'System' },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });

    // 18. Audit Logs
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      organizationId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'organizations', key: 'id' }, onDelete: 'SET NULL' },
      userId: { type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      action: { type: Sequelize.STRING, allowNull: false },
      entity: { type: Sequelize.STRING, allowNull: false },
      entityId: { type: Sequelize.INTEGER, allowNull: true },
      oldValues: { type: Sequelize.JSON, allowNull: true },
      newValues: { type: Sequelize.JSON, allowNull: true },
      ipAddress: { type: Sequelize.STRING, defaultValue: '' },
      userAgent: { type: Sequelize.STRING, defaultValue: '' },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('maintenance_requests');
    await queryInterface.dropTable('expenses');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('invoices');
    await queryInterface.dropTable('leases');
    await queryInterface.dropTable('tenants');
    await queryInterface.dropTable('landlords');
    await queryInterface.dropTable('units');
    await queryInterface.dropTable('floors');
    await queryInterface.dropTable('buildings');
    await queryInterface.dropTable('properties');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('role_permissions');
    await queryInterface.dropTable('permissions');
    await queryInterface.dropTable('roles');
    await queryInterface.dropTable('organizations');
  }
};
