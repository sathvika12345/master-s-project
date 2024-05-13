const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudService = require('../services/cloudService');
const verifyToken = require('../middleware/authMiddleware');
const logger = require('../logger');

const upload = multer();

router.post('/file/upload', upload.single('file'), verifyToken, async (req, res) => {
    logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
    try {
        const fileUrl = await cloudService.uploadFile(req.file);
        res.status(200).json({ fileUrl: fileUrl });
    } catch (error) {
        console.error(error);
        logger.error(`---------------------Internal Server Error--------------------------`);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/file/list', verifyToken, async (req, res) => {
    logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
    try {
        const fileList = await cloudService.listFiles();
        res.send(fileList);
    } catch (error) {
        console.error(error);
        logger.error(`---------------------Internal Server Error--------------------------`);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/file/download/:filename', verifyToken, async (req, res) => {
    logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
    const filename = req.params.filename;
    logger.info(`---------------------FileName: /${filename}--------------------------`);
    try {
        const fileData = await cloudService.downloadFile(filename);
        logger.info(`---------------------File Send to Client Susseccfully--------------------------`);
        res.send(fileData);
    } catch (error) {
        console.error(error);
        logger.error(`---------------------File Not Found--------------------------`);
        res.status(404).send("File Not Found");
    }
});

router.delete('/file/delete/:filename', verifyToken, async (req, res) => {
    logger.info(`---------------------Route accessed: /${req.originalUrl}--------------------------`);
    const filename = req.params.filename;
    logger.info(`---------------------FileName: /${filename}--------------------------`);
    try {
        await cloudService.deleteFile(filename);
        logger.info(`---------------------File Deleted Susseccfully--------------------------`);
        res.send("File Deleted Successfully");
    } catch (error) {
        console.error(error);
        logger.error(`---------------------Internal Server Error--------------------------`);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
