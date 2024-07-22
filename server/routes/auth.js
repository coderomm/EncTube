// routes/auth.js
const express = require('express');
const router = express.Router();
const editorRouter = require('./editor')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('../config');
const Youtuber = require('../models/Youtuber');
const jwt = require('jsonwebtoken');
const { authenticateYoutuber } = require('../middleware/authMiddleware');

const OAUTH2_CLIENT_ID = config.CLIENT_ID;
const OAUTH2_CLIENT_SECRET = config.CLIENT_SECRET;
const OAUTH2_REDIRECT_URL = config.REDIRECT_URI;

const oauth2Client = new OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URL
);

router.use("/editor", editorRouter);

router.get('/youtuber', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube', 'openid', 'email', 'profile'],
  });
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
    const { email, name } = response.payload;

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelResponse = await youtube.channels.list({
      part: 'snippet',
      mine: true,
    });

    const channelData = channelResponse.data.items[0];
    const channelUrl = channelData.snippet.customUrl;
    const youtubeChannelId = channelData.id;
    const channelName = channelData.snippet.title;

    let youtuber = await Youtuber.findOne({ email });
    if (!youtuber) {
      youtuber = new Youtuber({
        email,
        channelName,
        channelUrl,
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

    const jwtToken = jwt.sign({ userId: youtuber._id, role: youtuber.role }, config.JWT_SECRET);

    res.cookie('youtuberToken', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    });
    res.redirect(`http://localhost:5173/youtuber-dashboard`);
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

router.get("/me/youtuber", authenticateYoutuber, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json({
      userYoutuber: user
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user information",
      error: error.message
    });
  }
});

router.get('/checkAuth', (req, res) => {
  const token = req.cookies.token;
  res.json({ token });
});

module.exports = router;
