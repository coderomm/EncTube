const express = require('express');
const router = express.Router();
const { generateAuthUrl, oauth2callback } = require('../controllers/authController');

router.get('/auth', generateAuthUrl);
router.get('/oauth2callback', oauth2callback);

module.exports = router;
