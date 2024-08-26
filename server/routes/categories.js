const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const router = express.Router();

async function fetchAndStoreCategories() {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
    const response = await youtube.videoCategories.list({
      part: 'snippet',
      regionCode: 'IN'
    });

    const categories = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title
    }));

    const filePath = path.join(__dirname, '../utils/videoCategories.json');

    fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

router.get('/categories', async (req, res) => {
  try {
    const categories = await fetchAndStoreCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;