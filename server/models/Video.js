const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], default: [] },
  categoryId: { type: String, required: true },
  defaultLanguage: { type: String },
  privacyStatus: { type: String, default: 'private' },
  notifySubscribers: { type: Boolean, default: true },
  embeddable: { type: Boolean, default: true },
  license: { type: String, default: 'youtube' },
  publicStatsViewable: { type: Boolean, default: true },
  selfDeclaredMadeForKids: { type: Boolean, default: false },
  videoFilePath: { type: String, required: true },
  thumbnailFilePath: { type: String, required: false },
  youtubeVideoId: { type: String },
  youtuber: { type: mongoose.Schema.Types.ObjectId, ref: 'Youtuber', required: true },
  editor: { type: mongoose.Schema.Types.ObjectId, ref: 'Editor' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
