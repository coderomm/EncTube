const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  youtubeVideoId: String,
  youtuberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Youtuber', required: true },
  editorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Editor' },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
