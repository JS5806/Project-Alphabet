const sequelize = require('../config/database');
const User = require('./user');
const Restaurant = require('./restaurant');
const Menu = require('./menu');
const EatHistory = require('./eatHistory');

const db = {
  sequelize,
  User,
  Restaurant,
  Menu,
  EatHistory
};

module.exports = db;