const { OAuth2Client } = require('google-auth-library');
const config = require('../config');

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
  // Save tokens to the database and handle further logic
  res.send('Authentication successful! You can close this tab.');
};
