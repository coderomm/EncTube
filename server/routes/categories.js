const express = require('express');
const router = express.Router();
const videoCategories = require('../utils/videoCategories.json');

router.get('/categories', (req, res) => {
  try {
    res.status(200).json(videoCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;