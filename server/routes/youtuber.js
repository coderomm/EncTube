const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { z } = require('zod');
const mongoose = require('mongoose');
const { authenticateYoutuber } = require('../middleware/authMiddleware');
const Youtuber = require('../models/Youtuber');
const Editor = require('../models/Editor');
const Video = require('../models/Video');
const Invitation = require('../models/Invitation');
const { sendInvitationEmail } = require('../utils/sendInvitationEmail');

const invitationSchema = z.object({
  editorEmail: z.string().email(),
});

router.post('/channel/editor/add', authenticateYoutuber, async (req, res) => {
  const { editorEmail } = req.body;
  const validationResult = invitationSchema.safeParse({ editorEmail });
  if (!validationResult.success) {
    return res.status(400).send('Invalid email address');
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const editor = await Editor.findOne({ email: editorEmail, role: 'Editor' }).session(session);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000;
    const youtuber = await Youtuber.findById(req.user.userId).session(session);
    if (!youtuber) throw new Error('YouTuber not found');
    await Invitation.create([{ editorEmail, token, expiresAt, youtuber }], { session });
    let invitationLink;
    if (editor) {
      invitationLink = `${process.env.FRONTEND_URL}/editor/confirm-channel?email=${editorEmail}&token=${token}`;
    } else {
      invitationLink = `${process.env.FRONTEND_URL}/editor/signup?email=${editorEmail}&token=${token}`;
    }

    await sendInvitationEmail(editorEmail, editorEmail, 10, youtuber.channelName, editorEmail, invitationLink);

    await session.commitTransaction();
    res.status(200).send('Invitation sent successfully!');
  } catch (error) {
    if (session.transaction.state !== 'committed') {
      await session.abortTransaction();
    }
    console.error('Error sending invitation:', error);
    res.status(500).send('Error sending invitation.');
  } finally {
    session.endSession();
  }
});

router.post('/channel/editor/confirm', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } }).session(session);
    if (!invitation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const editor = await Editor.findOne({ email: invitation.editorEmail }).session(session);
    const youtubeChannel = await Youtuber.findById(invitation.youtuber).session(session);

    if (!editor || !youtubeChannel) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Editor or Channel not found.' });
    }

    // Associate youtubeChannel with editor
    if (!editor.youtubers.includes(youtubeChannel._id)) {
      editor.youtubers.push(youtubeChannel._id);
      await editor.save({ session });
    }

    // Associate editor with youtubeChannel
    if (!youtubeChannel.editors.includes(editor._id)) {
      youtubeChannel.editors.push(editor._id);
      await youtubeChannel.save({ session });
    }
    await Invitation.deleteOne({ _id: invitation._id }).session(session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Youtube channel confirmed successfully.' });
  } catch (error) {
    if (session.transaction.state !== 'committed') {
      await session.abortTransaction();
    }
    console.error('Error confirming youtube channel:', error);
    res.status(500).json({ message: 'Error confirming youtube channel.' });
  } finally {
    session.endSession();
  }
});

router.get('/channel/editors', authenticateYoutuber, async (req, res) => {
  try {
    let youtubeChannel = await Youtuber.findById(req.user.userId).populate('editors');
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

router.delete('/channel/editor/remove', authenticateYoutuber, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { editorId } = req.body;

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