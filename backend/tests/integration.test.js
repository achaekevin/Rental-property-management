const assert = require('assert');
const test = require('node:test');

test('Backend Architecture & Model Registry Verification', async (t) => {
  await t.test('Models import and schema initialization', () => {
    const {
      User, Property, Unit, Tenant, Lease, Invoice, Payment,
      Expense, Maintenance, Organization, Role, Permission, sequelize
    } = require('../models');

    assert.ok(sequelize, 'Sequelize instance should be defined');
    assert.ok(User, 'User model should be defined');
    assert.ok(Property, 'Property model should be defined');
    assert.ok(Unit, 'Unit model should be defined');
    assert.ok(Tenant, 'Tenant model should be defined');
    assert.ok(Lease, 'Lease model should be defined');
    assert.ok(Invoice, 'Invoice model should be defined');
    assert.ok(Payment, 'Payment model should be defined');
    assert.ok(Expense, 'Expense model should be defined');
    assert.ok(Maintenance, 'Maintenance model should be defined');
    assert.ok(Organization, 'Organization model should be defined');
    assert.ok(Role, 'Role model should be defined');
    assert.ok(Permission, 'Permission model should be defined');
  });

  await t.test('Auth service structure', () => {
    const authService = require('../services/auth.service');
    assert.ok(authService.register);
    assert.ok(authService.login);
    assert.ok(authService.getCurrentUser);
  });

  await t.test('Property service structure', () => {
    const propertyService = require('../services/property.service');
    assert.ok(propertyService.getAllProperties);
    assert.ok(propertyService.getPropertyById);
    assert.ok(propertyService.createProperty);
  });

  await t.test('Payment service structure', () => {
    const paymentService = require('../services/payment.service');
    assert.ok(paymentService.getAllPayments);
    assert.ok(paymentService.createPayment);
    assert.ok(paymentService.handleMpesaStkPush);
  });
});
