const express = require('express');
const router = express.Router();
const { authenticateYoutuber, authenticateEditor } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');
const Editor = require('../models/Editor');
const Video = require('../models/Video');

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

router.get('/all-editors', authenticateYoutuber, async (req, res) => {
  try {
    let channel = await Channel.findOne({ youtuber: req.user.userId }).populate('editors');
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const editorStats = await Promise.all(channel.editors.map(async (editor) => {
      const totalVideos = await Video.countDocuments({ editorId: editor._id, channelId: channel._id });
      const approvedVideos = await Video.countDocuments({ editorId: editor._id, channelId: channel._id, status: 'Approved' });

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

router.post('/addEditor', authenticateYoutuber, async (req, res) => {
  console.log('/addEditor req.user : ', req.user)
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

router.delete('/:channelId/editor/:editorId', authenticateYoutuber, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { channelId, editorId } = req.params;

    const channel = await Channel.findById(channelId).session(session);
    if (!channel) {
      await session.abortTransaction();
      return res.status(404).send('Channel not found');
    }

    if (!channel.editors.includes(editorId)) {
      await session.abortTransaction();
      return res.status(404).send('Editor not associated with this channel');
    }

    channel.editors.pull(editorId);
    await channel.save({ session });

    const otherChannels = await Channel.find({ editors: editorId }).session(session);
    if (otherChannels.length === 0) {
      await Editor.findByIdAndDelete(editorId).session(session);
    }

    await session.commitTransaction();
    res.status(200).send('Editor removed successfully');
  } catch (error) {
    if (session.transaction.state !== 'committed') {
      await session.abortTransaction();
    }
    console.error('Error removing editor:', error);
    res.status(500).send('Error removing editor');
  } finally {
    session.endSession();
  }
});

module.exports = router;