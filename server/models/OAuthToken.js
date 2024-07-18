const mongoose = require('mongoose');

const oAuthTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  scope: String,
  tokenType: String,
  expiryDate: Date,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OAuthToken', oAuthTokenSchema);
