const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cosmetic = sequelize.define('Cosmetic', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: DataTypes.STRING,
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  opened_at: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'cosmetics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Cosmetic;