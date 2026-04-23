import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ViewJob.css';

const LEVEL_LABELS = {
  internship: 'Internship',
  entry: 'Entry Level',
  'mid-senior': 'Mid-Senior',
  senior: 'Senior',
};

const MODALITY_LABELS = {
  remote: 'Remote',
  'on-site': 'On-Site',
  hybrid: 'Hybrid',
};

const LOCATION_LABELS = {
  colombo: 'Colombo',
  kandy: 'Kandy',
  galle: 'Galle',
  remote: 'Remote',
};

function ViewJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const data = await res.json();
        
        if (res.ok) {
          // Both `data` and `data.job` handlers depending on controller response structure
          setJob(data.job || data);
        } else {
          setError(data.message || 'Job not found');
        }
      } catch {
        setError('Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const formatSalary = (val) => {
    return Number(val).toLocaleString() + ' LKR';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <>
        <Navbar />
      
      {/* Aurora glow layer */}
      <div className="vj-bg-aurora" aria-hidden="true">
        <div className="vj-aurora-blob vj-aurora-blob-1" />
        <div className="vj-aurora-blob vj-aurora-blob-2" />
        <div className="vj-aurora-blob vj-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="vj-bg-grain" aria-hidden="true" />

      <main className="view-job-loading container">
          <div className="view-job-spinner" />
          <p>Loading job details...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Navbar />
        <div className="view-job-error">
          <div className="view-job-error__content">
            <h2>⚠️ Oops!</h2>
            <p>{error || 'Job not found'}</p>
            <Link to="/careers/find-jobs" className="view-job-back-btn">
              Back to Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="view-job-page-bg">
        {/* Aurora glow layer */}
        <div className="vj-bg-aurora" aria-hidden="true">
          <div className="vj-aurora-blob vj-aurora-blob-1" />
          <div className="vj-aurora-blob vj-aurora-blob-2" />
          <div className="vj-aurora-blob vj-aurora-blob-3" />
        </div>

        {/* Film grain layer */}
        <div className="vj-bg-grain" aria-hidden="true" />

        <div className="container view-job-container">
        {/* Breadcrumb */}
        <nav className="view-job-breadcrumb">
          <Link to="/careers">Job opportunities</Link>
          <span>&gt;</span>
          <Link to="/careers/find-jobs">Find a Job</Link>
          <span>&gt;</span>
          {job.title}
        </nav>

        {/* Header Section */}
        <div className="view-job-header">
          <div className="view-job-header__info">
            <h1 className="view-job-title">{job.title}</h1>
            <p className="view-job-company">{job.company}</p>
            <div className="view-job-tags">
              <span className="view-job-tag">{LEVEL_LABELS[job.level] || job.level}</span>
              <span className="view-job-tag">{MODALITY_LABELS[job.modality] || job.modality}</span>
              <span className="view-job-tag">{LOCATION_LABELS[job.location] || job.location}</span>
            </div>
          </div>
          <div className="view-job-header__actions">
            <div className="view-job-salary">{formatSalary(job.salary)}/Month</div>
            <Link
              to={`/careers/job/${id}/apply`}
              className="view-job-apply-btn"
            >
              Apply Now 🚀
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="view-job-content">
          <div className="view-job-main">
            <h2>Job Description</h2>
            <div className="view-job-description">
              {job.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="view-job-contact">
              <h3>Interested in this role?</h3>
              <p>
                Send your resume to{' '}
                <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
              </p>
              {job.link && (
                <p>
                  Or apply directly:{' '}
                  <a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a>
                </p>
              )}
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <aside className="view-job-sidebar">
            <div className="view-job-meta-card">
              <h3>Job Overview</h3>
              <ul className="view-job-meta-list">
                <li>
                  <strong>Posted on:</strong>
                  <span>{formatDate(job.createdAt)}</span>
                </li>
                <li>
                  <strong>Location:</strong>
                  <span>{LOCATION_LABELS[job.location] || job.location}</span>
                </li>
                <li>
                  <strong>Job Level:</strong>
                  <span>{LEVEL_LABELS[job.level] || job.level}</span>
                </li>
                <li>
                  <strong>Work Type:</strong>
                  <span>{MODALITY_LABELS[job.modality] || job.modality}</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <Footer />
  </>
  );
}

export default ViewJob;
