const express = require('express');
const router = express.Router();
const { Property, Unit } = require('../models');

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: [{ model: Unit, as: 'unitList' }]
    });
    const result = properties.map(p => {
      const data = p.toJSON();
      data._id = p.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new property
router.post('/', async (req, res) => {
  try {
    const property = await Property.create(req.body);
    const data = property.toJSON();
    data._id = property.id;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{ model: Unit, as: 'unitList' }]
    });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const data = property.toJSON();
    data._id = property.id;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update property
router.put('/:id', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await property.update(req.body);
    const data = property.toJSON();
    data._id = property.id;
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await property.destroy();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
