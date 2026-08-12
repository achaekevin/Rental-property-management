const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UtilityBill = sequelize.define('UtilityBill', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  meterReadingId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('UNPAID', 'PAID', 'OVERDUE', 'CANCELLED'),
    defaultValue: 'UNPAID'
  }
}, {
  tableName: 'utility_bills',
  timestamps: true
});

module.exports = UtilityBill;
