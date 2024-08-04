const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

// Replace OAuth2 with API key
const API_KEY = process.env.YOUTUBE_API_KEY;

router.get('/categories', async (req, res) => {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: API_KEY // Use API key for authentication
    });

    const response = await youtube.videoCategories.list({
      part: 'snippet',
      regionCode: 'US'
    });

    const categories = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title
    }));

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
