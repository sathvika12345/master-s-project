require("dotenv").config();
const Project = require('../models/Projects');
const Like = require('../models/Like');
const Rating = require('../models/Rating');
const Comment = require('../models/Comment');
const User = require('../models/Users');
const ResetPassword = require('../models/ResetPassword');


async function createProject(projectDetails) {
  try {
    const project = await Project.create(projectDetails);
    const likeCount = await project.getLikeCount();
    return {...project.toJSON(),likeCount};
  } catch (error) {
    throw error;
  }
}

async function getProjectById(projectId,userId) {
  try {
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    
    const rating = await Rating.findAll({ where: { projectId: projectId, userId:userId } });
    const likeCount = await project.getLikeCount();
    const rateCount = await project.getRateCount();
    return {
      ...project?.toJSON(),
      likeCount,
      rating: rating?.[0]?.rating,
      rateCount
  }
  } catch (error) {
    throw error;
  }
}

async function getProjectsByUserId(userId) {
  try {
    const projects = await Project.findAll({ where: { userId },
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
     });
    for (const project of projects) {
      const likeCount = await project.getLikeCount();
      project.setDataValue('likeCount', likeCount);
    }
    return projects;
  } catch (error) {
    throw error;
  }
}

async function updateProject(projectId, projectDetails) {
  try {
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    if (!project) {
      throw new Error("Project not found");
    }
    await project.update(projectDetails);
    const likeCount = await project.getLikeCount();
    return {...project.toJSON(),likeCount};
  } catch (error) {
    throw error;
  }
}

async function updateAbstract(projectId, projectDetails) {
  try {
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    if (!project) {
      throw new Error("Project not found");
    }
    project.abstractUrl = projectDetails.abstractUrl;
    await project.save();
    const likeCount = await project.getLikeCount();
    return {...project.toJSON(),likeCount};
  } catch (error) {
    throw error;
  }
}

async function deleteProject(projectId) {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    await project.destroy();
    const likeCount = await project.getLikeCount();
    return {...project.toJSON(),likeCount};
  } catch (error) {
    throw error;
  }
}

async function getProjects() {
  try {
    const projects = await Project.findAll({
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl','displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl','displayPictureUrl'], // Include user details for project owner
      }],
    });
    for (const project of projects) {
      const likeCount = await project.getLikeCount();
      project.setDataValue('likeCount', likeCount);
    }
    return projects;
  } catch (error) {
    throw error;
  }
}

async function getApprovedProjects() {
  try {
    const projects = await Project.findAll({
      where:{
        status:"APPROVED"
      },
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl','displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl','displayPictureUrl'], // Include user details for project owner
      }],
    });
    for (const project of projects) {
      const likeCount = await project.getLikeCount();
      project.setDataValue('likeCount', likeCount);
    }
    return projects;
  } catch (error) {
    throw error;
  }
}

// Update project status by projectId
async function updateStatus(projectId, status,remark) {
  try {
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    if (!project) {
      throw new Error("Project not found");
    }

    // Update the status of the project
    project.status = status;
    project.remark=remark;
    await project.save();
    const likeCount = await project.getLikeCount();
    return {...project.toJSON(),likeCount};
  } catch (error) {
    throw error;
  }
}

// Update project likes by projectId
async function updateLikes(projectId) {
  try {
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Update the status of the project
    project.likes = project.likes + 1;
    await project.save();

    return project;
  } catch (error) {
    throw error;
  }
}

//Update project comments by projectId //needs to be checked and fixed
async function addComment(projectId, data) {
  try {
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    if (!project) {
      throw new Error("Project not found");
    }

    // Update the project comments
    project.comments = data;
    await project.save();
    const likeCount = await project.getLikeCount();
    return {...project.toJSON(),likeCount};
  } catch (error) {
    throw error;
  }
}

async function likeProject(userId, projectId) {
  try {
    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ where: { userId, projectId } });

    if (existingLike) {
      // User has already liked the post
      console.log('User has already liked the post.');
      throw new Error("User has already liked the post.");
    }

    // Create a new like entry
    await Like.create({ userId, projectId });

    // Increment the like count of the post
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    if (project) {
      project.likeCount += 1;
      await project.save();
      const likeCount = await project.getLikeCount();
      return {...project.toJSON(),likeCount};
    } else {
      throw new Error("Project Not Found.");
    }
    
  } catch (error) {
    throw error;
  }
}

async function rateProject(userId, projectId,rating) {
  try {
    // Check if the user has already liked the post
    const existingRating = await Rating.findOne({ where: { userId, projectId } });

    // Create a new like entry
    if (existingRating) {
      // If a rating already exists for the user and project, update it
      await existingRating.update({ rating });
    } else {
        // If no rating exists, create a new one
        await Rating.create({ userId, projectId, rating });
    }

    // Increment the like count of the post
    const project = await Project.findByPk(projectId,{
      include: [{
        model: Comment,
        required: false, // Use 'false' to perform a LEFT JOIN to include projects without comments
        // where: { parentId: null }, // Exclude reply comments (only include top-level comments)
        include: [{
          model: User,
          attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details
        }],
      }, {
        model: User,
        attributes: ['userId', 'name' ,'displayPictureUrl'], // Include user details for project owner
      }],
    });
    if (project) {
      project.rateCount += 1;
      await project.save();
      const rateCount = await project.getRateCount();
      return {...project.toJSON(),rateCount};
    } else {
      throw new Error("Project Not Found.");
    }
    
  } catch (error) {
    throw error;
  }
}

async function addCommentToProject(projectId, userId, content, parentId = null) {
  try {
    // Create the comment in the database
    const comment = await Comment.create({
      content,
      parentId,
      userId,
      projectId,
    }); 

    // Return the created comment
    return comment;
  } catch (error) {
    throw error;
  }
};

async function deleteComment(commentId) {
  try {
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }

    await comment.destroy();

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createProject,
  getProjectById,
  getApprovedProjects,
  updateProject,
  deleteProject,
  getProjectsByUserId,
  getProjects,
  updateStatus,
  addComment,
  updateAbstract,
  likeProject,
  rateProject,
  addCommentToProject,
  deleteComment
};
