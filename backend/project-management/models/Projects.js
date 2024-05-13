// project.js

const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');
const User = require('./Users');
const Like = require('./Like');
const Rating = require('./Rating');
const Comment = require('./Comment');

const Project = sequelize.define("Projects", {
  projectId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectDescription: {
    type: DataTypes.TEXT,
  },
  projectAssetUrl: {
    type: DataTypes.STRING,
  },
  dateOfSubmission: {
    type: DataTypes.STRING,
  },
  submittedBy: {
    type: DataTypes.STRING,
  },
  abstractUrl: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
  },
  remark:{
   type:DataTypes.STRING,
   defaultValue:null
  },
  // Define userId as a foreign key
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Define association between User and Project
User.hasMany(Project, { foreignKey: 'userId' });
Project.belongsTo(User, { foreignKey: 'userId' });


// Define associations
Project.hasMany(Like, { foreignKey: 'projectId' });
Like.belongsTo(Project, { foreignKey: 'projectId' });
Like.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(Rating, { foreignKey: 'projectId' });
Rating.belongsTo(Project, { foreignKey: 'projectId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// Define associations with comments
Project.hasMany(Comment, { foreignKey: 'projectId' });
Comment.belongsTo(Project, { foreignKey: 'projectId' });

// Add a virtual field or method to retrieve the like count for each post
Project.prototype.getLikeCount = async function() {
  const count = await Like.count({ where: { projectId: this.projectId } });
  return count;
};


Project.prototype.getRateCount = async function() {
  const count = await Rating.count({ where: { projectId: this.projectId } });
  return count;
};


module.exports = Project;
