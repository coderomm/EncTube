// routes/index.js
const express = require('express');
const authRouter = require('./auth');
const channelRouter = require('./channel');
const editorRouter = require('./editor');
const invitationRouter = require('./invitation');
const youtubeRouter = require('./youtube');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/channel', channelRouter);
router.use('/editor', editorRouter);
router.use('/invitation', invitationRouter);
router.use('/youtube', youtubeRouter);

module.exports = router;
