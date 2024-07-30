// routes/channel.js
const express = require('express');
const router = express.Router();
const { authenticateEditor } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');
const Editor = require('../models/Editor');

router.post('/addEditor', authenticateEditor, async (req, res) => {
  const { editorEmail } = req.body;
  try {
    if (req.user.role !== 'YouTuber') {
      return res.status(403).send('Only YouTubers can add editors.');
    }

    const editor = await Editor.findOne({ email: editorEmail, role: 'Editor' });
    if (!editor) {
      return res.status(404).send('Editor not found.');
    }

    let channel = await Channel.findOne({ youtuber: req.user.userId });
    if (!channel) {
      channel = new Channel({
        youtubeChannelId: req.user.youtubeChannelId,
        youtuber: req.user.userId,
        editors: [editor._id],
      });
    } else {
      if (!channel.editors.includes(editor._id)) {
        channel.editors.push(editor._id);
      }
    }
    await channel.save();
    res.send('Editor added successfully.');
  } catch (error) {
    res.status(500).send('Error adding editor.');
  }
});

module.exports = router;
