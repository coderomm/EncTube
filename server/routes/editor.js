// routes/editor.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Editor = require('../models/Editor');
const Invitation = require('../models/Invitation');
const Channel = require('../models/Channel');
const jwt = require('jsonwebtoken');
const { authenticateEditor } = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
    const { token, username, password } = req.body;
    const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } });
    if (!invitation) {
        return res.status(400).send('Invalid or expired token.');
    }
    try {
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId });
        if (!channel) {
            console.error('Error registering editor. Channel not found.');
            return res.status(404).send('Channel not found.');
        }

        let editor = await Editor.findOne({ email: invitation.editorEmail });
        if (editor) {
            editor.channels = [...new Set([...editor.channels, channel._id])];
            await editor.save();
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            editor = new Editor({
                username,
                email: invitation.editorEmail,
                password: hashedPassword,
                role: 'Editor',
                channels: [channel._id]
            });
            await editor.save();
        }
        channel.editors.push(editor._id);
        await channel.save();
        await Invitation.deleteOne({ _id: invitation._id });

        res.status(201).json({
            status: 201,
            message: 'Editor register successful!',
            editor
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const editor = await Editor.findOne({ email });
        if (editor && await bcrypt.compare(password, editor.password)) {
            const token = jwt.sign({ userId: editor._id, role: editor.role }, process.env.JWT_SECRET);
            res.cookie('editorToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                maxAge: 3600000,
            });
            res.status(200).json({
                status: 200,
                message: 'Editor login successful!',
                editor
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/logout", authenticateEditor, (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

router.get('/channels', authenticateEditor, async (req, res) => {
    try {
        const channels = await Channel.find({ editors: req.user.userId }).populate('youtuber', 'channelName channelUrl');
        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channels' });
    }
});

router.get('/video/pending', authenticateEditor, async (req, res) => {
    const { channelId } = req.query;
    try {
        const pendingVideos = await Video.find({ channel: channelId, status: 'Pending' });
        res.status(200).json(pendingVideos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending videos' });
    }
});

module.exports = router;
