const { Property, Unit, Tenant, Building, Floor } = require('../models');

class PropertyService {
  async getAllProperties(organizationId) {
    const where = organizationId ? { organizationId } : {};
    return await Property.findAll({
      where,
      include: [
        { model: Unit, as: 'unitList' },
        { model: Building, as: 'buildings' }
      ]
    });
  }

  async getPropertyById(id, organizationId) {
    const where = { id };
    if (organizationId) where.organizationId = organizationId;

    const property = await Property.findOne({
      where,
      include: [
        { model: Unit, as: 'unitList' },
        { model: Tenant, as: 'tenants' },
        { model: Building, as: 'buildings' }
      ]
    });
    if (!property) throw new Error('Property not found');
    return property;
  }

  async createProperty(data, organizationId) {
    if (organizationId) data.organizationId = organizationId;
    return await Property.create(data);
  }

  async updateProperty(id, data, organizationId) {
    const property = await this.getPropertyById(id, organizationId);
    return await property.update(data);
  }

  async deleteProperty(id, organizationId) {
    const property = await this.getPropertyById(id, organizationId);
    await property.destroy();
    return true;
  }
}

module.exports = new PropertyService();
