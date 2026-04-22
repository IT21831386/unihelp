import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AreaLayoutEditor from '../components/AreaLayoutEditor';
import { QRCodeSVG } from '../../node_modules/qrcode.react/lib/esm/index.js';
import toast from 'react-hot-toast';
import { 
  Users, 
  Home as HomeIcon, 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  ExternalLink,
  PlusCircle,
  Layout,
  Map,
  Building,
  Shield,
  ShoppingCart
} from 'lucide-react';
import './Dashboard.css';

// Import modular tab components
import StudentsTab from '../components/dashboard/StudentsTab';
import BoardingsTab from '../components/dashboard/BoardingsTab';
import AdminsTab from '../components/dashboard/AdminsTab';
import JobsTab from '../components/dashboard/JobsTab';
import ApplicationsTab from '../components/dashboard/ApplicationsTab';
import CompaniesTab from '../components/dashboard/CompaniesTab';
import AreasTab from '../components/dashboard/AreasTab';
import MarketplaceTab from '../components/dashboard/MarketplaceTab';
import SavedItemsTab from '../components/dashboard/SavedItemsTab';
import BookingsTab from '../components/dashboard/BookingsTab';
import ReceivedBoardingBookings from '../components/dashboard/ReceivedBoardingBookings';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [areas, setAreas] = useState([]);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newAreaLabel, setNewAreaLabel] = useState('');
  const [myBookings, setMyBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [appJobFilter, setAppJobFilter] = useState('');
  
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [savedMarketplaceItems, setSavedMarketplaceItems] = useState([]);
  const [editingMarketplaceItem, setEditingMarketplaceItem] = useState(null);
  const [viewingMarketplaceItem, setViewingMarketplaceItem] = useState(null);
  const [newAreaId, setNewAreaId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [boardings, setBoardings] = useState([]);
  const [boardingBookings, setBoardingBookings] = useState([]);
  const [receivedBoardingBookings, setReceivedBoardingBookings] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]); // Track which items are currently being deleted

  const navigate = useNavigate();
  const location = useLocation();

  // Authentication & Role check
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login?redirect=/dashboard');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setCurrentUser(parsedUser);

    // Initial tab based on role or query param
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab');
    
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      if (parsedUser.role === 'user') {
        setActiveTab('bookings');
      }
      if (parsedUser.role === 'employer') {
        setActiveTab('jobs');
      }
    }
  }, [navigate, location.search]);

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
          // Fetch Boardings for Admin
          const boardingsRes = await fetch('http://localhost:5000/api/boardings');
          if (boardingsRes.ok) {
            const boardingsData = await boardingsRes.json();
            if (boardingsData.success) {
              setBoardings(boardingsData.data || []);
            }
          }
        }

          const marketplaceRes = await fetch('http://localhost:5000/api/marketplace');
          if (marketplaceRes.ok) {
            const marketplaceData = await marketplaceRes.json();
            setMarketplaceItems(Array.isArray(marketplaceData.items) ? marketplaceData.items : []);
          }
        if (currentUser.role === 'user') {
          const bookingsRes = await fetch(`http://localhost:5000/api/bookings?user=${currentUser.id}`);
          if (bookingsRes.ok) {
             const bookingsData = await bookingsRes.json();
             setMyBookings(Array.isArray(bookingsData) ? bookingsData : []);
          }

          // Fetch saved marketplace items
          const savedRes = await fetch(`http://localhost:5000/api/marketplace/saved/${currentUser.id || currentUser._id}`);
          if (savedRes.ok) {
            const savedData = await savedRes.json();
            setSavedMarketplaceItems(Array.isArray(savedData.items) ? savedData.items : []);
          }

          // Fetch boarding bookings
          const bbRes = await fetch(`http://localhost:5000/api/boarding-bookings/my-bookings/${currentUser.id || currentUser._id}`);
          if (bbRes.ok) {
            const bbData = await bbRes.json();
            setBoardingBookings(Array.isArray(bbData.data) ? bbData.data : []);
          }

          // Fetch received bookings for owner
          const rbbRes = await fetch(`http://localhost:5000/api/boarding-bookings/owner/${currentUser.email}`);
          if (rbbRes.ok) {
            const rbbData = await rbbRes.json();
            setReceivedBoardingBookings(Array.isArray(rbbData.data) ? rbbData.data : []);
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
          // Both Employers and Admins now only see applications for jobs they specifically posted
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

  const handleDeleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u._id !== userId));
  };

  if (!currentUser) return null;

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
    setDeletingIds(prev => [...prev, jobId]);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
        toast.success('Job posting deleted successfully');
      } else {
        toast.error('Failed to delete job');
      }
    } catch (e) { 
      toast.error('Network error. Failed to delete job.'); 
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== jobId));
    }
  };

  const handleUpdateJob = async (updatedJob) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${updatedJob._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedJob, salary: Number(updatedJob.salary) })
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j._id === updated._id ? updated : j));
        toast.success('Job updated successfully!');
        return true;
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to update job');
        return false;
      }
    } catch (e) { 
      toast.error('Network error. Failed to update job.'); 
      return false;
    }
  };

  const handleDeleteApp = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/job-applications/${appId}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications(prev => prev.filter(a => a._id !== appId));
        toast.success('Application withdrawn successfully');
      } else {
        toast.error('Failed to delete application');
      }
    } catch (e) { 
      toast.error('Network error. Failed to withdraw application.'); 
    }
  };

  const handleUpdateApp = async (updatedApp) => {
    try {
      const payload = new FormData();
      payload.append('fullName', updatedApp.fullName);
      payload.append('email', updatedApp.email);
      payload.append('phone', updatedApp.phone);
      if (updatedApp.newCvFile) {
        payload.append('cvFile', updatedApp.newCvFile);
      }
      const res = await fetch(`http://localhost:5000/api/job-applications/${updatedApp._id}`, {
        method: 'PUT',
        body: payload
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a._id === updated._id ? { ...a, ...updated } : a));
        toast.success('Application updated successfully!');
        return true;
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to update application');
        return false;
      }
    } catch (e) { 
      toast.error('Network error. Failed to update application.'); 
      return false;
    }
  };

  const handleDeleteBoarding = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    setDeletingIds(prev => [...prev, id]);
    try {
      const res = await fetch(`http://localhost:5000/api/boardings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBoardings(prev => prev.filter(b => (b._id || b.id) !== id));
        toast.success('Boarding place deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete boarding');
      }
    } catch (e) {
      toast.error('Network error. Failed to delete boarding.');
    } finally {
      setDeletingIds(prev => prev.filter(idd => idd !== id));
    }
  };
  
  const StatsOverview = () => {
    const stats = [
      { label: 'Students', value: students.length, icon: <Users />, class: 'students' },
      { label: 'Boardings', value: boardings.length, icon: <HomeIcon />, class: 'boardings' },
      { label: 'Jobs', value: jobs.length, icon: <Briefcase />, class: 'jobs' },
      { label: 'Applications', value: applications.length, icon: <FileText />, class: 'apps' },
    ];

    if (currentUser.role !== 'admin') return null;

    return (
      <div className="dashboard-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.class}`}>
            <div className="stat-icon-wrapper">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
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

  const handleDeleteMarketplaceItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this marketplace item?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/marketplace/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        setMarketplaceItems(prev => prev.filter(item => item._id !== itemId));
      } else {
        alert('Failed to delete item');
      }
    } catch (e) {
      alert('Network error');
    }
  };

  const handleUpdateMarketplaceItem = async (updatedItem) => {
    try {
      const res = await fetch(`http://localhost:5000/api/marketplace/${updatedItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (res.ok) {
        const data = await res.json();
        const item = data.item || data;
        setMarketplaceItems(prev => prev.map(i => i._id === item._id ? item : i));
        toast.success('Item updated successfully');
        return true;
      } else {
        const errData = await res.json();
        toast.error(errData.message || 'Failed to update item');
        return false;
      }
    } catch (e) {
      toast.error('Network error');
      return false;
    }
  };

  const handleUnsaveMarketplaceItem = async (itemId) => {
    if (!window.confirm('Remove from saved items?')) return;
    try {
      const res = await fetch('http://localhost:5000/api/marketplace/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id || currentUser._id, itemId: itemId })
      });
      if (res.ok) {
        setSavedMarketplaceItems(prev => prev.filter(i => i._id !== itemId));
        toast.success('Item removed from saved');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (e) { 
      toast.error('Error updating saved items'); 
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setMyBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
        toast.success('Booking cancelled successfully');
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (e) {
      toast.error('Network error');
    }
  };

  const handleCancelBoardingBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this boarding booking?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/boarding-bookings/${bookingId}/cancel`, {
        method: 'PATCH'
      });
      if (res.ok) {
        setBoardingBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'Cancelled' } : b));
        toast.success('Boarding booking cancelled');
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (e) {
      toast.error('Network error');
    }
  };

  const handleUpdateBoardingBookingStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/boarding-bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setReceivedBoardingBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        toast.success(`Booking ${newStatus.toLowerCase()}!`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (e) {
      toast.error('Network error');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'students':
        return <StudentsTab students={students} formatDate={formatDate} onDeleteUser={handleDeleteUser} />;
      case 'boardings':
        return <BoardingsTab boardings={boardings} navigate={navigate} handleDeleteBoarding={handleDeleteBoarding} deletingIds={deletingIds} />;
      case 'admins':
        return <AdminsTab admins={admins} formatDate={formatDate} />;
      case 'jobs':
        return <JobsTab jobs={jobs} currentUser={currentUser} formatDate={formatDate} onDeleteJob={handleDeleteJob} onUpdateJob={handleUpdateJob} />;
      case 'applications':
        return <ApplicationsTab applications={applications} currentUser={currentUser} formatDate={formatDate} jobs={jobs} onUpdateAppStatus={handleUpdateAppStatus} onDeleteApp={handleDeleteApp} onUpdateApp={handleUpdateApp} />;
      case 'companies':
        return <CompaniesTab companies={companies} formatDate={formatDate} />;
      case 'areas':
        return <AreasTab areas={areas} selectedAreaId={selectedAreaId} setSelectedAreaId={setSelectedAreaId} isAddingArea={isAddingArea} setIsAddingArea={setIsAddingArea} newAreaLabel={newAreaLabel} setNewAreaLabel={setNewAreaLabel} newAreaId={newAreaId} setNewAreaId={setNewAreaId} setAreas={setAreas} toast={toast} />;
      case 'bookings':
        return <BookingsTab 
          myBookings={myBookings} 
          boardingBookings={boardingBookings}
          formatDate={formatDate} 
          currentUser={currentUser} 
          onCancelBooking={handleCancelBooking} 
          onCancelBoardingBooking={handleCancelBoardingBooking}
        />;
      case 'received-bookings':
        return <ReceivedBoardingBookings 
          bookings={receivedBoardingBookings} 
          onUpdateStatus={handleUpdateBoardingBookingStatus}
          formatDate={formatDate}
        />;
      case 'marketplace':
        return <MarketplaceTab marketplaceItems={marketplaceItems} onDeleteItem={handleDeleteMarketplaceItem} onUpdateItem={handleUpdateMarketplaceItem} formatDate={formatDate} />;
      case 'saved-items':
        return <SavedItemsTab savedMarketplaceItems={savedMarketplaceItems} onUnsaveItem={handleUnsaveMarketplaceItem} currentUser={currentUser} />;
      default:
        return (
          <div className="dashboard-empty-state">
            <h3>Select a tab to view details</h3>
          </div>
        );
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


            {/* Student View */}
            {currentUser.role === 'user' && (
              <>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'bookings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <span className="nav-icon">📅</span> My Bookings
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  <span className="nav-icon">📄</span> My Applications
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'saved-items' ? 'active' : ''}`}
                  onClick={() => setActiveTab('saved-items')}
                >
                  <span className="nav-icon">🔖</span> Saved Items
                </button>
              </>
            )}

            {/* Employer View */}
            {currentUser.role === 'employer' && (
              <>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  <span className="nav-icon">💼</span> My Jobs
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  <span className="nav-icon">📄</span> Applications
                </button>
              </>
            )}

            {/* Admin View */}
            {currentUser.role === 'admin' && (
              <>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'students' ? 'active' : ''}`}
                  onClick={() => setActiveTab('students')}
                >
                  <span className="nav-icon">🎓</span> Students
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'boardings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('boardings')}
                >
                  <span className="nav-icon">🏠</span> Boarding Places
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  <span className="nav-icon">📄</span> Applications
                </button>
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('jobs')}
                >
                  <span className="nav-icon">💼</span> Jobs
                </button>
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
                <button 
                  className={`dashboard-nav__btn ${activeTab === 'marketplace' ? 'active' : ''}`}
                  onClick={() => setActiveTab('marketplace')}
                >
                  <span className="nav-icon">🛒</span> Marketplace
                </button>
              </>
            )}

            {/* Property Owner Bookings (Show if admin or if they have received bookings) */}
            {(currentUser.role === 'admin' || receivedBoardingBookings.length > 0) && (
              <button 
                className={`dashboard-nav__btn ${activeTab === 'received-bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('received-bookings')}
              >
                <span className="nav-icon">📩</span> Property Bookings
              </button>
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
