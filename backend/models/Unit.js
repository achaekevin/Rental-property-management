const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unit = sequelize.define('Unit', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  floorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  unitTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  unitNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'Apartment'
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  sizeSqft: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  rentAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  depositAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE'),
    defaultValue: 'AVAILABLE'
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'units',
  timestamps: true
});

module.exports = Unit;
