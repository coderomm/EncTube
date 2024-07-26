// models/Invitation.js
const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  youtuberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Youtuber', required: true, },
  editorEmail: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Invitation', invitationSchema);
