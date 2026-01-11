const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const EatHistory = sequelize.define('EatHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  menu_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  eaten_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  // [Team Comment] 반영: 데이터 누적 시 조회 속도 저하 방지를 위한 복합 인덱스
  indexes: [
    {
      name: 'idx_user_date',
      fields: ['user_id', 'eaten_at'] // User ID와 날짜 기준으로 필터링 최적화
    }
  ]
});

User.hasMany(EatHistory, { foreignKey: 'user_id' });
EatHistory.belongsTo(User, { foreignKey: 'user_id' });

module.exports = EatHistory;