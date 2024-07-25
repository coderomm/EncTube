// routes/editor.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Editor = require('../models/Editor');
const Invitation = require('../models/Invitation');
const Channel = require('../models/Channel');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/authMiddleware');
const config = require('../config')

router.post('/register', async (req, res) => {
    const { token, username, password } = req.body;
    console.log(`token:${token}, username:${username}, password:${password}:`)
    const invitation = await Invitation.findOne({ token, expiresAt: { $gt: Date.now() } });
    if (!invitation) {
        return res.status(400).send('Invalid or expired token.');
    }
    console.log('invitation:', invitation)
    try {
        const channel = await Channel.findOne({ youtuber: invitation.youtuberId });
        console.log('channel:',channel)
        if (!channel) {
            return res.status(404).send('Channel not found.');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const editor = new Editor({
            username,
            email: invitation.editorEmail,
            password: hashedPassword,
            role: 'Editor'
        });
        const newEditor = await editor.save();
        console.log('newEditor:', newEditor)

        channel.editors.push(newEditor._id);
        await channel.save();
        console.log('channel:',channel)

        await Invitation.deleteOne({ _id: invitation._id });

        res.status(201).json(newEditor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const editor = await Editor.findOne({ email });
        if (editor && await bcrypt.compare(password, editor.password)) {
            const token = jwt.sign({ editorId: editor._id, role: editor.role }, config.JWT_SECRET);
            res.json({ token });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/logout", authMiddleware, (req, res) => {
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

module.exports = router;
