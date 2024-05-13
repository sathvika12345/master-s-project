require("dotenv").config();
const aws = require('aws-sdk');
const { v4: uuidv4 } = require("uuid");

// Initialize AWS SDK
aws.config.update({
    secretAccessKey: process.env.ACCESS_SECRET,
    accessKeyId: process.env.ACCESS_KEY,
    region: process.env.REGION
});

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new aws.S3();

const uploadFile = async (file) => {
    try {
        const params = {
          Bucket: BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
        };
        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        throw error;
    }
};

const listFiles = async () => {
    try {
        const response = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
        return response.Contents.map(item => item.Key);
    } catch (error) {
        throw error;
    }
};

const downloadFile = async (filename) => {
    try {
        const response = await s3.getObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
        return response.Body;
    } catch (error) {
        throw error;
    }
};

const deleteFile = async (filename) => {
    try {
        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
    } catch (error) {
        throw error;
    }
};

module.exports = { uploadFile, listFiles, downloadFile, deleteFile };
