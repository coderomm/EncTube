// routes/index.js
const express = require('express');
const authRouter = require('./auth');
const youtuberRouter = require('./youtuber');
const editorRouter = require('./editor');
const contactRouter = require('./contact');
const videoRouter = require('./video');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/youtuber', youtuberRouter);
router.use('/editor', editorRouter);
router.use('/contact', contactRouter);
router.use('/video', videoRouter);

module.exports = router;
