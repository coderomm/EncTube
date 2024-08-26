// routes/editor.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const Editor = require('../models/Editor');
const Invitation = require('../models/Invitation');
const Channel = require('../models/Channel');
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
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId });
        if (!channel) {
            await session.abortTransaction();
            return res.status(404).send('Channel not found.');
        }

        let editor = await Editor.findOne({ email: invitation.editorEmail });
        if (editor) {
            editor.channels = [...new Set([...editor.channels, channel._id])];
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            editor = new Editor({
                username,
                email: invitation.editorEmail,
                password: hashedPassword,
                role: 'Editor',
                channels: [channel._id]
            });
        }
        await editor.save({ session });
        channel.editors.push(editor._id);
        await channel.save({ session });
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
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                message: 'Editor Login Successful',
                user: editor
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
        const channels = await Channel.find({ editors: req.user.userId }).populate('youtuber', 'channelName channelUrl');
        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channels' });
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
