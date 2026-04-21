import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StudentsTab from '../components/dashboard/StudentsTab';
import AdminsTab from '../components/dashboard/AdminsTab';
import JobsTab from '../components/dashboard/JobsTab';
import ApplicationsTab from '../components/dashboard/ApplicationsTab';
import CompaniesTab from '../components/dashboard/CompaniesTab';
import AreasTab from '../components/dashboard/AreasTab';
import BookingsTab from '../components/dashboard/BookingsTab';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [areas, setAreas] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
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

    if (parsedUser.role === 'user') {
      setActiveTab('bookings');
    }

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
        // Only admins need to fetch the users and areas lists
        if (currentUser.role === 'admin') {
          const [usersRes, areasRes] = await Promise.all([
            fetch('http://localhost:5000/api/auth/users'),
            fetch('http://localhost:5000/api/areas')
          ]);
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(Array.isArray(usersData) ? usersData : []);
          }
          if (areasRes.ok) {
            const areasData = await areasRes.json();
            setAreas(Array.isArray(areasData) ? areasData : []);
          }
        }

        if (currentUser.role === 'user') {
          const bookingsRes = await fetch(`http://localhost:5000/api/bookings?user=${currentUser.id}`);
          if (bookingsRes.ok) {
             const bookingsData = await bookingsRes.json();
             setMyBookings(Array.isArray(bookingsData) ? bookingsData : []);
          }
        }

        // Fetch jobs for both admin and employer
        if (currentUser.role === 'admin' || currentUser.role === 'employer') {
          const jobsRes = await fetch('http://localhost:5000/api/jobs');
          if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            let allJobs = Array.isArray(jobsData) ? jobsData : [];
            if (currentUser.role === 'employer') {
               allJobs = allJobs.filter(job => job.postedByEmail === currentUser.email);
            }
            setJobs(allJobs);
          }
        }

        // Fetch Job Applications
        let applicationsUrl = 'http://localhost:5000/api/job-applications';
        if (currentUser.role !== 'user') {
          applicationsUrl += `?employerEmail=${currentUser.email}`;
        } else if (currentUser.role === 'user') {
          applicationsUrl += `?applicantId=${currentUser.id || currentUser._id}&applicantEmail=${currentUser.email}`;
        }
        
        const appsRes = await fetch(applicationsUrl);
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          setApplications(Array.isArray(appsData) ? appsData : []);
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

  // --- Handlers passed to child components ---

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) setJobs(prev => prev.filter(j => j._id !== jobId));
      else alert('Failed to delete job');
    } catch (e) { alert('Network error'); }
  };

  const handleUpdateJob = async (editingJob) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingJob, salary: Number(editingJob.salary) })
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j._id === updated._id ? updated : j));
        return true;
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update job');
        return false;
      }
    } catch (e) { alert('Network error'); return false; }
  };

  const handleDeleteApp = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/job-applications/${appId}`, { method: 'DELETE' });
      if (res.ok) setApplications(prev => prev.filter(a => a._id !== appId));
      else alert('Failed to delete application');
    } catch (e) { alert('Network error'); }
  };

  const handleUpdateApp = async (editingApp) => {
    try {
      const payload = new FormData();
      payload.append('fullName', editingApp.fullName);
      payload.append('email', editingApp.email);
      payload.append('phone', editingApp.phone);
      if (editingApp.newCvFile) {
        payload.append('cvFile', editingApp.newCvFile);
      }
      const res = await fetch(`http://localhost:5000/api/job-applications/${editingApp._id}`, {
        method: 'PUT',
        body: payload
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a._id === updated._id ? { ...a, ...updated } : a));
        return true;
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update application');
        return false;
      }
    } catch (e) { alert('Network error'); return false; }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/job-applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setApplications(applications.map(app => 
          app._id === appId ? { ...app, status: newStatus } : app
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error updating application status');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, { method: 'PATCH' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Failed to cancel booking');
        return;
      }
      setMyBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Error cancelling booking: ' + err.message);
    }
  };

  // --- Render content based on active tab ---

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
        return <StudentsTab students={students} formatDate={formatDate} onDeleteUser={(id) => setUsers(prev => prev.filter(u => u._id !== id))} />;

      case 'admins':
        if (currentUser.role !== 'admin') return null;
        return <AdminsTab admins={admins} formatDate={formatDate} />;

      case 'jobs':
        return <JobsTab jobs={jobs} currentUser={currentUser} formatDate={formatDate} onDeleteJob={handleDeleteJob} onUpdateJob={handleUpdateJob} />;

      case 'applications':
        return <ApplicationsTab applications={applications} currentUser={currentUser} formatDate={formatDate} onDeleteApp={handleDeleteApp} onUpdateApp={handleUpdateApp} onUpdateAppStatus={handleUpdateAppStatus} />;

      case 'companies':
        if (currentUser.role !== 'admin') return null;
        return <CompaniesTab companies={companies} formatDate={formatDate} />;

      case 'areas':
        if (currentUser.role !== 'admin') return null;
        return <AreasTab areas={areas} onAreasChange={setAreas} />;

      case 'bookings':
        if (currentUser.role !== 'user') return null;
        return <BookingsTab myBookings={myBookings} currentUser={currentUser} formatDate={formatDate} onCancelBooking={handleCancelBooking} />;

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Aurora glow layer */}
      <div className="db-bg-aurora" aria-hidden="true">
        <div className="db-aurora-blob db-aurora-blob-1" />
        <div className="db-aurora-blob db-aurora-blob-2" />
        <div className="db-aurora-blob db-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="db-bg-grain" aria-hidden="true" />

      <Navbar />
      
      <div className="dashboard-layout container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar__header">
            <h3>Dashboard</h3>
          </div>
          <nav className="dashboard-nav">
            {currentUser.role === 'user' && (
              <button 
                className={`dashboard-nav__btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <span className="nav-icon">📅</span> My Bookings
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button 
                className={`dashboard-nav__btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                  <span className="nav-icon">🎓</span> Students
              </button>
            )}

            {currentUser.role !== 'admin' && (
              <button 
                className={`dashboard-nav__btn ${activeTab === 'applications' ? 'active' : ''}`}
                onClick={() => setActiveTab('applications')}
              >
                <span className="nav-icon">&#128221;</span> {currentUser.role === 'user' ? 'My Applications' : 'Applications'}
              </button>
            )}
            
            {currentUser.role !== 'user' && (
              <>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  <span className="nav-icon">&#128188;</span> {currentUser.role === 'employer' ? 'My Jobs' : 'Jobs'}
                </button>
              </>
            )}
            
            {currentUser.role === 'admin' && (
              <>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'companies' ? 'active' : ''}`}
                  onClick={() => setActiveTab('companies')}
                >
                  <span className="nav-icon">🏢</span> Companies
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'areas' ? 'active' : ''}`}
                  onClick={() => setActiveTab('areas')}
                >
                  <span className="nav-icon">🗺️</span> Layouts
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
