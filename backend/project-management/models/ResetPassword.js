const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ResetPassword = sequelize.define('Resetpassword', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiredAt:{
    type: DataTypes.DATE,
    allowNull: false,
  }
});
module.exports = ResetPassword;
