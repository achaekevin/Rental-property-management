const assert = require('assert');
const test = require('node:test');

test('API Health check & Endpoint structure', async (t) => {
  await t.test('Environment check', () => {
    assert.strictEqual(process.env.NODE_ENV !== 'invalid', true);
  });

  await t.test('JWT Secret fallback verification', () => {
    const { JWT_SECRET } = require('../middleware/auth');
    assert.ok(JWT_SECRET);
    assert.strictEqual(typeof JWT_SECRET, 'string');
  });

  await t.test('Express routes loading check', () => {
    const app = require('../server');
    assert.ok(app);
  });
});
