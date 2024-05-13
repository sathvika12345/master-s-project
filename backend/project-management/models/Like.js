// like.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Like = sequelize.define("Like", {
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Like;
