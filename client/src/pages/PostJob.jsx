import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PostJob.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data) {
  const errors = {};

  if (!data.title.trim()) {
    errors.title = 'Job title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Job title must be at least 3 characters';
  } else if (data.title.trim().length > 100) {
    errors.title = 'Job title cannot exceed 100 characters';
  }

  if (!data.company.trim()) {
    errors.company = 'Company name is required';
  } else if (data.company.trim().length < 2) {
    errors.company = 'Company name must be at least 2 characters';
  } else if (data.company.trim().length > 100) {
    errors.company = 'Company name cannot exceed 100 characters';
  }

  if (!data.location) {
    errors.location = 'Please select a location';
  }

  if (!data.level) {
    errors.level = 'Please select a job level';
  }

  if (!data.modality) {
    errors.modality = 'Please select a modality';
  }

  if (!data.salary) {
    errors.salary = 'Salary is required';
  } else if (Number(data.salary) <= 0) {
    errors.salary = 'Salary must be greater than 0';
  } else if (Number(data.salary) > 10000000) {
    errors.salary = 'Salary cannot exceed 10,000,000';
  }

  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 20) {
    errors.description = `Description must be at least 20 characters (${data.description.trim().length}/20)`;
  } else if (data.description.trim().length > 5000) {
    errors.description = `Description cannot exceed 5000 characters (${data.description.trim().length}/5000)`;
  }

  if (!data.contactEmail.trim()) {
    errors.contactEmail = 'Contact email is required';
  } else if (!EMAIL_REGEX.test(data.contactEmail)) {
    errors.contactEmail = 'Enter a valid email address';
  }

  if (data.link && data.link.trim()) {
    try {
      new URL(data.link);
    } catch {
      errors.link = 'Please enter a valid URL';
    }
  }

  return errors;
}

const initialFormData = {
  title: '',
  company: '',
  location: '',
  level: '',
  modality: '',
  salary: '',
  description: '',
  contactEmail: '',
  link: '',
};

function PostJob() {
  const [formData, setFormData] = useState({ ...initialFormData });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : {};

      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, salary: Number(formData.salary), postedByEmail: user.email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ ...initialFormData });
        setFieldErrors({});
      } else if (data.errors) {
        const mapped = {};
        data.errors.forEach((err) => {
          mapped[err.path] = err.msg;
        });
        setFieldErrors(mapped);
      } else {
        setServerError(data.message || 'Failed to post job');
      }
    } catch {
      setServerError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnother = () => {
    setSuccess(false);
    setFormData({ ...initialFormData });
    setFieldErrors({});
    setServerError('');
  };

  return (
    <div className="post-job-page-bg">
      {/* Aurora glow layer */}
      <div className="pj-bg-aurora" aria-hidden="true">
        <div className="pj-aurora-blob pj-aurora-blob-1" />
        <div className="pj-aurora-blob pj-aurora-blob-2" />
        <div className="pj-aurora-blob pj-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="pj-bg-grain" aria-hidden="true" />

      <Navbar />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="post-job-breadcrumb">
          <Link to="/careers">Job opportunities</Link>
          <span>&gt;</span>
          Post a Job
        </nav>

        {/* Page Header */}
        <div className="post-job-header">
          <h1>Post a new job opportunity</h1>
          <p>Fill in the details below to list your job opening</p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="post-job-success">
            <div className="post-job-success__icon">🎉</div>
            <h2>Job Posted Successfully!</h2>
            <p>Your job listing is now live and visible to candidates.</p>
            <div className="post-job-success__actions">
              <button
                className="post-job-success__btn post-job-success__btn--primary"
                onClick={handlePostAnother}
              >
                Post Another Job
              </button>
              <Link
                to="/careers/find-jobs"
                className="post-job-success__btn post-job-success__btn--secondary"
              >
                View All Jobs
              </Link>
            </div>
          </div>
        ) : (
          /* Form Card */
          <div className="post-job-card">
            {serverError && (
              <div className="post-job-error">⚠️ {serverError}</div>
            )}

            <form className="post-job-form" onSubmit={handleSubmit} noValidate>
              {/* Row 1: Title + Company */}
              <div className="post-job-form__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="title">
                    Job Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-input${fieldErrors.title ? ' input-error' : ''}`}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. UI/UX Engineer"
                    maxLength={100}
                  />
                  {fieldErrors.title && (
                    <span className="field-error">{fieldErrors.title}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="company">
                    Company Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className={`form-input${fieldErrors.company ? ' input-error' : ''}`}
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. ABC Technologies"
                    maxLength={100}
                  />
                  {fieldErrors.company && (
                    <span className="field-error">{fieldErrors.company}</span>
                  )}
                </div>
              </div>

              {/* Row 2: Location + Job Level */}
              <div className="post-job-form__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="location">
                    Location <span className="required">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    className={`form-select${fieldErrors.location ? ' input-error' : ''}`}
                    value={formData.location}
                    onChange={handleChange}
                  >
                    <option value="">Select location</option>
                    <option value="colombo">Colombo</option>
                    <option value="kandy">Kandy</option>
                    <option value="galle">Galle</option>
                    <option value="remote">Remote</option>
                  </select>
                  {fieldErrors.location && (
                    <span className="field-error">{fieldErrors.location}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="level">
                    Job Level <span className="required">*</span>
                  </label>
                  <select
                    id="level"
                    name="level"
                    className={`form-select${fieldErrors.level ? ' input-error' : ''}`}
                    value={formData.level}
                    onChange={handleChange}
                  >
                    <option value="">Select level</option>
                    <option value="internship">Internship</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid-senior">Mid - Senior</option>
                    <option value="senior">Senior</option>
                  </select>
                  {fieldErrors.level && (
                    <span className="field-error">{fieldErrors.level}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Modality + Salary */}
              <div className="post-job-form__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="modality">
                    Modality <span className="required">*</span>
                  </label>
                  <select
                    id="modality"
                    name="modality"
                    className={`form-select${fieldErrors.modality ? ' input-error' : ''}`}
                    value={formData.modality}
                    onChange={handleChange}
                  >
                    <option value="">Select modality</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On - Site</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  {fieldErrors.modality && (
                    <span className="field-error">{fieldErrors.modality}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="salary">
                    Salary (LKR) <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    className={`form-input${fieldErrors.salary ? ' input-error' : ''}`}
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. 90000"
                    min="1"
                    max="10000000"
                  />
                  {fieldErrors.salary && (
                    <span className="field-error">{fieldErrors.salary}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="description">
                  Job Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className={`form-textarea${fieldErrors.description ? ' input-error' : ''}`}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the role, responsibilities, and requirements (max 5000 characters)"
                  rows={5}
                  maxLength={5000}
                />
                <span className="field-helper" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Min: 20</span>
                  <span>{formData.description.length} / 5000</span>
                </span>
                {fieldErrors.description && (
                  <span className="field-error">{fieldErrors.description}</span>
                )}
              </div>

              {/* Contact Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="contactEmail">
                  Contact Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  className={`form-input${fieldErrors.contactEmail ? ' input-error' : ''}`}
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  autoComplete="email"
                />
                {fieldErrors.contactEmail && (
                  <span className="field-error">{fieldErrors.contactEmail}</span>
                )}
              </div>

              {/* Application Link */}
              <div className="form-group">
                <label className="form-label" htmlFor="link">
                  Application Link <span className="optional">(optional)</span>
                </label>
                <input
                  type="url"
                  id="link"
                  name="link"
                  className={`form-input${fieldErrors.link ? ' input-error' : ''}`}
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://careers.company.com/apply"
                />
                {fieldErrors.link && (
                  <span className="field-error">{fieldErrors.link}</span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="post-job-submit"
                disabled={loading}
              >
                {loading ? 'Posting...' : '🚀 Post Job'}
              </button>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default PostJob;
