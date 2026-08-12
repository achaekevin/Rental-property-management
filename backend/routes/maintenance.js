const express = require('express');
const router = express.Router();
const { Maintenance, Property, Unit, Tenant } = require('../models');
const { verifyToken } = require('../middleware/auth');

// GET /api/maintenance
router.get('/', async (req, res) => {
  try {
    const requests = await Maintenance.findAll({
      include: [
        { model: Property, as: 'property', attributes: ['id', 'name', 'address'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] },
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email'] }
      ]
    });
    const result = requests.map(r => {
      const data = r.toJSON();
      data._id = r.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/maintenance
router.post('/', verifyToken, async (req, res) => {
  try {
    const maintenance = await Maintenance.create(req.body);
    const data = maintenance.toJSON();
    data._id = maintenance.id;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/maintenance/:id (Update status workflow)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance request not found' });
    await maintenance.update(req.body);
    const data = maintenance.toJSON();
    data._id = maintenance.id;
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
