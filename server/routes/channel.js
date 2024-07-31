// routes/channel.js
const express = require('express');
const router = express.Router();
const { authenticateYoutuber, authenticateEditor } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');
const Editor = require('../models/Editor');

router.post('/addEditor', authenticateYoutuber, async (req, res) => {
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
      return res.status(404).send('Channel not found.');
    }

    await channel.save();
    res.send('Editor added successfully.');
  } catch (error) {
    res.status(500).send('Error adding editor.');
  }
});

router.get('/:id', authenticateEditor, async (req, res) => {
  try {
      const channel = await Channel.findById(req.params.id).populate('youtuber', 'channelName channelUrl');
      if (!channel) {
          return res.status(404).json({ message: 'Channel not found' });
      }
      res.status(200).json(channel);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching channel details' });
  }
});


module.exports = router;
