const mongoose = require('mongoose');

const youtuberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    channelName: { type: String, required: true },
    channelUrl: { type: String, required: true },
    channelLogo: { type: String },
    youtubeChannelId: { type: String, required: true, unique: true },
    accessToken: String,
    refreshToken: String,
    role: { type: String, enum: ['YouTuber'], required: true },
    editors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Editor' }],
}, { timestamps: true });

module.exports = mongoose.model('Youtuber', youtuberSchema);
