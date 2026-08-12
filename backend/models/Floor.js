const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Floor = sequelize.define('Floor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  buildingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  floorNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  tableName: 'floors',
  timestamps: true
});

module.exports = Floor;
