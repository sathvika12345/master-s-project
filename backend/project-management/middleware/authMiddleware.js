require("dotenv").config();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // const token = req.header('Authorization');
    // console.log('logging header',req.header);
    // console.log('logging token',token);
    // if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;