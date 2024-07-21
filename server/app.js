const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const mainRouter = require("./routes/index");
const config = require('./config');
const app = express();
const PORT = 5000;

async function dbConnect() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.log('Unable to connect to MongoDB Atlas! error: ', error);
  }
}
dbConnect();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/v1', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
