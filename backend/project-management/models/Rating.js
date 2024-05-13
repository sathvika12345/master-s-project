// Rating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Rating = sequelize.define("Rating", {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Rating;
