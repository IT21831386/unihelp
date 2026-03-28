const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createJob, getJobs } = require('../controllers/jobController');

const jobValidation = [
  body('title')
    .notEmpty().withMessage('Job title is required')
    .isLength({ min: 3 }).withMessage('Job title must be at least 3 characters')
    .trim(),
  body('company')
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2 }).withMessage('Company name must be at least 2 characters')
    .trim(),
  body('location')
    .notEmpty().withMessage('Location is required')
    .isIn(['colombo', 'kandy', 'galle', 'remote']).withMessage('Invalid location'),
  body('level')
    .notEmpty().withMessage('Job level is required')
    .isIn(['internship', 'entry', 'mid-senior', 'senior']).withMessage('Invalid job level'),
  body('modality')
    .notEmpty().withMessage('Modality is required')
    .isIn(['remote', 'on-site', 'hybrid']).withMessage('Invalid modality'),
  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isFloat({ gt: 0 }).withMessage('Salary must be greater than 0'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
  body('contactEmail')
    .notEmpty().withMessage('Contact email is required')
    .isEmail().withMessage('Enter a valid email address')
    .normalizeEmail(),
];

router.post('/', jobValidation, createJob);
router.get('/', getJobs);

module.exports = router;
