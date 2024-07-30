// server/multerConfig.js
const multer = require('multer');
const mkdirp = require('mkdirp');
const path = require('path');

// Create the uploads directory if it doesn't exist already
const uploadsDir = path.join(__dirname, 'uploads');
mkdirp.sync(uploadsDir);

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;