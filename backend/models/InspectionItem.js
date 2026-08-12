const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InspectionItem = sequelize.define('InspectionItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  inspectionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED'),
    defaultValue: 'GOOD'
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'inspection_items',
  timestamps: true
});

module.exports = InspectionItem;
