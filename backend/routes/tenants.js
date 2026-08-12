const express = require('express');
const router = express.Router();
const { Tenant, Property, Unit } = require('../models');
const { verifyToken, requirePermission, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(enforceResourceAccess('tenants'));

router.get('/', requirePermission('tenant.view'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'PROPERTY_MANAGER' && req.user.organizationId) {
      where.organizationId = req.user.organizationId;
    } else if (req.user.role === 'TENANT') {
      where.userId = req.user.id;
    }

    const tenants = await Tenant.findAll({
      where,
      include: [
        { model: Property, as: 'property', attributes: ['id', 'name'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] }
      ]
    });
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', requirePermission('tenant.view'), async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });

    if (req.user.role === 'TENANT' && tenant.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access to another tenant profile is prohibited.' });
    }

    res.json({ success: true, data: tenant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requirePermission('tenant.create'), async (req, res) => {
  try {
    if (req.user.role === 'PROPERTY_MANAGER') {
      req.body.organizationId = req.user.organizationId;
    }
    const tenant = await Tenant.create(req.body);
    res.status(201).json({ success: true, message: 'Tenant registered successfully', data: tenant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', requirePermission('tenant.update'), async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found' });

    if (req.user.role === 'TENANT' && tenant.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access to another tenant profile is prohibited.' });
    }

    await tenant.update(req.body);
    res.json({ success: true, message: 'Tenant updated successfully', data: tenant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
