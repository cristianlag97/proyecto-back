const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_NAME, process.env.DB_PASSWORD, {
  host: process.env.HOST,
  dialect: 'postgres'
});

module.exports = sequelize