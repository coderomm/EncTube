// routes/editor.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const Editor = require('../models/Editor');
const Invitation = require('../models/Invitation');
const Youtuber = require('../models/Youtuber');
const { authenticateEditor, authenticateYoutuber } = require('../middleware/authMiddleware');
const { sendResetPasswordEmail } = require('../utils/sendResetPasswordEmail');

const registerSchema = zod.object({
    token: zod.string(),
    username: zod.string().min(4, 'Username must be at least 4 characters long.'),
    password: zod.string()
        .min(6, 'Password must be at least 6 characters long.')
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must include at least one letter and one number.')
});

const loginSchema = zod.object({
    email: zod.string().email('Valid email address required.'),
    password: zod.string()
        .min(6, 'Password must be at least 6 characters long.')
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Password must include at least one letter and one number.')
});

router.post('/register', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
        await session.abortTransaction();
        session.endSession();
        const errors = validationResult.error.errors.map(error => ({
            field: error.path[0],
            message: error.message
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }

    const { token, username, password } = req.body;
    const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } });
    if (!invitation) {
        await session.abortTransaction();
        return res.status(400).send('Invalid or expired token.');
    }

    try {
        const youtubeChannel = await Youtuber.findById(invitation.youtuber);
        if (!youtubeChannel) {
            await session.abortTransaction();
            return res.status(404).send('Youtube channel not found.');
        }

        let editor = await Editor.findOne({ email: invitation.editorEmail });
        if (editor) {
            editor.channels = [...new Set([...editor.channels, youtubeChannel._id])];
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            editor = new Editor({
                username,
                email: invitation.editorEmail,
                password: hashedPassword,
                role: 'Editor',
                youtubers: [youtubeChannel._id]
            });
        }
        await editor.save({ session });
        youtubeChannel.editors.push(editor._id);
        await youtubeChannel.save({ session });
        await Invitation.deleteOne({ _id: invitation._id }, { session });

        await session.commitTransaction();
        res.status(201).json({
            message: 'Editor Registration Successful',
        });
    } catch (error) {
        if (session.transaction.state !== 'committed') {
            await session.abortTransaction();
        }
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        session.endSession();
    }
});

router.post('/login', async (req, res) => {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
        const errors = validationResult.error.errors.map(error => ({
            field: error.path[0],
            message: error.message
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    const { email, password } = req.body;
    try {
        const editor = await Editor.findOne({ email });
        if (editor && await bcrypt.compare(password, editor.password)) {
            const token = jwt.sign({ userId: editor._id, role: editor.role, userName: editor.username, email: editor.email }, process.env.JWT_SECRET);
            res.cookie('editorToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            const { _id, username, email, role, youtubers } = editor;
            res.status(200).json({
                message: 'Editor Login Successful',
                user: { _id, username, email, role, youtubers }
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const editor = await Editor.findOne({ email });
        if (!editor) {
            return res.status(400).send('Editor not found');
        }

        const token = crypto.randomBytes(20).toString('hex');
        editor.resetPasswordToken = token;
        editor.resetPasswordExpires = Date.now() + 7200000; // 2 hour
        await editor.save();

        const resetUrl = `${process.env.FRONTEND_URL}/editor/reset-password?token=${token}`;

        await sendResetPasswordEmail(editor.email, editor.username, 7, resetUrl);
        res.status(200).send('Password reset link sent !');
    } catch (error) {
        res.status(500).send('Error in sending reset link');
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const editor = await Editor.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!editor) {
            return res.status(400).send('Invalid or expired token');
        }

        editor.password = await bcrypt.hash(password, 10);
        editor.resetPasswordToken = undefined;
        editor.resetPasswordExpires = undefined;
        await editor.save();

        res.status(200).send('Password reset successful');
    } catch (error) {
        res.status(500).send('Error in resetting password');
    }
});

router.get('/channels', authenticateEditor, async (req, res) => {
    try {
        const youtubeChannels = await Youtuber.find({ editors: req.user.userId }).select('channelName channelUrl channelLogo');;
        res.status(200).json(youtubeChannels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channels' });
    }
});

router.get('/channel/:id', authenticateEditor, async (req, res) => {
    try {
        const youtubeChannel = await Youtuber.findById(req.params.id).select('channelName channelUrl channelLogo');
        if (!youtubeChannel) {
            return res.status(404).json({ message: 'Youtuber not found' });
        }
        res.status(200).json(youtubeChannel);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching youtuber details' });
    }
});

async function fetchAndStoreCategories() {
    try {
        const youtube = google.youtube({
            version: 'v3',
            auth: process.env.YOUTUBE_API_KEY
        });
        const response = await youtube.videoCategories.list({
            part: 'snippet',
            regionCode: 'IN'
        });

        const categories = response.data.items.map(item => ({
            id: item.id,
            title: item.snippet.title
        }));

        const filePath = path.join(__dirname, '../utils/videoCategories.json');

        fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

router.get('/youtube/video/categories', async (req, res) => {
    try {
        const categories = await fetchAndStoreCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

module.exports = router;
