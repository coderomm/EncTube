const mongoose = require('mongoose');

const youtuberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    channelName: { type: String, required: true, unique: true },
    channelUrl: { type: String, required: true, unique: true },
    youtubeChannelId: String,
    accessToken: String,
    refreshToken: String,
    role: { type: String, enum: ['YouTuber'], required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Youtuber', youtuberSchema);
