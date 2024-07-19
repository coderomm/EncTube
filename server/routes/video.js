const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const { sendEmailNotification } = require('../service/notificationService');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const oAuth2Client = new OAuth2Client(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI);
const fs = require('fs');
const multer = require('multer');

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

// Fetch pending videos
router.get('/videos/pending', authenticate, async (req, res) => {
  if (req.user.role !== 'YouTuber') {
    return res.status(403).send('Access denied');
  }

  try {
    const videos = await Video.find({ status: 'Pending' });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject video
router.put('/videos/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'YouTuber') {
    return res.status(403).send('Access denied');
  }

  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).send('Video not found');
    }
    video.status = req.body.status;
    await video.save();

    if (video.status === 'Approved') {
      const user = await User.findById(video.userId);
      oAuth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      });

      // Upload to YouTube
      const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
      const response = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: video.title,
            description: video.description,
            tags: ['tag1', 'tag2'],
            categoryId: '22',
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: fs.createReadStream(video.filePath),
        },
      });

      video.youtubeVideoId = response.data.id;
      await video.save();
    }

    res.send('Video status updated');
  } catch (error) {
    res.status(500).send('Error updating video status');
  }
});

// Video upload route
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  const { title, description, userId, editorId } = req.body;
  const filePath = req.file.path;

  try {
    // Save video details to the database
    const video = new Video({
      userId,
      editorId,
      title,
      description,
      filePath,
      status: 'Pending',
      youtubeVideoId: ''
    });
    await video.save();

    // Fetch the YouTuber's email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send email notification with action links
    await sendEmailNotification(
      'New Video Uploaded',
      `A new video titled "${title}" has been uploaded and is pending approval.`,
      user.email, // Use the fetched email here
      video._id
    );

    // Clean up uploaded file after processing
    fs.unlinkSync(filePath);

    res.send(`Video uploaded. Video ID: ${video._id}`);
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Error uploading video');
  }
});

module.exports = router;
