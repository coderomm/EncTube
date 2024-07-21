const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).send('Access denied, Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);

        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: "Invalid token"
            });
        }
    } catch (err) {
        return res.status(403).json({
            message: "Token verification failed",
            error: err.message
        });
    }
};

module.exports = {
    authMiddleware
};