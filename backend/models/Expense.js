const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('Maintenance', 'Utilities', 'Insurance', 'Taxes', 'Repairs', 'Other'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  receiptUrl: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  timestamps: true
});

module.exports = Expense;
