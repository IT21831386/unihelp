const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: ['colombo', 'kandy', 'galle', 'remote'],
    },
    level: {
      type: String,
      required: [true, 'Job level is required'],
      enum: ['internship', 'entry', 'mid-senior', 'senior'],
    },
    modality: {
      type: String,
      required: [true, 'Modality is required'],
      enum: ['remote', 'on-site', 'hybrid'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1, 'Salary must be greater than 0'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email address'],
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
