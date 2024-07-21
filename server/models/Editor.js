const mongoose = require('mongoose');

const editorSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Editor'], required: true },
  channel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Editor', editorSchema);
