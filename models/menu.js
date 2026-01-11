const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Restaurant = require('./restaurant');

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// 관계 설정
Restaurant.hasMany(Menu, { foreignKey: 'restaurant_id' });
Menu.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

module.exports = Menu;