// routes/protectedRoutes.js
const express = require('express');
const { authenticateYoutuber } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authenticateYoutuber);

router.get('/youtuber-dashboard', (req, res) => {
  res.send('Welcome to the YouTuber Dashboard');
});

module.exports = router;
