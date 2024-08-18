const jwt = require('jsonwebtoken');
const Editor = require('../models/Editor');
const Youtuber = require('../models/Youtuber');

const authenticateEditor = async (req, res, next) => {
    const token = req.cookies.editorToken;

    if (!token) {
        return res.status(403).send('Access denied, Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'Editor') {
            return res.status(403).send('Access denied, Editor role required');
        }

        const editor = await Editor.findById(decoded.userId);
        if (!editor) {
            return res.status(403).send('Access denied, user no longer exists');
        }

        req.user = decoded;
        console.log('Editor user:', decoded);
        next();
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
};

const authenticateYoutuber = async (req, res, next) => {
    const token = req.cookies.youtuberToken;
    if (!token) {
        return res.status(403).send('Access denied, Authorization token missing');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'YouTuber') {
            return res.status(403).send('Access denied, YouTuber role required');
        }

        const youtuber = await Youtuber.findById(decoded.userId);
        if (!youtuber) {
            return res.status(403).send('Access denied, user no longer exists');
        }

        req.user = decoded;
        console.log('YouTuber user:', decoded);
        next();
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
};

module.exports = {
    authenticateEditor,
    authenticateYoutuber,
};