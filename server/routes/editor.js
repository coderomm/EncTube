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
const { authenticateEditor } = require('../middleware/authMiddleware');

const registerSchema = zod.object({
    token: zod.string(),
    username: zod.string().min(3),
    password: zod.string().min(6)
});

const loginSchema = zod.object({
    email: zod.string().email('Email required'),
    password: zod.string().min(6)
});

router.post('/register', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const validationResult = registerSchema.safeParse(req.body).session(session);
    if (!validationResult.success) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'Invalid input data', errors: validationResult.error.errors });
    }

    const { token, username, password } = req.body;
    const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } });
    if (!invitation) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).send('Invalid or expired token.');
    }

    try {
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId });
        if (!channel) {
            await session.abortTransaction();
            session.endSession();
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
        await editor.save();
        channel.editors.push(editor._id);
        await channel.save();
        await Invitation.deleteOne({ _id: invitation._id });

        res.status(201).json({
            message: 'Editor Registration Successful',
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ message: 'Invalid input data', errors: validationResult.error.errors });
    }
    const { email, password } = req.body;
    try {
        const editor = await Editor.findOne({ email });
        if (editor && await bcrypt.compare(password, editor.password)) {
            const token = jwt.sign({ userId: editor._id, role: editor.role }, process.env.JWT_SECRET);
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

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const editor = await Editor.findOne({ email });
        if (!editor) {
            return res.status(400).send('Editor not found');
        }

        const token = crypto.randomBytes(20).toString('hex');
        editor.resetPasswordToken = token;
        editor.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await editor.save();

        const resetUrl = `${process.env.FRONTEND_URL}/editor/reset-password?token=${token}`;

        const emailPayload = {
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.

               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:

               ${resetUrl}`
        };

        await axios.post(`${process.env.SMTP_URL}`, emailPayload);

        res.status(200).send('Reset link sent');
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

module.exports = router;
