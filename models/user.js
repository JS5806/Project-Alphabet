const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // 사용자의 현재 위치 등은 보통 Request로 받지만, 기본 거주지 등이 있을 수 있음
  default_lat: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  default_lng: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = User;