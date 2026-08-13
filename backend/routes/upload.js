const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

const ALLOWED_FOLDERS = ['properties', 'maintenance', 'documents', 'profiles'];

/**
 * Sanitize folder name to prevent path traversal vulnerabilities
 */
const sanitizeFolder = (inputFolder) => {
  if (!inputFolder || typeof inputFolder !== 'string') return 'properties';
  const cleanFolder = path.basename(inputFolder.replace(/[^a-zA-Z0-9_-]/g, ''));
  return ALLOWED_FOLDERS.includes(cleanFolder) ? cleanFolder : 'properties';
};

/**
 * Helper to build public file URL
 */
const getFileUrl = (req, folder, filename) => {
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${folder}/${filename}`;
};

/**
 * POST /api/upload/single
 * Upload a single picture or document file (Protected by JWT Auth)
 */
router.post('/single', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded or invalid file format.' });
    }

    const rawFolder = req.query.folder || req.body.folder || 'properties';
    const folder = sanitizeFolder(rawFolder);
    const fileUrl = getFileUrl(req, folder, req.file.filename);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully.',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        folder: folder,
        path: `/uploads/${folder}/${req.file.filename}`,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Error handling single file upload:', error.message);
    res.status(500).json({
      success: false,
      message: 'File upload failed.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * POST /api/upload/multiple
 * Upload up to 10 pictures or documents (Protected by JWT Auth)
 */
router.post('/multiple', verifyToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded or invalid file format.' });
    }

    const rawFolder = req.query.folder || req.body.folder || 'properties';
    const folder = sanitizeFolder(rawFolder);
    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      folder: folder,
      path: `/uploads/${folder}/${file.filename}`,
      url: getFileUrl(req, folder, file.filename),
    }));

    res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully.`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error('Error handling multiple file uploads:', error.message);
    res.status(500).json({
      success: false,
      message: 'Multiple file upload failed.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/upload/files
 * List system uploaded files by folder (Protected by JWT Auth)
 */
router.get('/files', verifyToken, (req, res) => {
  try {
    const folder = sanitizeFolder(req.query.folder);
    const targetDir = path.join(__dirname, '../uploads', folder);

    if (!fs.existsSync(targetDir)) {
      return res.status(200).json({ success: true, data: [] });
    }

    const files = fs.readdirSync(targetDir).map((filename) => {
      const stats = fs.statSync(path.join(targetDir, filename));
      return {
        filename,
        folder,
        size: stats.size,
        createdAt: stats.birthtime,
        path: `/uploads/${folder}/${filename}`,
        url: getFileUrl(req, folder, filename),
      };
    });

    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error('Error listing upload files:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve uploaded files.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
