const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const { verifyToken } = require('../middleware/auth');

// GET /api/maintenance
router.get('/', async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate('propertyId', 'name address')
      .populate('unitId', 'unitNumber')
      .populate('tenantId', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/maintenance
router.post('/', verifyToken, async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    const savedRequest = await maintenance.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/maintenance/:id (Update status workflow OPEN -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedRequest = await Maintenance.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    if (!updatedRequest) return res.status(404).json({ message: 'Maintenance request not found' });
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
