// routes/invitation.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Editor = require('../models/Editor');
const sendInvitationEmail = require('../utils/sendInvitationEmail');
const Invitation = require('../models/Invitation');
const { authenticateYoutuber } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');
const axios = require('axios');
const { z } = require('zod');
const mongoose = require('mongoose');

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

        let invitationLink;
        if (editor) {
            invitationLink = `${process.env.FRONTEND_URL}/editor/confirm-channel?email=${editorEmail}&token=${token}`;
        } else {
            invitationLink = `${process.env.FRONTEND_URL}/editor/signup?email=${editorEmail}&token=${token}`;
        }
        // const response = await sendInvitationEmail(editorEmail, 'Invitation to Join as an Editor', `Please register/confirm using the following link: ${invitationLink}`);

        const emailPayload = {
            to: editorEmail,
            subject: 'Invitation to Join as an Editor',
            text: `
            Hello,

            You have been invited to join as a editor, please register/confirm by clicking on the link below:
            
            ${invitationLink}`
        };
        await axios.post('https://send-anonymous-mail.onrender.com/api/v1/send-email', emailPayload);
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

    try {
        const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } });
        if (!invitation) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        const editor = await Editor.findOne({ email: invitation.editorEmail });
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId });

        if (!editor || !channel) {
            return res.status(404).json({ message: 'Editor or Channel not found.' });
        }

        // Associate channel with editor
        if (!editor.channels.includes(channel._id)) {
            editor.channels.push(channel._id);
            await editor.save();
        }

        // Associate editor with channel
        if (!channel.editors.includes(editor._id)) {
            channel.editors.push(editor._id);
            await channel.save();
        }
        await Invitation.deleteOne({ _id: invitation._id });
        res.status(200).json({ message: 'Channel confirmed successfully.' });
    } catch (error) {
        console.error('Error confirming channel:', error);
        res.status(500).json({ message: 'Error confirming channel.' });
    }
});

module.exports = router;
