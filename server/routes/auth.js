// routes/auth.js
const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const Youtuber = require('../models/Youtuber');
const jwt = require('jsonwebtoken');
const Channel = require('../models/Channel');
const Editor = require('../models/Editor');

const OAUTH2_CLIENT_ID = process.env.CLIENT_ID;
const OAUTH2_CLIENT_SECRET = process.env.CLIENT_SECRET;
const OAUTH2_REDIRECT_URL = process.env.REDIRECT_URL;

const oauth2Client = new OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URL
);

router.get('/youtuber', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.upload', 'openid', 'email', 'profile'],
  })
  res.redirect(authUrl);
});

router.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    if (!tokens.id_token) {
      throw new Error('Opps No ID token received');
    }
    const response = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: OAUTH2_CLIENT_ID,
    });
    const { email } = response.payload;

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelResponse = await youtube.channels.list({
      part: 'snippet',
      mine: true,
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('No YouTube channel found for this user');
    }

    const channelData = channelResponse.data.items[0];
    const thumbnails = channelData.snippet.thumbnails;
    const channelUrl = channelData.snippet.customUrl;
    const defaultLogo = thumbnails.default.url;
    const mediumLogo = thumbnails.medium.url;
    const highLogo = thumbnails.high.url;
    const youtubeChannelId = channelData.id;
    const channelName = channelData.snippet.title;

    let youtuber = await Youtuber.findOne({ email });
    if (!youtuber) {
      youtuber = new Youtuber({
        email,
        channelName,
        channelUrl,
        channelLogo: highLogo,
        youtubeChannelId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        role: 'YouTuber'
      });
    } else {
      youtuber.accessToken = tokens.access_token;
      youtuber.refreshToken = tokens.refresh_token;
    }
    await youtuber.save();

    let channel = await Channel.findOne({ youtubeChannelId });
    if (!channel) {
      channel = new Channel({
        youtubeChannelId,
        youtuber: youtuber._id,
        editors: [],
      });
      await channel.save();
    }

    const jwtToken = jwt.sign({ userId: youtuber._id, role: youtuber.role, channelName: youtuber.channelName, channelUrl: youtuber.channelUrl }, process.env.JWT_SECRET);

    res.cookie('youtuberToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.FRONTEND_URL}/youtuber/dashboard`);
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

router.get('/checkAuth', async (req, res) => {
  const youtuberToken = req.cookies.youtuberToken;
  const editorToken = req.cookies.editorToken;
  try {
    if (youtuberToken) {
      const decodedYoutuber = jwt.verify(youtuberToken, process.env.JWT_SECRET);
      const youtuber = await Youtuber.findById(decodedYoutuber.userId);
      if (!youtuber) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      return res.status(200).json({ user: decodedYoutuber, role: 'Youtuber' });
    }

    if (editorToken) {
      const decodedEditor = jwt.verify(editorToken, process.env.JWT_SECRET);
      const editor = await Editor.findById(decodedEditor.userId);
      if (!editor) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      return res.status(200).json({ user: decodedEditor, role: 'Editor' });
    }
    return res.status(401).json({ message: 'Not authenticated' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post("/logout", async (req, res) => {
  const youtuberToken = req.cookies.youtuberToken;
  const editorToken = req.cookies.editorToken;
  if (!youtuberToken && !editorToken) {
    return res.status(400).json({ message: "No active session found" });
  }
  try {
    if (youtuberToken) {
      const decodedYoutuber = jwt.verify(youtuberToken, process.env.JWT_SECRET);
      const youtuber = await Youtuber.findById(decodedYoutuber.userId);
      if (!youtuber) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      res.set('Cache-Control', 'no-store');
      res.cookie('youtuberToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(0),
        path: '/'
      });
      return res.status(200).json({ message: "Channel logged out successfully" });
    }

    if (editorToken) {
      const decodedEditor = jwt.verify(editorToken, process.env.JWT_SECRET);
      const editor = await Editor.findById(decodedEditor.userId);
      if (!editor) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      res.set('Cache-Control', 'no-store');
      res.cookie('editorToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        expires: new Date(0),
        path: '/'
      });
      return res.status(200).json({ message: "Editor logged out successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
});

module.exports = router;
