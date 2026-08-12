const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
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
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('Vacant', 'Occupied'),
    defaultValue: 'Vacant'
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true
});

module.exports = Property;
