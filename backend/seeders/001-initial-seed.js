'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Seed Default Organization
    const [orgId] = await queryInterface.bulkInsert('organizations', [{
      name: 'Default Property Management Org',
      email: 'admin@propertymanagement.com',
      phone: '0700000000',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: true });

    // 2. Seed System Roles
    await queryInterface.bulkInsert('roles', [
      { name: 'SuperAdmin', description: 'System Super Administrator', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'PropertyManager', description: 'Property Manager', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Landlord', description: 'Property Owner / Landlord', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tenant', description: 'Property Tenant', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Accountant', description: 'Financial Accountant', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'MaintenanceStaff', description: 'Maintenance Staff', isSystem: true, createdAt: new Date(), updatedAt: new Date() }
    ], { ignoreDuplicates: true });

    // 3. Seed Basic Permissions
    await queryInterface.bulkInsert('permissions', [
      { name: 'property.create', module: 'Properties', description: 'Create properties', createdAt: new Date(), updatedAt: new Date() },
      { name: 'property.read', module: 'Properties', description: 'View properties', createdAt: new Date(), updatedAt: new Date() },
      { name: 'property.update', module: 'Properties', description: 'Edit properties', createdAt: new Date(), updatedAt: new Date() },
      { name: 'property.delete', module: 'Properties', description: 'Delete properties', createdAt: new Date(), updatedAt: new Date() },
      { name: 'tenant.create', module: 'Tenants', description: 'Create tenants', createdAt: new Date(), updatedAt: new Date() },
      { name: 'tenant.read', module: 'Tenants', description: 'View tenants', createdAt: new Date(), updatedAt: new Date() },
      { name: 'lease.create', module: 'Leases', description: 'Create leases', createdAt: new Date(), updatedAt: new Date() },
      { name: 'payment.create', module: 'Payments', description: 'Record payments', createdAt: new Date(), updatedAt: new Date() },
      { name: 'maintenance.create', module: 'Maintenance', description: 'Create maintenance request', createdAt: new Date(), updatedAt: new Date() }
    ], { ignoreDuplicates: true });

    // 4. Seed Initial SuperAdmin User
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    await queryInterface.bulkInsert('users', [{
      organizationId: 1,
      name: 'System Admin',
      email: 'admin@propertymanagement.com',
      password: hashedPassword,
      role: 'SuperAdmin',
      phone: '0700000000',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('permissions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('organizations', null, {});
  }
};
