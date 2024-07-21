// routes/invitation.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Editor = require('../models/Editor');
const sendInvitationEmail = require('../utils/sendInvitationEmail');
const Invitation = require('../models/Invitation');

router.post('/sendInvitation', async (req, res) => {
    const { editorEmail } = req.body;

    try {
        // Check if the editor already exists
        let editor = await Editor.findOne({ email: editorEmail, role: 'Editor' });
        if (!editor) {
            // Generate a unique token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

            // Save the invitation
            await Invitation.create({ editorEmail, token, expiresAt });

            // Send email with the invitation link
            const invitationLink = `http://localhost:5000/register-editor?token=${token}`;
            await sendInvitationEmail(editorEmail, 'Invitation to Join as an Editor', `Please register using the following link: ${invitationLink}`);

            res.status(200).send('Invitation sent successfully.');
        } else {
            res.status(400).send('Editor already exists.');
        }
    } catch (error) {
        res.status(500).send('Error sending invitation.');
    }
});

module.exports = router;
