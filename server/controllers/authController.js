const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
import { OAuth2Client } from 'google-auth-library';
const config = require('../config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const OAUTH2_CLIENT_ID = config.CLIENT_ID;
const OAUTH2_CLIENT_SECRET = config.CLIENT_SECRET;
const OAUTH2_REDIRECT_URL = config.REDIRECT_URI;

const oauth2Client = new OAuth2(
  OAUTH2_CLIENT_ID,
  OAUTH2_CLIENT_SECRET,
  OAUTH2_REDIRECT_URL
);

exports.generateAuthUrl = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.SCOPES,
  });
  res.redirect(authUrl);
};

exports.oauth2callback = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  // Get user info
  const response = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.CLIENT_ID,
  });
  const { email } = response.payload;
  console.log(`tokens: ${tokens},tokens.id_token: ${tokens.id_token},response: ${response}`)

  // Save tokens and user info to the database
  let user = await User.findOne({ email });
  console.log(`user: ${user}`)
  if (!user) {
    user = new User({
      email,
      role: 'YouTuber',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  } else {
    user.accessToken = tokens.access_token;
    user.refreshToken = tokens.refresh_token;
  }
  await user.save();

  // Generate JWT token
  const jwtToken = jwt.sign({ userId: user._id, role: user.role }, config.JWT_SECRET);
  console.log('jwtToken: ', jwtToken)
  // Send the JWT token to the client
  res.redirect(`http://localhost:5173?token=${jwtToken}`);
};
