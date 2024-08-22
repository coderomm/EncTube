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

const oAuth2Client = new OAuth2(OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET, OAUTH2_REDIRECT_URL);

const uploadSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1),
  description: z.string({ required_error: 'Description is required' }).min(1),
  channelId: z.string({ required_error: 'Channel ID is required' }),
  tags: z.array(z.string({ required_error: 'Each tag must be a string' })).nonempty({ message: 'At least one tag is required' }),
  categoryId: z.string({ required_error: 'Category ID is required' }),
  defaultLanguage: z.string({ required_error: 'Default Language is required' }),
  privacyStatus: z.enum(['private', 'public', 'unlisted']),
  license: z.enum(['youtube', 'creativeCommon']).optional(),
  publishAt: z.string().optional(),
  selfDeclaredMadeForKids: z.boolean().optional(),
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
      title, description, channelId, tags, categoryId, defaultLanguage,
      privacyStatus, notifySubscribers, embeddable, license, publicStatsViewable,
      publishAt, selfDeclaredMadeForKids
    } = req.body;

    if (!req.files['file'] || !req.files['thumbnail']) {
      throw new Error('Video and thumbnail files are required');
    }

    const channel = await Channel.findById(channelId).session(session);
    if (!channel) throw new Error('Channel not found');

    const youtuber = await Youtuber.findById(channel.youtuber).session(session);
    if (!youtuber) throw new Error('YouTuber not found');

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
      publishAt,
      selfDeclaredMadeForKids,
      videoFilePath: videoUrl,
      thumbnailFilePath: thumbnailUrl,
      youtubeVideoId: '',
      youtuberId: channel.youtuber,
      editorId: req.user.userId,
      channelId,
      status: 'Pending',
    });

    await video.save({ session });

    const [videoSignedUrl] = await bucket.file(video.videoFilePath.split('/').pop()).getSignedUrl({
      action: 'read',
      expires: Date.now() + 30 * 60 * 1000,
    });
    const [thumbnailSignedUrl] = await bucket.file(video.thumbnailFilePath.split('/').pop()).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,
    });

    const emailPayload = {
      to: youtuber.email,
      subject: 'New video upload on EncTube by your editor',
      text: `Hello ${youtuber.channelName},

        A new video titled - "${title}" has been uploaded by your editor ${editor.username} (${editor.email})

        Video Details:
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
        Publish At - ${new Date(publishAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })},
        Self Declared Made For Kids - ${selfDeclaredMadeForKids},

        To Approve the uploaded video, please click on the following link:

        ${process.env.FRONTEND_URL}/youtuber/approve/${video._id}
        
        If you didn't found this relevent to you, please ignore this email and reply your response to this email.
        
        Thank you,

        The EncTube Team`
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
      pendingVideos = await Video.find({ channelId: channel._id, status: 'Pending' })
        .populate('editorId', 'username email');
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

      const [videoSignedUrl] = await bucket.file(video.videoFilePath.split('/').pop()).getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000,
      });

      const [thumbnailSignedUrl] = await bucket.file(video.thumbnailFilePath.split('/').pop()).getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000,
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

      let publishAtUTC;
      console.log('video.publishAt:', video.publishAt)
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

    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).send('Video uploaded successfully');
  } catch (error) {
    if (session.transaction.state !== 'committed') {
      await session.abortTransaction();
    }
    console.error('Error uploading video status:', error);
    res.status(500).send('Error uploading video status');
  } finally {
    session.endSession();
  }
});

module.exports = router;
