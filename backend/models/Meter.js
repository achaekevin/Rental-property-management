const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meter = sequelize.define('Meter', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  meterNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  utilityType: {
    type: DataTypes.ENUM('Water', 'Electricity', 'Gas', 'Trash', 'Internet'),
    defaultValue: 'Water'
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Faulty'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'meters',
  timestamps: true
});

module.exports = Meter;
