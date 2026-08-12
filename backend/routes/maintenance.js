const express = require('express');
const router = express.Router();
const { Maintenance, Property, Unit, Tenant } = require('../models');
const { verifyToken, requirePermission, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(enforceResourceAccess('maintenance'));

router.get('/', requirePermission('maintenance.view'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'PROPERTY_MANAGER' && req.user.organizationId) {
      where.organizationId = req.user.organizationId;
    }

    const requests = await Maintenance.findAll({
      where,
      include: [
        { model: Property, as: 'property', attributes: ['id', 'name'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] }
      ]
    });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requirePermission('maintenance.create'), async (req, res) => {
  try {
    if (req.user.role === 'PROPERTY_MANAGER') {
      req.body.organizationId = req.user.organizationId;
    }
    const request = await Maintenance.create(req.body);
    res.status(201).json({ success: true, message: 'Maintenance request submitted', data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id/assign', requirePermission('maintenance.assign'), async (req, res) => {
  try {
    const request = await Maintenance.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    const { assignedTo } = req.body;
    await request.update({ assignedTo, status: 'ASSIGNED' });
    res.json({ success: true, message: 'Maintenance task assigned successfully', data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', requirePermission('maintenance.update'), async (req, res) => {
  try {
    const request = await Maintenance.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    await request.update(req.body);
    res.json({ success: true, message: 'Maintenance request updated', data: request });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
