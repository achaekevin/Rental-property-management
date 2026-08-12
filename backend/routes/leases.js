const express = require('express');
const router = express.Router();
const { Lease, Unit, Tenant, Property } = require('../models');
const { verifyToken } = require('../middleware/auth');

// GET /api/leases
router.get('/', async (req, res) => {
  try {
    const leases = await Lease.findAll({
      include: [
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Property, as: 'property', attributes: ['id', 'name', 'address'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber', 'rentAmount'] }
      ]
    });
    const result = leases.map(l => {
      const data = l.toJSON();
      data._id = l.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/leases
router.post('/', verifyToken, async (req, res) => {
  try {
    const lease = await Lease.create(req.body);
    
    // Update Unit status to OCCUPIED
    if (req.body.unitId) {
      const unit = await Unit.findByPk(req.body.unitId);
      if (unit) {
        await unit.update({ status: 'OCCUPIED' });
      }
    }

    const data = lease.toJSON();
    data._id = lease.id;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/leases/:id/status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const lease = await Lease.findByPk(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });

    await lease.update({ status });

    if (status === 'TERMINATED' || status === 'EXPIRED') {
      const unit = await Unit.findByPk(lease.unitId);
      if (unit) {
        await unit.update({ status: 'AVAILABLE' });
      }
    }

    const data = lease.toJSON();
    data._id = lease.id;
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
