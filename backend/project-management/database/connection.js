// connection.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

const DATABASE_NAME = process.env.DB_NAME;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const DIALECT = 'postgres';
const DATABASE_URL = process.env.DATABASE_URL;

// Initialize Sequelize with database credentials`
const sequelize = new Sequelize(DATABASE_NAME, USERNAME, PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: DIALECT,
  // Set this option to true to automatically create tables if they do not exist
  alter: true, // or force: true
});

// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres')

sequelize.sync({ alter: true }) // Set alter: true to alter tables to match model definitions
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(error => {
    console.error('Error synchronizing database:', error);
  });

// Export Sequelize instance
module.exports = sequelize;
