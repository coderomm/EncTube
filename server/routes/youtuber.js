const express = require('express');
const router = express.Router();
const { authenticateYoutuber, authenticateEditor } = require('../middleware/authMiddleware');
const Youtuber = require('../models/Youtuber');
const Editor = require('../models/Editor');
const Video = require('../models/Video');

router.get('/channel/editors', authenticateYoutuber, async (req, res) => {
  try {
    let youtubeChannel = await Youtuber.findOne({ youtuber: req.user.userId }).populate('editors');
    if (!youtubeChannel) {
      return res.status(404).json({ message: 'Youtuber not found' });
    }

    const editorStats = await Promise.all(youtubeChannel.editors.map(async (editor) => {
      const totalVideos = await Video.countDocuments({ editor: editor._id, youtuber: youtubeChannel._id });
      const approvedVideos = await Video.countDocuments({ editor: editor._id, youtuber: youtubeChannel._id, status: 'Approved' });

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

router.post('/channel/add-editor', authenticateYoutuber, async (req, res) => {
  const { editorEmail } = req.body;
  try {
    if (req.user.role !== 'YouTuber') {
      return res.status(403).send('Only YouTubers can add editors.');
    }

    const editor = await Editor.findOne({ email: editorEmail, role: 'Editor' });
    if (!editor) {
      return res.status(404).send('Editor not found.');
    }

    let youtubeChannel = await Youtuber.findById(req.user.userId);
    if (!youtubeChannel) {
      return res.status(404).send('Youtuber not found.');
    }

    await youtubeChannel.save();
    res.send('Editor added successfully.');
  } catch (error) {
    res.status(500).send('Error adding editor.');
  }
});

router.delete('/channel/editor/:editorId', authenticateYoutuber, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const editorId = req.params.editorId;
  
    const youtubeChannel = await Youtuber.findById(req.user.userId).session(session);
    if (!youtubeChannel) {
      await session.abortTransaction();
      return res.status(404).send('Youtuber not found');
    }

    if (!youtubeChannel.editors.includes(editorId)) {
      await session.abortTransaction();
      return res.status(404).send('Editor not associated with this youtube channel');
    }

    youtubeChannel.editors.pull(editorId);
    await youtubeChannel.save({ session });

    const otherChannels = await Youtuber.find({ editors: editorId }).session(session);
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