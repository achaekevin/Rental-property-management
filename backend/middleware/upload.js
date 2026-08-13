const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure base upload directory and subdirectories exist
const baseUploadDir = path.join(__dirname, '../uploads');
const allowedFolders = ['properties', 'maintenance', 'documents', 'profiles'];

allowedFolders.forEach((folder) => {
  const dirPath = path.join(baseUploadDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure disk storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = req.query.folder || req.body.folder || 'properties';
    if (!allowedFolders.includes(folder)) {
      folder = 'properties';
    }
    const targetDir = path.join(baseUploadDir, folder);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and append unique timestamp + random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

// File validation filter (images & document formats)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|pdf|doc|docx/;
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Invalid file format. Only JPEG, PNG, GIF, WEBP, PDF, and DOC files are permitted.'));
  }
};

// Create Multer upload instance with 10MB file size limit
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
