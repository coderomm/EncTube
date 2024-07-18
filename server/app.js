const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const config = require('./config');
const app = express();
const PORT = 5000;

// const { OAuth2Client } = require('google-auth-library');
// const { google } = require('googleapis');
// const User = require('./models/User');
// const Video = require('./models/Video');
// const { sendEmailNotification } = require('./service/notificationService');

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
async function dbConnect() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.log('Unable to connect to MongoDB Atlas!');
    console.log('error:', error);
  }
}
dbConnect();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Use the routes
app.use('/auth', authRoutes);
app.use('/api', videoRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
