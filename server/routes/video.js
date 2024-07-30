// routes/video.js
const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');
const Video = require('../models/Video');
const Youtuber = require('../models/Youtuber');
const { authenticateEditor } = require('../middleware/authMiddleware');
const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const oAuth2Client = new OAuth2Client(config.CLIENT_ID, config.CLIENT_SECRET, config.REDIRECT_URI);
const fs = require('fs');

router.post('/upload', authenticateEditor, upload.single('file'), async (req, res) => {
  const { title, description, userId, editorId } = req.body;
  const filePath = req.file.path;

  try {
    const video = new Video({
      youtuberId: userId,
      editorId,
      title,
      description,
      filePath,
      status: 'Pending',
      youtubeVideoId: ''
    });
    await video.save();

    // const youtuber = await Youtuber.findById(userId);
    // if (!youtuber) {
    //   return res.status(404).send('YouTuber not found');
    // }

    // await sendEmailNotification(
    //   'New Video Uploaded',
    //   `A new video titled "${title}" has been uploaded and is pending approval.`,
    //   youtuber.email,
    //   video._id
    // );

    fs.unlinkSync(filePath);

    res.status(201).send(`Video uploaded successfully. Video ID: ${video._id}`);
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Error uploading video');
  }
});

router.get('/videos/pending', authenticateEditor, async (req, res) => {
  if (req.user.role !== 'YouTuber') {
    return res.status(403).send('Access denied');
  }
  try {
    const videos = await Video.find({ status: 'Pending' });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/video/:id', authenticateEditor, async (req, res) => {
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
      const youtuber = await Youtuber.findById(video.youtuberId);
      oAuth2Client.setCredentials({
        access_token: youtuber.accessToken,
        refresh_token: youtuber.refreshToken
      });

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

module.exports = router;
