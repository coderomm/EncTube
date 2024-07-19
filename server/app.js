const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const videoRoutes = require('./routes/video');
const mainRouter = require("./routes/index");
const config = require('./config');
const app = express();
const PORT = 5000;

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

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));  

// Use the routes
app.use('/api/v1', mainRouter);

// app.use('/auth', authRoutes);
// app.use('/api', videoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
