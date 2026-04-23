const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
    // Token comes in the request header like: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        // Verify the token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next(); // move on to the actual route
    } catch (error) {
        return res.status(403).json({ 
            message: 'Invalid or expired token.' 
        });
    }
}

module.exports = verifyToken;