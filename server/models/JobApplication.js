const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional if guest can apply
    },
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    cvFilePath: {
      type: String,
      required: [true, 'A CV file is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
