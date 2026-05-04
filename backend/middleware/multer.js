const multer = require('multer');
const path = require('path');
const os = require('os');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use system temp directory for cross-platform compatibility
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
