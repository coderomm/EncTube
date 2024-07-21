// routes/auth.js
const express = require('express');
const router = express.Router();
const editorRouter = require('./editor')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const config = require('../config');
const Youtuber = require('../models/Youtuber');
const jwt = require('jsonwebtoken');

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
    console.log(`tokens: ${tokens},tokens.id_token: ${tokens.id_token}`)
    if (!tokens.id_token) {
      throw new Error('Opps No ID token received');
    }
    const response = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: OAUTH2_CLIENT_ID,
    });
    const { email } = response.payload;

    let youtuber = await Youtuber.findOne({ email });
    if (!youtuber) {
      youtuber = new Youtuber({
        username: email,
        password: `1234${email}`,
        email,
        role: 'YouTuber',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
    } else {
      youtuber.accessToken = tokens.access_token;
      youtuber.refreshToken = tokens.refresh_token;
    }
    console.log(`youtuber: ${youtuber}`)
    await youtuber.save();

    const jwtToken = jwt.sign({ userId: youtuber._id, role: youtuber.role }, config.JWT_SECRET);

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    res.redirect('http://localhost:5173/youtuber');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('Authentication failed');
  }
});

router.get('/checkAuth', (req, res) => {
  const token = req.cookies.token;
  res.json({ token });
});

module.exports = router;
