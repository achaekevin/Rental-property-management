const express = require('express');
const router = express.Router();
const { Tenant, Property } = require('../models');

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: [{ model: Property, as: 'property' }]
    });
    const result = tenants.map(t => {
      const data = t.toJSON();
      data._id = t.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new tenant
router.post('/', async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body);
    const data = tenant.toJSON();
    data._id = tenant.id;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single tenant
router.get('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    const data = tenant.toJSON();
    data._id = tenant.id;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update tenant
router.put('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    await tenant.update(req.body);
    const data = tenant.toJSON();
    data._id = tenant.id;
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete tenant
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    await tenant.destroy();
    res.json({ message: 'Tenant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
