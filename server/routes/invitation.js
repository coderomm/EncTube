// routes/invitation.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Editor = require('../models/Editor');
const sendInvitationEmail = require('../utils/sendInvitationEmail');
const Invitation = require('../models/Invitation');
const { authenticateYoutuber } = require('../middleware/authMiddleware');

router.post('/sendInvitation', authenticateYoutuber, async (req, res) => {
    const { editorEmail } = req.body;

    try {
        let editor = await Editor.findOne({ email: editorEmail, role: 'Editor' });
        if (!editor) {
            console.log('!editor')
            console.log('req.user:',req.user)
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

            const youtuberId = req.user.userId;
            const invitation = new Invitation({
                youtuberId,
                editorEmail,
                token,
                expiresAt
            });

            await invitation.save();

            const invitationLink = `http://localhost:5173/register-editor?email=${editorEmail}&token=${token}`;
            console.log('invitationLink:', invitationLink)

            // await sendInvitationEmail(editorEmail, 'Invitation to Join as an Editor', `Please register using the following link: ${invitationLink}`);

            res.status(200).json({
                invitationLink,
                message: 'Invitation sent successfully.',
                status: 200
            });
        } else {
            res.status(400).send('Editor already exists.');
        }
    } catch (error) {
        res.status(500).send('Error sending invitation.');
    }
});

module.exports = router;
