// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const verifyToken = require("../middleware/authMiddleware");
const logger = require('../logger.js');

// Create user
router.post("/user", async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(req.body);
    console.log('user route hits');
    console.log('user body',req.body);
    const newUser = await userService.createUser(req.body);
    logger.info('---------------------New User Created Successfully---------------------------------------');
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    logger.error(`---------------------Error Creating User--${error.message}-----------------------------`);
    res.status(500).json({ error: `Error Creating User, message ${error.message}`});
  }
});

// User login route
router.post("/login", async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(req.body);
    console.log(req.body);
    const [metaData, token] = await userService.login(req.body);
    logger.info(`--------------------------Logged In Successfully---------------------------------`);
    res.status(200).json({ token: token, userData: metaData});
  } catch (error) {
    console.error("Login failed:", error);
    logger.error(`---------------------Error Logging the User--${error.message}---------------------------`);
    res.status(500).json({ error: `Error Logging the User:, message: ${error.message}` });
  }
});




// Get user by email
router.get("/user/:userRollNo", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`----------userRollNo: ${req.params.userRollNo}---------------------`);
    const { userRollNo } = req.params;
    const user = await userService.getUserByRollNo(userRollNo);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`-------------------Successfully Fetched the USer------------------------------------------`);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    logger.error(`---------------------Error fetching User:, ${error.message}------------------------------------`);
    res.status(500).json({ error:  `Error fetching User:, message ${error.message}` });
  }
});

// Get user by email
router.get("/users", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`---------Empty Body-----------------`);
    const users = await userService.getUsers();
    logger.info(`-------------------Successfully Fetched the Users--------------------------------`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    logger.error(`---------------------Error fetching Users:, ${error.message}------------------------------------`);
    res.status(500).json({ error:  `Error fetching Users:, message ${error.message}`  });
  }
});

// Get Reviewer
router.get("/reviewers", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`---------Empty Body-----------------`);
    const users = await userService.getReviewers();
    logger.info(`-------------------Successfully Fetched the Reviewers------------------------------------------`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching Reviewer:", error);
    logger.error(`---------------------Error fetching Reviewer:, ${error.message}------------------------------------`);
    res.status(500).json({ error: `Error fetching Reviewer:, message ${error.message}` });
  }
});

//update Reviewer Login
router.patch("/reviewer/:userId", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------------UserId: ${req.params.userId}---------------------------`);
    const {userId} =req.params;
    console.log("getting userId",userId);
    const updatedUser = await userService.updateReviwerLoginById(userId,req.body);
    logger.info(`-------------------Successfully Update the Reviewer Status------------------------------------------`);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error Updating Reviewer Status:", error);
    logger.error(`---------------------Error Updating Reviewer Status:, ${error.message}------------------------------------`);
    res.status(500).json({ error: `Error Updating Reviewer Status, message ${error.message}`});
  }
});


// Update user
router.patch("/user/:userRollNo", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`---------------User RollNo: ${req.params.userRollNo}--------------------------------------`);
    logger.info(req.body);
    const { userRollNo } = req.params;
    const updatedUser = await userService.updateUser(userRollNo, req.body);
    logger.info(`-------------------Successfully Updated the Given User------------------------------------------`);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    logger.error(`---------------------Error updating user:, ${error.message}------------------------------------`);
    res.status(500).json({ error: `Error updating User:, message ${error.message}` });
  }
});

// Update user Profile
router.patch("/user_profile/:userId", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------------UserId:${req.params.userId}-------------------------------------`);
    logger.info(req.body);
    const { userId } = req.params;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    logger.info(`-------------------Successfully Updated the User Profile------------------------------------------`);
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating User Profile:", error);
    logger.error(`---------------------Error updating User Profile:, ${error.message}------------------------------------`);
    res.status(500).json({ error: `Error updating User Profile:, message ${error.message}` });
  }
});

// Delete user
router.delete("/user/:userRollNo", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------------user RollNo.:--------${req.params.userRollNo}------------------`);
    const { userRollNo } = req.params;
    await userService.deleteUser(userRollNo);
    logger.info(`-------------------Successfully Deleted the User------------------------------------------`);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    logger.error(`---------------------Error deleting user:, ${error.message}------------------------------------`);
    res.status(500).json({ error: `Error deleting user, message ${error.message}` });
  }
});

router.post("/resetPassword", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------------user email.:--------${req.body.email}------------------`);
    const { email } = req.body;
    await userService.resetPassword(email);
    logger.info(`-------------------Successfully generated OTP------------------------------------------`);
    return res.status(200).json({ message: "OTP Sent Successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    logger.error(`---------------------Error sending otp:, ${error.message}------------------------------------`);
    return res.status(500).json({ error: `Error sending otp, message ${error.message}` });
  }
});

router.post("/otpVerify", verifyToken, async (req, res) => {
  logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
  try {
    logger.info(`-------------user params.:--------${req.body}------------------`);
    const params = req.body;
    await userService.changePassword(params);
    logger.info(`-------------------Successfully changed password------------------------------------------`);
    return res.status(200).json({ message: "Password change Successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    logger.error(`---------------------Error changing password:, ${error.message}------------------------------------`);
    return res.status(500).json({ error: `Error changing password, message ${error.message}` });
  }
});

module.exports = router;
