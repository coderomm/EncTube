// routes/invitation.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Editor = require('../models/Editor');
const { sendInvitationEmail } = require('../utils/sendInvitationEmail');
const Invitation = require('../models/Invitation');
const { authenticateYoutuber } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');
const { z } = require('zod');
const mongoose = require('mongoose');
const Youtuber = require('../models/Youtuber');

const invitationSchema = z.object({
    editorEmail: z.string().email(),
});

router.post('/sendInvitation', authenticateYoutuber, async (req, res) => {
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
        const youtuberId = req.user.userId;
        await Invitation.create([{ editorEmail, token, expiresAt, youtuberId }], { session });

        const youtuber = await Youtuber.findById(req.user.userId).session(session);
        if (!youtuber) throw new Error('YouTuber not found');

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

router.post('/confirmChannel', async (req, res) => {
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
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId }).session(session);

        if (!editor || !channel) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Editor or Channel not found.' });
        }

        // Associate channel with editor
        if (!editor.channels.includes(channel._id)) {
            editor.channels.push(channel._id);
            await editor.save({ session });
        }

        // Associate editor with channel
        if (!channel.editors.includes(editor._id)) {
            channel.editors.push(editor._id);
            await channel.save({ session });
        }
        await Invitation.deleteOne({ _id: invitation._id }).session(session);
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Channel confirmed successfully.' });
    } catch (error) {
        if (session.transaction.state !== 'committed') {
            await session.abortTransaction();
        }
        console.error('Error confirming channel:', error);
        res.status(500).json({ message: 'Error confirming channel.' });
    } finally {
        session.endSession();
    }
});

module.exports = router;
