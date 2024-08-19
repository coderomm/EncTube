require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const mainRouter = require("./routes/index");
const videoRouter = require('./routes/video');
const app = express();
const PORT = 5000;

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.log('Unable to connect to MongoDB Atlas! error: ', error);
  }
}
dbConnect();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true
}));

app.use('/api/v1', mainRouter);
app.use('/api/v1/video', videoRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
