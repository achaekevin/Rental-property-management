const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inspection = sequelize.define('Inspection', {
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
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  inspectionType: {
    type: DataTypes.ENUM('MOVE_IN', 'MOVE_OUT', 'ROUTINE', 'MAINTENANCE'),
    defaultValue: 'ROUTINE'
  },
  inspectionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  inspectorName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'SCHEDULED'
  }
}, {
  tableName: 'inspections',
  timestamps: true
});

module.exports = Inspection;
