const express = require('express');
const router = express.Router();
const { Lease, Tenant, Property, Unit } = require('../models');
const { verifyToken, requirePermission, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(enforceResourceAccess('leases'));

router.get('/', requirePermission('lease.view'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'PROPERTY_MANAGER' && req.user.organizationId) {
      where.organizationId = req.user.organizationId;
    }

    const leases = await Lease.findAll({
      where,
      include: [
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email'] },
        { model: Property, as: 'property', attributes: ['id', 'name'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] }
      ]
    });
    res.json({ success: true, count: leases.length, data: leases });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requirePermission('lease.create'), async (req, res) => {
  try {
    if (req.user.role === 'PROPERTY_MANAGER') {
      req.body.organizationId = req.user.organizationId;
    }
    const lease = await Lease.create(req.body);
    res.status(201).json({ success: true, message: 'Lease agreement created successfully', data: lease });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', requirePermission('lease.update'), async (req, res) => {
  try {
    const lease = await Lease.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ success: false, message: 'Lease not found' });
    await lease.update(req.body);
    res.json({ success: true, message: 'Lease updated successfully', data: lease });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/:id/renew', requirePermission('lease.renew'), async (req, res) => {
  try {
    const lease = await Lease.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ success: false, message: 'Lease not found' });
    const { newEndDate, newRentAmount } = req.body;
    await lease.update({
      endDate: newEndDate || lease.endDate,
      rentAmount: newRentAmount || lease.rentAmount,
      status: 'RENEWED'
    });
    res.json({ success: true, message: 'Lease renewed successfully', data: lease });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/:id/terminate', requirePermission('lease.terminate'), async (req, res) => {
  try {
    const lease = await Lease.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ success: false, message: 'Lease not found' });
    await lease.update({ status: 'TERMINATED' });
    res.json({ success: true, message: 'Lease terminated successfully', data: lease });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
