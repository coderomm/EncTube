const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const oAuth2Client = new OAuth2Client(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  config.REDIRECT_URI
);

exports.generateAuthUrl = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.SCOPES,
  });
  res.redirect(authUrl);
};

exports.oauth2callback = async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Get user info
  const response = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: config.CLIENT_ID,
  });
  const { email } = response.payload;

  // Save tokens and user info to the database
  let user = await User.findOne({ email });
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

  // Send the JWT token to the client
  res.redirect(`http://localhost:5000?token=${jwtToken}`);
};
