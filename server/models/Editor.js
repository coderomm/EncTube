const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Editor'], required: true },
  youtubers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Youtuber' }],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('Editor', editorSchema);
