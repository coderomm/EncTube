const fs = require('fs');
const { google } = require('googleapis');

async function fetchAndStoreCategories() {
  try {
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    });
    const response = await youtube.videoCategories.list({
      part: 'snippet',
      regionCode: 'US'
    });

    const categories = response.data.items.map(item => ({
      id: item.id,
      title: item.snippet.title
    }));

    fs.writeFileSync('videoCategories.json', JSON.stringify(categories, null, 2));
    console.log('Categories fetched and stored successfully.');
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}