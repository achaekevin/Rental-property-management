const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Building = sequelize.define('Building', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  floorsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'buildings',
  timestamps: true
});

module.exports = Building;
