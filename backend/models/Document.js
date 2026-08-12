const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  fileSize: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'documents',
  timestamps: true
});

module.exports = Document;
