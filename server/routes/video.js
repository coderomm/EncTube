// routes/video.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');
const upload = require('../multerConfig');
const Video = require('../models/Video');
const Channel = require('../models/Channel');
const Youtuber = require('../models/Youtuber');
const { authenticateEditor, authenticateYoutuber } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

const OAUTH2_CLIENT_ID = process.env.CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.CLIENT_SECRET;
const OAUTH2_REDIRECT_URL = process.env.REDIRECT_URL;

const oAuth2Client = new OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URL
);

router.post('/upload', authenticateEditor, upload.single('file'), async (req, res) => {
  const { title, description, channelId } = req.body;
  const filePath = req.file.path;
  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).send('Channel not found');
    }
    const video = new Video({
      title,
      description,
      filePath,
      status: 'Pending',
      youtubeVideoId: '',
      youtuberId: channel.youtuber,
      editorId: req.user.userId,
      channelId
    });
    await video.save();

    const youtuber = await Youtuber.findById(channel.youtuber);
    if (!youtuber) {
      return res.status(404).send('YouTuber not found');
    }

    const emailPayload = {
      to: youtuber.email,
      subject: 'New Video Uploaded on YT Studio Manager',
      text: `A new video titled "${title}" has been uploaded by editor and is pending approval.

      Click on this link to Approve :- http://localhost:3000/approve?action=approve&videoId=${video._id} ,

      Click on this link to Reject :- http://localhost:3000/approve?action=reject&videoId=${video._id} ,
      
      Click on this link to Hold :- http://localhost:3000/approve?action=hold&videoId=${video._id}
      `,
    };
    console.log('emailPayload.text:', emailPayload)
    const response = await axios.post('https://send-anonymous-mail.onrender.com/api/v1/send-email', emailPayload);
    console.log('Send notification res:', response)

    fs.unlinkSync(filePath);

    res.status(201).send(`Video uploaded successfully. Video ID: ${video._id}`);
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Error uploading video');
  }
});

router.get('/editor/pending', authenticateEditor, async (req, res) => {
  const userId = req.user.userId;
  const userRole = req.user.role;
  try {
    let pendingVideos;

    if (userRole === 'Editor') {
      const { channelId } = req.query;
      if (!channelId) {
        return res.status(400).json({ message: 'Channel ID is required' });
      }
      pendingVideos = await Video.find({ channelId: channelId, editorId: userId, status: 'Pending' });
    } else {
      return res.status(403).json({ message: 'Access denied, invalid role' });
    }

    res.status(200).json(pendingVideos);
  } catch (error) {
    console.error('Error fetching pending videos:', error);
    res.status(500).json({ message: 'Error fetching pending videos' });
  }
});

router.get('/youtuber/pending', authenticateYoutuber, async (req, res) => {
  const userId = req.user.userId;
  const userRole = req.user.role;
  try {
    let pendingVideos;

    if (userRole === 'YouTuber') {
      const channel = await Channel.findOne({ youtuber: userId });
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
      pendingVideos = await Video.find({ channelId: channel._id, status: 'Pending' });
    } else {
      return res.status(403).json({ message: 'Access denied, invalid role' });
    }

    res.status(200).json(pendingVideos);
  } catch (error) {
    console.error('Error fetching pending videos:', error);
    res.status(500).json({ message: 'Error fetching pending videos' });
  }
});

router.put('/:id', authenticateYoutuber, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const video = await Video.findById(req.params.id).session(session);
    if (!video) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('Video not found');
    }
    video.status = req.body.status;
    if (video.status === 'Approved') {
      const youtuber = await Youtuber.findById(video.youtuberId).session(session);
      if (!youtuber) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).send('Youtuber not found');
      }
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
    }
    await video.save({ session });
    await session.commitTransaction();
    session.endSession();
    res.status(200).send('Video status updated');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating video status:', error);
    res.status(500).send('Error updating video status');
  }
});

module.exports = router;
