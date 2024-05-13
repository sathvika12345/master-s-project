const express = require('express');
const router = express.Router();
const projectService = require('../services/projectService');
const verifyToken = require('../middleware/authMiddleware');
const logger = require('../logger');
const { Op } = require('sequelize');
const Project =require('../models/Projects');

// Create project
router.post('/project', verifyToken,async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    console.log('create project called');
    logger.info(req.body);
    console.log('project body',req.body);
    const newProject = await projectService.createProject(req.body);
    logger.info(`-------------------Successfully Created the Project----------------------------`);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    logger.error(`--------Error Creating the project: ${error.message}---------- ----------------------`)
    res.status(500).json({ error: `Error creating project, message: ${error.message}` });
  }
});


// Get project by ID
router.get('/project/:projectId/:userId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`--------------ProjectId:${req.params.projectId}----------------------------------`)
    const { projectId,userId } = req.params;
    const project = await projectService.getProjectById(projectId,userId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    logger.info(`-------------------Project found Successfully----------------------------`);
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    logger.error(`-----------------Error fetching given project, message: ${error.message}-------------------`);
    res.status(500).json({ error: `Error fetching given project, message: ${error.message}` });
  }
});

// Get projects
router.get('/projects', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    const projects = await projectService.getProjects();
    logger.info(`-------------------Projects fetched Successfully----------------------------`);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    logger.error(`-----------------Error fetching projects, message: ${error.message}-------------------`);
    res.status(500).json({ error: `Error fetching projects, message: ${error.message}` });
  }
});

// Get Approved Projects
router.get('/approved_projects', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    const projects = await projectService.getApprovedProjects();
    logger.info(`-------------------Approved Projects fetched Successfully------------------------`);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    logger.error(`-----------------Error fetching Approved projects , message: ${error.message}-------------------`);
    res.status(500).json({ error: `Error fetching Approved projects, message: ${error.message}` });
  }
});


// Update project
router.put('/project/:projectId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------ProjectId: ${req.params.projectId}------------`)
    const { projectId } = req.params;
    const updatedProject = await projectService.updateProject(projectId, req.body);
    logger.info(`-------------------Projects Updated Successfully----------------------------`);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    logger.error(`-----------------Error updating project, message: ${error.message}------------------------`);
    res.status(500).json({ error: `Error updating project, message: ${error.message}` });
  }
});

// Update abstract
router.put('/project/abstract/:projectId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------ProjectId: ${req.params.projectId}------------`)
    const { projectId } = req.params;
    const updatedProject = await projectService.updateAbstract(projectId, req.body);
    logger.info(`-------------------Projects Abstract Updated Successfully----------------------------`);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    logger.error(`-----------------Error updating project Abstract, message: ${error.message}------------------------`);
    res.status(500).json({ error: `Error updating project Abstract, message: ${error.message}` });
  }
});

// Delete project
router.delete('/project/:projectId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------ProjectId: ${req.params.projectId}------------`)
    const { projectId } = req.params;
    await projectService.deleteProject(projectId);
    logger.info(`-------------------Projects deleted Successfully----------------------------`);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    logger.error(`-----------------Error deleting project, message: ${error.message}------------------------`);
    res.status(500).json({ error: `Error deleting project, message: ${error.message}` });
  }
});

// GET projects by rollNo
router.get('/projects/:userId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    const { userId } = req.params;
    logger.info(`-------USerId: ${req.params.userId}------------`)
    // Query projects where rollNo is equal to the provided value
    const projects = await projectService.getProjectsByUserId(userId);
    logger.info(`-------------------Projects Fetched Successfully----------------------------`);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    logger.error(`-----------------Error fetching projects , message: ${error.message}------------------------`);
    res.status(500).json({ error: `Error fetching projects , message: ${error.message}` });
  }
});


// PATCH route to update project status
router.patch('/project/:projectId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    const { projectId } = req.params;
    const { status,remark } = req.body;
    logger.info(`-------ProjectId: ${req.params.projectId}------------`);
    logger.info(req.body);
    // Update the status of the project
    const updatedProject = await projectService.updateStatus(projectId, status,remark);
    logger.info(`-------------------Projects Status Updated Successfully----------------------------`);
    return res.status(200).json({ message: 'Project status updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Error updating project status:', error);
    logger.error(`-----------------Error updating project status: ${error.message}------------------------`);
    return res.status(500).json({ error: `Error updating project status: ${error.message}`});
  }
});

// PATCH route to update project likes
router.patch("/project/like/:projectId/:userId", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(req.params);
    const { projectId,userId } = req.params;
    const updatedProject = await projectService.likeProject(userId, projectId);
    logger.info(`-------------------Projects Liked Successfully----------------------------`);
    return res
      .status(200)
      .json({ message: "Liked updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error liking project:", error);
    logger.error(`-----------------Error liking project: ${error.message}---------------------------`);
    return res.status(500).json({ error: `Error liking project: ${error.message}`});
  }
});

// PATCH route to update project rating
router.patch("/project/rate/:projectId/:userId/:rating", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(req.params);
    const { projectId,userId ,rating} = req.params;
    const updatedProject = await projectService.rateProject(userId, projectId,rating);
    logger.info(`-------------------Projects Liked Successfully----------------------------`);
    return res
      .status(200)
      .json({ message: "Rating updated successfully", project: updatedProject });
  } catch (error) {
    console.error("Error liking project:", error);
    logger.error(`-----------------Error liking project: ${error.message}---------------------------`);
    return res.status(500).json({ error: `Error liking project: ${error.message}`});
  }
});

// POST route to update project likes
router.post('/project/comment/:projectId', verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    const { projectId } = req.params;
    const { userId, text, parentId=null} = req.body;
    console.log(req);
    // Update the status of the project
    // const updatedProject = await projectService.addComment(projectId, data);
    const updatedProject = await projectService.addCommentToProject(projectId, userId, text, parentId);
    logger.info(`-------------------Comment Addded Successfully----------------------------`);
    return res.status(200).json({ message: 'Comment added successfully', project: updatedProject });
  } catch (error) {
    console.error('Error Commenting project:', error);
    logger.error(`---------------Error Commenting project: ${error.message}------------------------`);
    return res.status(500).json({ error: `Error Commenting project: ${error.message}` });
  }
});

// GET /projects/search?query=query_string - Search projects by name
router.get('/search_project',verifyToken, async (req, res) => {
  const query = req.query.query;
  try {
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          {
            projectName: {
              [Op.iLike]: `%${query}%`, // Case-insensitive search for projects containing the query string
            },
          },
          {
            projectDescription: {
              [Op.iLike]: `%${query}%`, // Case-insensitive search for projects containing the query string in description
            },
          },
        ],
      },
    });
    for (const project of projects) {
      const likeCount = await project.getLikeCount();
      project.setDataValue('likeCount', likeCount);
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /comments/:commentId - Delete a comment by ID
router.delete("/comment/:commentId", verifyToken,async (req, res) => {
  const commentId = req.params.commentId;
  console.log("kdhwe");

  try {
    const result = await projectService.deleteComment(commentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
