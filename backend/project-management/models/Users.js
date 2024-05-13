const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const User = sequelize.define('Users', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true ,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  displayPictureUrl: {
    type:DataTypes.STRING,
    defaultValue:null
  },
  active:{
   type:DataTypes.BOOLEAN,
   defaultValue:true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rollNo: {
    type: DataTypes.STRING,
    allowNull:true,
    unique:true,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER'
  }
});


module.exports = User;
