const propertyService = require('../services/property.service');

class PropertyController {
  async getAll(req, res) {
    try {
      const properties = await propertyService.getAllProperties(req.user?.organizationId);
      res.json({ success: true, count: properties.length, data: properties });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getById(req, res) {
    try {
      const property = await propertyService.getPropertyById(req.params.id, req.user?.organizationId);
      res.json({ success: true, data: property });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }

  async create(req, res) {
    try {
      const property = await propertyService.createProperty(req.body, req.user?.organizationId);
      res.status(201).json({ success: true, message: 'Property created successfully', data: property });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async update(req, res) {
    try {
      const property = await propertyService.updateProperty(req.params.id, req.body, req.user?.organizationId);
      res.json({ success: true, message: 'Property updated successfully', data: property });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async delete(req, res) {
    try {
      await propertyService.deleteProperty(req.params.id, req.user?.organizationId);
      res.json({ success: true, message: 'Property deleted successfully' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new PropertyController();
