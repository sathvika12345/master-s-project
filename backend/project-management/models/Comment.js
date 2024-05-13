const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./Users');

const Comment = sequelize.define('Comment', {
  commentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define association between User and Comment
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

module.exports = Comment;
