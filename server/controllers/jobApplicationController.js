const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');

// @desc    Submit a job application
// @route   POST /api/job-applications
// @access  Public
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, applicantId, fullName, email, phone } = req.body;

    if (!jobId || !fullName || !email || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CV' });
    }

    const application = await JobApplication.create({
      jobId,
      applicantId: applicantId || null,
      fullName,
      email,
      phone,
      cvFilePath: req.file.path, // stored via multer
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get job applications (can be filtered by job owner email or applicant ID)
// @route   GET /api/job-applications
// @access  Public
exports.getApplications = async (req, res) => {
  try {
    const { employerEmail, applicantId, applicantEmail } = req.query;

    // First fetch all applications and populate the Job details
    let applications = await JobApplication.find()
      .populate('jobId', 'title company contactEmail')
      .sort({ createdAt: -1 });

    // If an employer email is provided, filter the populated results
    if (employerEmail) {
      applications = applications.filter(app => 
        app.jobId && app.jobId.contactEmail === employerEmail
      );
    }

    // If an applicant ID or email is provided, filter for the student's own applications
    if (applicantId || applicantEmail) {
      applications = applications.filter(app => {
        if (applicantId && app.applicantId && app.applicantId.toString() === applicantId) return true;
        if (applicantEmail && app.email === applicantEmail) return true;
        return false;
      });
    }

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an application (name, email, phone, optional CV)
// @route   PUT /api/job-applications/:id
exports.updateApplication = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    const updateData = { fullName, email, phone };
    if (req.file) {
      updateData.cvFilePath = req.file.path;
    }
    const app = await JobApplication.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an application
// @route   DELETE /api/job-applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
