const jwt = require('jsonwebtoken');

const authenticateEditor = (req, res, next) => {
    const token = req.cookies.editorToken;

    if (!token) {
        return res.status(403).send('Access denied, Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'Editor') {
            return res.status(403).send('Access denied, Editor role required');
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
};
const authenticateYoutuber = (req, res, next) => {
    const token = req.cookies.youtuberToken;

    if (!token) {
        return res.status(403).send('Access denied, Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'YouTuber') {
            return res.status(403).send('Access denied, YouTuber role required');
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
};

module.exports = {
    authenticateEditor,
    authenticateYoutuber
};