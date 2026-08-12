const express = require('express');
const router = express.Router();
const { Unit } = require('../models');
const { verifyToken, requirePermission, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(enforceResourceAccess('units'));

router.get('/', requirePermission('unit.view'), async (req, res) => {
  try {
    const { propertyId } = req.query;
    const where = propertyId ? { propertyId } : {};
    const units = await Unit.findAll({ where });
    res.json({ success: true, count: units.length, data: units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requirePermission('unit.create'), async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    res.status(201).json({ success: true, message: 'Unit created successfully', data: unit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', requirePermission('unit.update'), async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });
    await unit.update(req.body);
    res.json({ success: true, message: 'Unit updated successfully', data: unit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', requirePermission('unit.delete'), async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ success: false, message: 'Unit not found' });
    await unit.destroy();
    res.json({ success: true, message: 'Unit deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
