const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    youtubeChannelId: { type: String, required: true, unique: true },
    youtuber: { type: mongoose.Schema.Types.ObjectId, ref: 'Youtuber' },
    editors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Editor' }],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Channel', channelSchema);
