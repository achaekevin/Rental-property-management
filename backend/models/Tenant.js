const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  leaseStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  leaseEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  emergencyContact: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  timestamps: true
});

module.exports = Tenant;
