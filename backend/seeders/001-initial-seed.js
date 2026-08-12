'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Seed Default Organization
    await queryInterface.bulkInsert('organizations', [{
      name: 'Default Property Management Org',
      email: 'admin@propertymanagement.com',
      phone: '0700000000',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { ignoreDuplicates: true });

    // 2. Seed System Roles (The 4 Core Roles)
    await queryInterface.bulkInsert('roles', [
      { name: 'SUPER_ADMINISTRATOR', description: 'Platform-level control & administration', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'PROPERTY_MANAGER', description: 'Day-to-day property & operational manager', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'LANDLORD', description: 'Property Owner & investment performance monitor', isSystem: true, createdAt: new Date(), updatedAt: new Date() },
      { name: 'TENANT', description: 'Property tenant self-service portal', isSystem: true, createdAt: new Date(), updatedAt: new Date() }
    ], { ignoreDuplicates: true });

    // 3. Seed Permissions Matrix
    await queryInterface.bulkInsert('permissions', [
      { name: 'platform.manage', module: 'System', description: 'Platform level configuration', createdAt: new Date(), updatedAt: new Date() },
      { name: 'organization.manage', module: 'Organization', description: 'Manage organizations', createdAt: new Date(), updatedAt: new Date() },
      { name: 'user.manage', module: 'Users', description: 'Manage system users & roles', createdAt: new Date(), updatedAt: new Date() },
      { name: 'property.manage', module: 'Properties', description: 'Full property & unit management', createdAt: new Date(), updatedAt: new Date() },
      { name: 'property.view', module: 'Properties', description: 'View property details', createdAt: new Date(), updatedAt: new Date() },
      { name: 'tenant.manage', module: 'Tenants', description: 'Manage tenants & unit assignments', createdAt: new Date(), updatedAt: new Date() },
      { name: 'tenant.view', module: 'Tenants', description: 'View tenant details', createdAt: new Date(), updatedAt: new Date() },
      { name: 'lease.manage', module: 'Leases', description: 'Create, renew & terminate leases', createdAt: new Date(), updatedAt: new Date() },
      { name: 'invoice.manage', module: 'Invoices', description: 'Generate & edit invoices', createdAt: new Date(), updatedAt: new Date() },
      { name: 'payment.record', module: 'Payments', description: 'Record rent payments', createdAt: new Date(), updatedAt: new Date() },
      { name: 'payment.pay', module: 'Payments', description: 'Pay rent via M-Pesa / Gateway', createdAt: new Date(), updatedAt: new Date() },
      { name: 'maintenance.manage', module: 'Maintenance', description: 'Approve, assign & complete maintenance requests', createdAt: new Date(), updatedAt: new Date() },
      { name: 'maintenance.create', module: 'Maintenance', description: 'Submit maintenance requests', createdAt: new Date(), updatedAt: new Date() },
      { name: 'financials.view', module: 'Financials', description: 'View expected rent, net income & expenses', createdAt: new Date(), updatedAt: new Date() }
    ], { ignoreDuplicates: true });

    // 4. Seed Initial SuperAdministrator User
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    await queryInterface.bulkInsert('users', [{
      organizationId: 1,
      name: 'Super Administrator',
      email: 'admin@propertymanagement.com',
      password: hashedPassword,
      role: 'SUPER_ADMINISTRATOR',
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
