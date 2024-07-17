const express = require('express');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to parse JSON
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Google OAuth2 Client
const oAuth2Client = new OAuth2Client(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  config.REDIRECT_URI
);

// Route to initiate OAuth2 flow
app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.SCOPES,
  });
  res.redirect(authUrl);
});

// OAuth2 callback route
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  // Save tokens to the database and handle further logic
  res.send('Authentication successful! You can close this tab.');
});

// Video upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const filePath = req.file.path;
  const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

  const response = await youtube.videos.insert({
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title,
        description,
        tags: ['tag1', 'tag2'],
        categoryId: '22', // Education
      },
      status: {
        privacyStatus: 'private',
      },
    },
    media: {
      body: fs.createReadStream(filePath),
    },
  });

  // Clean up uploaded file after processing
  fs.unlinkSync(filePath);

  res.send(`Video uploaded. Video ID: ${response.data.id}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
