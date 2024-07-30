// routes/invitation.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Editor = require('../models/Editor');
const sendInvitationEmail = require('../utils/sendInvitationEmail');
const Invitation = require('../models/Invitation');
const { authenticateYoutuber } = require('../middleware/authMiddleware');
const Channel = require('../models/Channel');

router.post('/sendInvitation', authenticateYoutuber, async (req, res) => {
    const { editorEmail } = req.body;
    try {
        console.log('yt.req.user:', req.user)
        const editor = await Editor.findOne({ email: editorEmail, role: 'Editor' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        const youtuberId = req.user.userId;
        await Invitation.create({ editorEmail, token, expiresAt, youtuberId });

        let invitationLink;
        if (editor) {
            invitationLink = `${process.env.FRONTEND_URL}/confirm-channel?email=${editorEmail}&token=${token}`;
        } else {
            invitationLink = `${process.env.FRONTEND_URL}/register-editor?email=${editorEmail}&token=${token}`;
        }
        await sendInvitationEmail(editorEmail, 'Invitation to Join as an Editor', `Please register/confirm using the following link: ${invitationLink}`);

        res.status(200).json({
            invitationLink,
            message: 'Invitation sent successfully.',
            status: 200
        });

    } catch (error) {
        res.status(500).send('Error sending invitation.');
    }
});

router.post('/confirmChannel', async (req, res) => {
    const { token, email } = req.body;
    const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } });

    if (!invitation) {
        return res.status(400).send('Invalid or expired token.');
    }

    try {
        const editor = await Editor.findOne({ email: invitation.editorEmail });
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId });

        if (!editor || !channel) {
            return res.status(404).send('Editor or Channel not found.');
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

        console.log('Channel confirmed successfully.');
        res.status(200).json({
            status: 200,
            message: 'Channel confirmed successfully.',
            editor,
            channel
        });
    } catch (error) {
        console.log('Error confirming channel.');
        res.status(500).send('Error confirming channel.');
    }
});

module.exports = router;
