const express = require('express');
const router = express.Router();
const Lease = require('../models/Lease');
const Unit = require('../models/Unit');
const { verifyToken } = require('../middleware/auth');

// GET /api/leases
router.get('/', async (req, res) => {
  try {
    const leases = await Lease.find()
      .populate('tenantId', 'name email phone')
      .populate('propertyId', 'name address')
      .populate('unitId', 'unitNumber rentAmount');
    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/leases
router.post('/', verifyToken, async (req, res) => {
  try {
    const lease = new Lease(req.body);
    const savedLease = await lease.save();
    
    // Update Unit status to OCCUPIED
    if (req.body.unitId) {
      await Unit.findByIdAndUpdate(req.body.unitId, { status: 'OCCUPIED' });
    }

    res.status(201).json(savedLease);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/leases/:id/status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedLease = await Lease.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedLease) return res.status(404).json({ message: 'Lease not found' });

    if (status === 'TERMINATED' || status === 'EXPIRED') {
      await Unit.findByIdAndUpdate(updatedLease.unitId, { status: 'AVAILABLE' });
    }

    res.json(updatedLease);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
