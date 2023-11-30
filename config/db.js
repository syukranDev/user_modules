// 'use strict'

require('dotenv').config()
const Sequelize = require('sequelize');

console.log({ 
  host: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  pass: process.env.DATABASE_PASS,
  name: process.env.DATABASE_NAME,
  timezone: process.env.DATABASE_TIMEZONE
})

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
  dialect: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  timezone: process.env.DATABASE_TIMEZONE,
  dialectOptions: {
    useUTC: true
  },
  pool: {
    max: 300,
    min: 10,
    idle: 600000
  },
  logging: false,
  alter: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../model/users.js')(sequelize, Sequelize);

sequelize.sync();

module.exports = db;