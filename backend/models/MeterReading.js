const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MeterReading = sequelize.define('MeterReading', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  meterId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  readingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  readingValue: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  previousValue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  consumption: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  recordedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'meter_readings',
  timestamps: true
});

module.exports = MeterReading;
