const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');
const { verifyToken } = require('../middleware/auth');

// GET /api/units
router.get('/', async (req, res) => {
  try {
    const { propertyId, status } = req.query;
    const filter = {};
    if (propertyId) filter.propertyId = propertyId;
    if (status) filter.status = status;

    const units = await Unit.find(filter).populate('propertyId', 'name address');
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/units
router.post('/', verifyToken, async (req, res) => {
  try {
    const unit = new Unit(req.body);
    const savedUnit = await unit.save();
    res.status(201).json(savedUnit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/units/:id
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedUnit = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUnit) return res.status(404).json({ message: 'Unit not found' });
    res.json(updatedUnit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
