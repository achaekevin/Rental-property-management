const express = require('express');
const router = express.Router();
const { Unit, Property } = require('../models');
const { verifyToken } = require('../middleware/auth');

// GET /api/units
router.get('/', async (req, res) => {
  try {
    const { propertyId, status } = req.query;
    const where = {};
    if (propertyId) where.propertyId = propertyId;
    if (status) where.status = status;

    const units = await Unit.findAll({
      where,
      include: [{ model: Property, as: 'property', attributes: ['id', 'name', 'address'] }]
    });
    const result = units.map(u => {
      const data = u.toJSON();
      data._id = u.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/units
router.post('/', verifyToken, async (req, res) => {
  try {
    const unit = await Unit.create(req.body);
    const data = unit.toJSON();
    data._id = unit.id;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/units/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) return res.status(404).json({ message: 'Unit not found' });
    await unit.update(req.body);
    const data = unit.toJSON();
    data._id = unit.id;
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
