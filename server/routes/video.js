// routes/video.js
const express = require('express');
const { Readable } = require('stream');
const router = express.Router();
const { z } = require('zod');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const axios = require('axios');
const mongoose = require('mongoose');
const Video = require('../models/Video');
const Youtuber = require('../models/Youtuber');
const Editor = require('../models/Editor');
const { authenticateEditor, authenticateYoutuber } = require('../middleware/authMiddleware');
const multer = require('multer');
const { bucket } = require('../utils/firebaseConfig');
const { sendVideoAddedEmail } = require('../utils/sendVideoAddedEmail');
const upload = multer({ storage: multer.memoryStorage() });

const OAUTH2_CLIENT_ID = process.env.CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.CLIENT_SECRET;
const OAUTH2_REDIRECT_URL = process.env.REDIRECT_URL;

const oAuth2Client = new OAuth2(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URL);

const uploadSchema = z.object({
  title: z.string({ required_error: 'Title is required' })
    .min(1, { message: 'Title must be at least 1 character long' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  description: z.string({ required_error: 'Description is required' })
    .min(1, { message: 'Description must be at least 1 character long' })
    .max(5000, { message: 'Description cannot exceed 5000 characters' }),
  youtuber: z.string({ required_error: 'Youtuber ID is required' }),
  tags: z.array(z.string()).optional(),
  categoryId: z.string({ required_error: 'Category ID is required' }),
  defaultLanguage: z.string({ required_error: 'Default Language is required' }),
  privacyStatus: z.enum(['private', 'public', 'unlisted']),
  license: z.enum(['youtube', 'creativeCommon']).optional(),
  publishAt: z.string().optional(),
  selfDeclaredMadeForKids: z.boolean().optional(),
});

const updateVideoSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title must be at least 1 character long' })
    .max(100, { message: 'Title cannot exceed 100 characters' })
    .optional(),
  description: z.string()
    .min(1, { message: 'Description must be at least 1 character long' })
    .max(5000, { message: 'Description cannot exceed 5000 characters' })
    .optional(),
  tags: z.array(z.string()).optional(),
  privacyStatus: z.enum(['private', 'public', 'unlisted']).optional(),
});

router.post('/editor/upload', authenticateEditor, upload.fields([{ name: 'file' }, { name: 'thumbnail' }]), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    req.body.tags = JSON.parse(req.body.tags);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid tags format' });
  }
  try {
    const validationResult = uploadSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: 'Invalid input data', errors: validationResult.error.errors });
    }

    const {
      title, description, youtuber, tags, categoryId, defaultLanguage,
      privacyStatus, notifySubscribers, embeddable, license, publicStatsViewable, selfDeclaredMadeForKids
    } = req.body;

    if (!req.files['file'] || !req.files['thumbnail']) {
      throw new Error('Video and thumbnail files are required');
    }

    const youtuberChannel = await Youtuber.findById(youtuber).session(session);
    if (!youtuberChannel) throw new Error('YouTuber not found');

    const editor = await Editor.findById(req.user.userId).session(session);
    if (!editor) throw new Error('Editor not found');

    const videoFile = req.files['file'][0];
    const thumbnailFile = req.files['thumbnail'][0];

    const videoFileName = `${Date.now()}_${videoFile.originalname}`;
    const thumbnailFileName = `${Date.now()}_${thumbnailFile.originalname}`;

    const videoUpload = bucket.file(videoFileName);
    const thumbnailUpload = bucket.file(thumbnailFileName);

    const bufferToStream = (buffer) => {
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      return stream;
    };

    const uploadStream = (file, stream) => {
      return new Promise((resolve, reject) => {
        const upload = stream.createWriteStream({ metadata: { contentType: file.mimetype } });
        bufferToStream(file.buffer).pipe(upload)
          .on('finish', resolve)
          .on('error', reject);
      });
    };

    await Promise.all([
      uploadStream(videoFile, videoUpload),
      uploadStream(thumbnailFile, thumbnailUpload)
    ]);

    const videoUrl = `https://storage.googleapis.com/${bucket.name}/${videoFileName}`;
    const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${thumbnailFileName}`;

    const video = new Video({
      title,
      description,
      tags,
      categoryId,
      defaultLanguage,
      privacyStatus,
      notifySubscribers,
      embeddable,
      license,
      publicStatsViewable,
      selfDeclaredMadeForKids,
      videoFilePath: videoUrl,
      thumbnailFilePath: thumbnailUrl,
      youtubeVideoId: '',
      youtuber: youtuber,
      editor: req.user.userId,
      status: 'Pending',
    });

    await video.save({ session });

    const [videoSignedUrl] = await bucket.file(video.videoFilePath.split('/').pop()).getSignedUrl({
      action: 'read',
      expires: Date.now() + 240 * 60 * 1000,
    });
    const [thumbnailSignedUrl] = await bucket.file(video.thumbnailFilePath.split('/').pop()).getSignedUrl({
      action: 'read',
      expires: Date.now() + 240 * 60 * 1000,
    });
    const dashboardApprovalLink = `${process.env.FRONTEND_URL}/youtuber/video/${video._id}`;
    const oneClickApprovalLink = `${process.env.FRONTEND_URL}/youtuber/approve/${video._id}`;
    await sendVideoAddedEmail(youtuberChannel.email, youtuberChannel.channelName, 9, youtuberChannel.channelName, youtuberChannel.channelUrl, editor.username, editor.email,
      title, privacyStatus, thumbnailSignedUrl, videoSignedUrl, dashboardApprovalLink, oneClickApprovalLink);

    await session.commitTransaction();
    res.status(201).send(`Video uploaded successfully. Video ID: ${video._id}`);
  } catch (error) {
    console.error('Error uploading video:', error);
    if (session.transaction.state !== 'committed') {
      await session.abortTransaction();
    }
    res.status(500).send('Error uploading video');
  } finally {
    session.endSession();
  }
});

router.get('/editor/pending/:id', authenticateEditor, async (req, res) => {
  try {
    let pendingVideos;

    if (req.user.role === 'Editor') {
      const youtuberChannelId = req.params.id;
      if (!youtuberChannelId) {
        return res.status(400).json({ message: 'Youtuber channel Id is required' });
      }
      pendingVideos = await Video.find({ channel: youtuberChannelId, editor: req.user.userId, status: 'Pending' });
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
  try {
    let pendingVideos;

    if (req.user.role === 'YouTuber') {
      const youtuberChannel = await Youtuber.findById(req.user.userId);
      if (!youtuberChannel) {
        return res.status(404).json({ message: 'Youtuber not found' });
      }
      pendingVideos = await Video.find({ youtuber: youtuberChannel._id, status: 'Pending' }).populate('editor', 'username email');
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
  try {
    const youtuber = await Youtuber.findById(userId);
    if (!youtuber) {
      return res.status(404).send('Youtuber not found');
    }
    let video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).send('Video not found');
    }
    oAuth2Client.setCredentials({
      access_token: youtuber.accessToken,
      refresh_token: youtuber.refreshToken
    });
    const [videoSignedUrl] = await bucket.file(video.videoFilePath.split('/').pop()).getSignedUrl({
      action: 'read',
      expires: Date.now() + 30 * 60 * 1000,
    });
    const [thumbnailSignedUrl] = await bucket.file(video.thumbnailFilePath.split('/').pop()).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    });
    video = video.toObject();
    video.videoSignedUrl = videoSignedUrl;
    video.thumbnailSignedUrl = thumbnailSignedUrl;
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
    const validationResult = updateVideoSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.error.errors });
    }

    const video = await Video.findById(req.params.id).session(session);
    if (!video) {
      await session.abortTransaction();
      return res.status(404).send('Video not found');
    }

    const action = req.query.status || req.body.status;
    if (!action) {
      await session.abortTransaction();
      return res.status(400).send('Action or status is required');
    }

    if (req.body.title) video.title = req.body.title;
    if (req.body.description) video.description = req.body.description;
    if (req.body.tags) video.tags = req.body.tags;
    if (req.body.privacyStatus) video.privacyStatus = req.body.privacyStatus;

    video.status = action;
    if (video.status === 'Approved') {
      const youtuber = await Youtuber.findById(video.youtuber).session(session);
      if (!youtuber) {
        await session.abortTransaction();
        return res.status(404).send('Youtuber not found');
      }
      oAuth2Client.setCredentials({
        access_token: youtuber.accessToken,
        refresh_token: youtuber.refreshToken
      });

      if (oAuth2Client.isTokenExpiring()) {
        try {
          const tokens = await oAuth2Client.refreshAccessToken();
          oAuth2Client.setCredentials(tokens.credentials);
          youtuber.accessToken = tokens.credentials.access_token;
          youtuber.refreshToken = tokens.credentials.refresh_token || youtuber.refreshToken;
          await youtuber.save({ session });
        } catch (error) {
          console.error('Error refreshing access token:', error);
        }
      }

      const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

      const [videoSignedUrl] = await bucket.file(video.videoFilePath.split('/').pop()).getSignedUrl({
        action: 'read',
        expires: Date.now() + 72 * 60 * 60 * 1000
      });

      const [thumbnailSignedUrl] = await bucket.file(video.thumbnailFilePath.split('/').pop()).getSignedUrl({
        action: 'read',
        expires: Date.now() + 72 * 60 * 60 * 1000
      });

      const videoResponse = await axios({
        url: videoSignedUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const thumbnailResponse = await axios({
        url: thumbnailSignedUrl,
        method: 'GET',
        responseType: 'stream',
      });
      console.log('video data going to upload to youtube is : ', video)
      try {
        const uploadResponse = await youtube.videos.insert({
          part: 'snippet,status',
          requestBody: {
            snippet: {
              title: video.title,
              description: video.description,
              tags: video.tags,
              categoryId: video.categoryId,
              defaultLanguage: video.defaultLanguage,
              thumbnails: {
                default: {
                  url: thumbnailSignedUrl
                }
              }
            },
            status: {
              privacyStatus: video.privacyStatus,
              embeddable: video.embeddable,
              license: video.license,
              publicStatsViewable: video.publicStatsViewable,
              // publishAt: publishAtUTC,
              selfDeclaredMadeForKids: video.selfDeclaredMadeForKids,
              notifySubscribers: video.notifySubscribers
            },
          },
          media: {
            body: videoResponse.data,
            thumbnail: {
              body: thumbnailResponse.data
            }
          },
        });
        video.youtubeVideoId = uploadResponse.data.id;
        await bucket.file(video.videoFilePath.split('/').pop()).delete();
        await bucket.file(video.thumbnailFilePath.split('/').pop()).delete();

        await Video.findByIdAndDelete(video._id).session(session);
        await session.commitTransaction();
        res.status(200).send('Video uploaded successfully');
      } catch (error) {
        console.error('Error uploading video to YouTube:', error);
        await session.abortTransaction(); // Rollback any changes
        res.status(500).send('Error uploading video to YouTube');
      }
    } else if (video.status === 'Rejected') {
      await bucket.file(video.videoFilePath.split('/').pop()).delete();
      await bucket.file(video.thumbnailFilePath.split('/').pop()).delete();

      await Video.findByIdAndDelete(video._id).session(session);
      await session.commitTransaction();
      res.status(200).send('Video deleted successfully');
    }
  } catch (error) {
    if (session.transaction.state !== 'committed') {
      await session.abortTransaction();
    }
    console.error('Error uploading video to youtube:', error);
    res.status(500).send('Error uploading video to youtube');
  } finally {
    session.endSession();
  }
});

module.exports = router;