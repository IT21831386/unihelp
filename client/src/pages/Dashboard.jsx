import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  // Authentication & Role check
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login?redirect=/dashboard');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setCurrentUser(parsedUser);

    // Kick out regular students entirely from dashboard access
    if (parsedUser.role === 'user') {
      navigate('/');
    }

    // Default tab for employers is jobs
    if (parsedUser.role === 'employer') {
      setActiveTab('jobs');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setLoading(true);
      setError('');
      try {
        // Only admins need to fetch the users list
        if (currentUser.role === 'admin') {
          const usersRes = await fetch('http://localhost:5000/api/auth/users');
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
          }
        }

        // Fetch jobs for both admin and employer
        const jobsRes = await fetch('http://localhost:5000/api/jobs');
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          let allJobs = Array.isArray(jobsData) ? jobsData : [];
          // If employer, filter jobs to only showcase their own
          if (currentUser.role === 'employer') {
             allJobs = allJobs.filter(job => job.contactEmail === currentUser.email);
          }
          setJobs(allJobs);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Check your connection to the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  // Extract Data
  const students = users.filter(user => user.role === 'user');
  const admins = users.filter(user => user.role === 'admin');
  
  // Calculate unique companies from jobs
  const companiesMap = {};
  jobs.forEach(job => {
    if (companiesMap[job.company]) {
      companiesMap[job.company].jobCount += 1;
    } else {
      companiesMap[job.company] = {
        name: job.company,
        jobCount: 1,
        latestJob: job.createdAt
      };
    }
  });
  const companies = Object.values(companiesMap).sort((a, b) => b.jobCount - a.jobCount);

  if (!currentUser) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="dashboard-loading">
          <div className="dashboard-spinner" />
          <p>Loading your data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="dashboard-error">
          <span className="dashboard-error-icon">⚠️</span>
          {error}
        </div>
      );
    }

    switch (activeTab) {
      case 'students':
        if (currentUser.role !== 'admin') return null;
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Registered Students</h2>
              <span className="dashboard-badge">{students.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan="4" className="empty-row">No students found</td></tr>
                  ) : (
                    students.map(student => (
                      <tr key={student._id}>
                        <td><strong>{student.name}</strong></td>
                        <td>{student.email}</td>
                        <td><span className="role-tag role-student">Student</span></td>
                        <td>{formatDate(student.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'admins':
        if (currentUser.role !== 'admin') return null;
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Administrators</h2>
              <span className="dashboard-badge">{admins.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr><td colSpan="4" className="empty-row">No administrators found</td></tr>
                  ) : (
                    admins.map(admin => (
                      <tr key={admin._id}>
                        <td><strong>{admin.name}</strong></td>
                        <td>{admin.email}</td>
                        <td><span className="role-tag" style={{ background: 'rgba(255, 107, 53, 0.1)', color: 'var(--color-accent)' }}>Admin</span></td>
                        <td>{formatDate(admin.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>{currentUser.role === 'employer' ? 'Your Job Postings' : 'Job Opportunities'}</h2>
              <span className="dashboard-badge">{jobs.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Level</th>
                    <th>Date Posted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No jobs found</td></tr>
                  ) : (
                    jobs.map(job => (
                      <tr key={job._id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{job.company}</td>
                        <td><span className="level-tag">{job.level}</span></td>
                        <td>{formatDate(job.createdAt)}</td>
                        <td>
                          <Link to={`/careers/job/${job._id}`} className="dashboard-link">View</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'companies':
        if (currentUser.role !== 'admin') return null;
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Associated Companies</h2>
              <span className="dashboard-badge">{companies.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Active Job Listings</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr><td colSpan="3" className="empty-row">No companies found</td></tr>
                  ) : (
                    companies.map((company, index) => (
                      <tr key={index}>
                        <td><strong>{company.name}</strong></td>
                        <td>{company.jobCount} jobs</td>
                        <td>{formatDate(company.latestJob)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      
      <div className="dashboard-layout container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__header">
            <h3>Dashboard</h3>
          </div>
          <nav className="dashboard-nav">
            {currentUser.role === 'admin' && (
              <button 
                className={`dashboard-nav__btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <span className="nav-icon">🎓</span> Students
              </button>
            )}
            
            <button 
              className={`dashboard-nav__btn ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <span className="nav-icon">💼</span> {currentUser.role === 'employer' ? 'My Jobs' : 'Jobs'}
            </button>
            
            {currentUser.role === 'admin' && (
              <>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'companies' ? 'active' : ''}`}
                  onClick={() => setActiveTab('companies')}
                >
                  <span className="nav-icon">🏢</span> Companies
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'admins' ? 'active' : ''}`}
                  onClick={() => setActiveTab('admins')}
                >
                  <span className="nav-icon">🛡️</span> Admins
                </button>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
