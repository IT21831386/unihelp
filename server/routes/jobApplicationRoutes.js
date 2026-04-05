const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { applyForJob, getApplications } = require('../controllers/jobApplicationController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Uploads directory at the root of the server
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
});

router.post('/', upload.single('cvFile'), applyForJob);
router.get('/', getApplications);

module.exports = router;
