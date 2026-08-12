const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  propertyTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  zipCode: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'Kenya'
  },
  units: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  occupiedUnits: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rentAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('Vacant', 'Occupied', 'UnderMaintenance', 'Active', 'Inactive'),
    defaultValue: 'Active'
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'properties',
  timestamps: true
});

module.exports = Property;
