const multer = require('multer');
const AppError = require('../utils/AppError');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new AppError('Not an image! Please upload an image.', 400));
        }
    }
});

module.exports = upload;
