import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ApplyJob.css';

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [cvFile, setCvFile] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // If user is logged in, prefill standard details
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setFormData(prev => ({ 
        ...prev, 
        fullName: user.name || '', 
        email: user.email || '' 
      }));
    }
  }, []);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details. The job may no longer exist.');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingJob(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Very basic validation
      const file = e.target.files[0];
      if (file.size > 5000000) {
        setError('File size exceeds the 5MB limit.');
        setCvFile(null);
        return;
      }
      setCvFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setError('A CV attachment is absolutely required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const payload = new FormData();
      payload.append('jobId', id);
      if (user && user.id) {
        payload.append('applicantId', user.id);
      }
      payload.append('fullName', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('cvFile', cvFile);

      const response = await fetch('http://localhost:5000/api/job-applications', {
        method: 'POST',
        body: payload, // note: FormData does NOT require manual content-type headers!
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error submitting application');
      }

      setSuccess(true);
      // Wait sequence then redirect
      setTimeout(() => {
        navigate(`/careers/job/${id}`);
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to submit application. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="apply-job-page">
        <Navbar />
        <div className="apply-loading-container">
          <div className="apply-spinner"></div>
          <p>Preparing application...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="apply-job-page">
      <Navbar />
      
      <main className="apply-job-main container">
        {job && (
          <div className="apply-job-header">
            <h2>Apply for <span>{job.title}</span></h2>
            <p className="apply-job-subtitle">at {job.company} • {job.location}</p>
          </div>
        )}

        <div className="apply-form-wrapper">
          {success ? (
            <div className="apply-success-box">
              <div className="success-icon">✓</div>
              <h3>Application Submitted!</h3>
              <p>Your application and CV have been successfully forwarded to {job?.company}.</p>
              <p className="redirect-note">Redirecting you back to the job posting...</p>
            </div>
          ) : (
            <form className="apply-form" onSubmit={handleSubmit}>
              {error && <div className="apply-error-panel">{error}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  placeholder="e.g. Jane Doe"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="jane@example.com"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="+94 77 123 4567"
                  required 
                />
              </div>

              <div className="form-group file-upload-group">
                <label>Resume / CV</label>
                <div className="file-upload-box">
                  <input 
                    type="file" 
                    id="cvFile" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  <div className="file-upload-visual">
                    <span>{cvFile ? cvFile.name : 'Click to select or drag and drop'}</span>
                    <small>Supported formats: PDF, DOCX (Max 5MB)</small>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-submit-app btn-primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ApplyJob;
