// routes/channel.js
const express = require('express');
const router = express.Router();
const { authenticateYoutuber, authenticateEditor } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');
const Editor = require('../models/Editor');
const Video = require('../models/Video');

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

router.get('/editors', authenticateYoutuber, async (req, res) => {

  let channel = await Channel.findOne({ youtuber: req.user.userId });
  if (!channel) {
    return res.status(404).send('Channel not found.');
  }

  const channelId = channel._id;

  try {
    const channel = await Channel.findById(channelId).populate('editors');
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const editorStats = await Promise.all(channel.editors.map(async (editor) => {
      const totalVideos = await Video.countDocuments({ editorId: editor._id, channelId });
      const approvedVideos = await Video.countDocuments({ editorId: editor._id, channelId, status: 'Approved' });

      return {
        editorId: editor._id,
        editorName: editor.username,
        editorEmail: editor.email,
        totalVideos,
        approvedVideos
      };
    }));

    res.status(200).json(editorStats);
  } catch (error) {
    console.error('Error fetching editors:', error);
    res.status(500).json({ message: 'Error fetching editors' });
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
