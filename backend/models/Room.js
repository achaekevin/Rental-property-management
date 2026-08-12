const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dimensions: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  tableName: 'rooms',
  timestamps: true
});

module.exports = Room;
