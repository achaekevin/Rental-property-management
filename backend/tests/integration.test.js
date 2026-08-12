const assert = require('assert');
const test = require('node:test');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

test('Backend Architecture & Security Authorization Verification', async (t) => {
  await t.test('Models import and schema initialization', () => {
    const {
      User, Property, Unit, Tenant, Lease, Invoice, Payment,
      Expense, Maintenance, Organization, Role, Permission, sequelize
    } = require('../models');

    assert.ok(sequelize, 'Sequelize instance should be defined');
    assert.ok(User, 'User model should be defined');
    assert.ok(Property, 'Property model should be defined');
    assert.ok(Tenant, 'Tenant model should be defined');
  });

  await t.test('Resource-Level Security Middleware - Tenant / Landlord Access Block to /api/users', async () => {
    const { enforceResourceAccess } = require('../middleware/auth');

    // Simulate TENANT attempting direct access to users module
    const reqTenant = { user: { id: 10, role: 'TENANT' } };
    const resTenant = {
      status(code) {
        assert.strictEqual(code, 403, 'Should reject TENANT access to users module with 403');
        return this;
      },
      json(data) {
        assert.strictEqual(data.success, false);
        assert.ok(data.message.includes('Forbidden'));
      }
    };

    const middleware = enforceResourceAccess('users');
    await middleware(reqTenant, resTenant, () => {
      assert.fail('Should not allow TENANT to access users module');
    });

    // Simulate LANDLORD attempting direct access to users module
    const reqLandlord = { user: { id: 20, role: 'LANDLORD' } };
    const resLandlord = {
      status(code) {
        assert.strictEqual(code, 403, 'Should reject LANDLORD access to users module with 403');
        return this;
      },
      json(data) {
        assert.strictEqual(data.success, false);
        assert.ok(data.message.includes('Forbidden'));
      }
    };

    await middleware(reqLandlord, resLandlord, () => {
      assert.fail('Should not allow LANDLORD to access users module');
    });
  });

  await t.test('Resource-Level Security Middleware - SUPER_ADMINISTRATOR Allowed Access', async () => {
    const { enforceResourceAccess } = require('../middleware/auth');

    const reqAdmin = { user: { id: 1, role: 'SUPER_ADMINISTRATOR' } };
    const resAdmin = {};

    let nextCalled = false;
    const middleware = enforceResourceAccess('users');
    await middleware(reqAdmin, resAdmin, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true, 'SUPER_ADMINISTRATOR should pass resource access check');
    assert.strictEqual(reqAdmin.resourceScope.isGlobal, true);
  });
});
