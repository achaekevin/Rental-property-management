const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');

// Get all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find().populate('property');
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new tenant
router.post('/', async (req, res) => {
  const tenant = new Tenant(req.body);
  try {
    const savedTenant = await tenant.save();
    res.status(201).json(savedTenant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
