// routes/video.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');
const mongoose = require('mongoose');
const Video = require('../models/Video');
const Channel = require('../models/Channel');
const Youtuber = require('../models/Youtuber');
const Editor = require('../models/Editor');
const { authenticateEditor, authenticateYoutuber } = require('../middleware/authMiddleware');
const multer = require('multer');
const { bucket } = require('../utils/firebaseConfig');
const upload = multer({ storage: multer.memoryStorage() });

const OAUTH2_CLIENT_ID = process.env.CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.CLIENT_SECRET;
const OAUTH2_REDIRECT_URL = process.env.REDIRECT_URL;

const oAuth2Client = new OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URL
);

router.post('/editor/upload', authenticateEditor, upload.single('file'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const {
    title, description, channelId, tags, categoryId, defaultLanguage,
    privacyStatus, notifySubscribers, embeddable, license, publicStatsViewable,
    publishAt, selfDeclaredMadeForKids
  } = req.body;

  try {
    if (!title || !description || !channelId || !req.file) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Required fields are missing');
    }

    const channel = await Channel.findById(channelId).session(session);
    if (!channel) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('Channel not found');
    }

    const video = new Video({
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      categoryId,
      defaultLanguage,
      privacyStatus,
      notifySubscribers,
      embeddable,
      license,
      publicStatsViewable,
      publishAt,
      selfDeclaredMadeForKids,
      youtubeVideoId: '',
      youtuberId: channel.youtuber,
      editorId: req.user.userId,
      channelId,
      status: 'Pending',
    });

    const youtuber = await Youtuber.findById(channel.youtuber).session(session);
    if (!youtuber) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('YouTuber not found');
    }

    const editor = await Editor.findById(req.user.userId).session(session);
    if (!editor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('Editor not found');
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (err) => {
      console.error('Error uploading to Firebase Storage:', err);
      session.abortTransaction();
      session.endSession();
      return res.status(500).send('Error uploading to Firebase Storage');
    });

    stream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      video.filePath = publicUrl;
      await video.save({ session });

      const emailPayload = {
        to: youtuber.email,
        subject: 'New video upload on YT Video Manager by your editor',
        text: `Hello,

        A new video titled - "${title}" has been uploaded by your editor - ${editor.username} with this email address (${editor.email}).
        and asking your action.

        Uploaded video details - 
        Title - ${title},
        Description - ${description},
        Channel - ${youtuber.channelName} (${youtuber.channelUrl}),
        Tags - ${tags},
        Video Category Id - ${categoryId},
        Default Language - ${defaultLanguage},
        Privacy Status - ${privacyStatus},
        Notify Subscribers - ${notifySubscribers},
        Embeddable - ${embeddable},
        License - ${license},
        Public Stats Viewable - ${publicStatsViewable},
        Publish At - ${publishAt},
        Self Declared Made For Kids - ${selfDeclaredMadeForKids},

        To Approve the uploaded video, please click on the following link:

        ${process.env.BACKEND_BASE_URL}/video/id=${video._id}?status=Approved

        You can also Approve or Reject from your account, click the link below:
        
        ${process.env.FRONTEND_URL}/youtuber-dashboard
        
        If you didn't found this relevent to you, please ignore this email and reply your response to this email.
        
        Thanks,

        The YT Video Manager Team`
      };

      try {
        await axios.post(`${process.env.SMTP_URL}`, emailPayload);
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).send('Error sending email notification');
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).send(`Video uploaded successfully. Video ID: ${video._id}`);
    });
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading video:', error);
    await session.abortTransaction();
    session.endSession();
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

router.get('/youtuber/pending/:id', authenticateYoutuber, async (req, res) => {
  const userId = req.user.userId;
  const userRole = req.user.role;
  try {
    let video;

    if (userRole === 'YouTuber') {
      const channel = await Channel.findOne({ youtuber: userId });
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }
      video = await Video.find({ channelId: channel._id, _id: req.params.id });
    } else {
      return res.status(403).json({ message: 'Access denied, invalid role' });
    }
    res.status(200).json(video);
  } catch (error) {
    console.error('Error fetching pending video:', error);
    res.status(500).json({ message: 'Error fetching pending video' });
  }
});

router.put('/youtuber/approve/:id', authenticateYoutuber, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const video = await Video.findById(req.params.id).session(session);
    if (!video) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send('Video not found');
    }

    const action = req.query.status || req.body.status;
    if (!action) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send('Action or status is required');
    }

    video.status = action;
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

      const [signedUrl] = await bucket.file(video.filePath.split('/').pop()).getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      const response = await axios({
        url: signedUrl,
        method: 'GET',
        responseType: 'stream',
      });

      let publishAtUTC;
      if (typeof video.publishAt === 'string') {
        publishAtUTC = video.publishAt.replace('+00:00', 'Z');
      } else if (video.publishAt instanceof Date) {
        publishAtUTC = video.publishAt.toISOString();
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send('Invalid publishAt date format');
      }
      console.log('publishAtUTC:', publishAtUTC)

      const uploadResponse = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: video.title,
            description: video.description,
            tags: video.tags,
            categoryId: video.categoryId,
            defaultLanguage: video.defaultLanguage,
          },
          status: {
            privacyStatus: video.privacyStatus,
            embeddable: video.embeddable,
            license: video.license,
            publicStatsViewable: video.publicStatsViewable,
            publishAt: publishAtUTC,
            selfDeclaredMadeForKids: video.selfDeclaredMadeForKids,
            notifySubscribers: video.notifySubscribers
          },
        },
        media: {
          body: response.data,
        },
      });

      video.youtubeVideoId = uploadResponse.data.id;
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
