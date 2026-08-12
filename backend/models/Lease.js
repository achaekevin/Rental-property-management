const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lease = sequelize.define('Lease', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true
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
  leaseNumber: {
    type: DataTypes.STRING,
    allowNull: true
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
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  depositAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  paymentFrequency: {
    type: DataTypes.STRING,
    defaultValue: 'Monthly'
  },
  dueDay: {
    type: DataTypes.INTEGER,
    defaultValue: 1
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
  tableName: 'leases',
  timestamps: true
});

module.exports = Lease;
