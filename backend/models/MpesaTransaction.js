const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MpesaTransaction = sequelize.define('MpesaTransaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  paymentId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  merchantRequestId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  checkoutRequestId: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  resultCode: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  resultDesc: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  mpesaReceiptNumber: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0.00
  },
  phoneNumber: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  transactionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  rawResponse: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'mpesa_transactions',
  timestamps: true
});

module.exports = MpesaTransaction;
