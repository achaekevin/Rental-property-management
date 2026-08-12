const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentAllocation = sequelize.define('PaymentAllocation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  allocatedAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  }
}, {
  tableName: 'payment_allocations',
  timestamps: true
});

module.exports = PaymentAllocation;
