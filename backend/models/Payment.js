const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('M-Pesa', 'ACH', 'Credit Card', 'Cash', 'Bank Transfer'),
    defaultValue: 'M-Pesa'
  },
  reference: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  checkoutRequestId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  phoneNumber: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  status: {
    type: DataTypes.ENUM('SUCCESS', 'PENDING', 'FAILED', 'CANCELLED'),
    defaultValue: 'PENDING'
  },
  paidAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Payment;
