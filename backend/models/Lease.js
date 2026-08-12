const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lease = sequelize.define('Lease', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  rentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  depositAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  paymentFrequency: {
    type: DataTypes.STRING,
    defaultValue: 'Monthly'
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'TERMINATED', 'RENEWED'),
    defaultValue: 'ACTIVE'
  },
  documents: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true
});

module.exports = Lease;
