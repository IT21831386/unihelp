import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AreaLayoutEditor from '../components/AreaLayoutEditor';
import { QRCodeSVG } from 'qrcode.react';
import './Dashboard.css';

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
  const [newAreaId, setNewAreaId] = useState('');
  const [myBookings, setMyBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
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
               allJobs = allJobs.filter(job => job.contactEmail === currentUser.email);
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

      case 'applications':
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>{currentUser.role === 'user' ? 'My Sent Applications' : 'Job Applications'}</h2>
              <span className="dashboard-badge">{applications.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Job Title</th>
                    <th>Contact</th>
                    <th>Applied On</th>
                    <th>CV / Resume</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No applications received yet.</td></tr>
                  ) : (
                    applications.map(app => (
                      <tr key={app._id}>
                        <td><strong>{app.fullName}</strong></td>
                        <td>{app.jobId ? app.jobId.title : 'Deleted Job'}</td>
                        <td>
                          <a href={`mailto:${app.email}`} className="dashboard-link">{app.email}</a><br/>
                          <small>{app.phone}</small>
                        </td>
                        <td>{formatDate(app.createdAt)}</td>
                        <td>
                          <a 
                            href={`http://localhost:5000/${app.cvFilePath.replace(/\\/g, '/')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-block', borderRadius: '4px', textDecoration: 'none' }}
                          >
                            View CV
                          </a>
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

      case 'areas':
        if (currentUser.role !== 'admin') return null;
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Area Layout Configurations</h2>
            </div>
            <div className="areas-admin-list" style={{ padding: '20px' }}>
              <p>Select an area below to view and edit its layout configuration.</p>
              
              <div className="dashboard-area-tabs" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
                 {areas.map(area => (
                   <button 
                     key={area.categoryId} 
                     className="dashboard-nav__btn"
                     style={{
                       background: selectedAreaId === area.categoryId ? 'var(--color-primary)' : '#f8f9fa',
                       color: selectedAreaId === area.categoryId ? '#fff' : '#333'
                     }}
                     onClick={() => setSelectedAreaId(area.categoryId)}
                   >
                     {area.label}
                   </button>
                 ))}
                 <button 
                   className="dashboard-nav__btn" 
                   style={{ background: '#28a745', color: '#fff', fontWeight: 'bold' }}
                   onClick={() => setIsAddingArea(true)}
                 >
                   + Add Area
                 </button>
              </div>

              {isAddingArea && (
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#fdfdfd' }}>
                  <h3 style={{ marginBottom: '15px' }}>Create New Area</h3>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                       <label style={{display: 'block', fontSize: '13px', marginBottom: '5px'}}>Area Name (Label)</label>
                       <input 
                         value={newAreaLabel} 
                         onChange={e => {
                            setNewAreaLabel(e.target.value);
                            setNewAreaId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                         }}
                         placeholder="e.g. Roof Deck"
                         style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                       />
                    </div>
                    <div style={{ flex: 1 }}>
                       <label style={{display: 'block', fontSize: '13px', marginBottom: '5px'}}>Area ID (No spaces)</label>
                       <input 
                         value={newAreaId} 
                         onChange={e => setNewAreaId(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                         placeholder="e.g. roof-deck"
                         style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                       />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={async () => {
                        if (!newAreaId || !newAreaLabel) return alert('Fill out both fields');
                        if (areas.find(a => a.categoryId === newAreaId)) return alert('Area ID already exists!');
                        try {
                          const res = await fetch(`http://localhost:5000/api/areas/${newAreaId}`, {
                             method: 'PUT',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({ label: newAreaLabel, layoutConfig: { left: [], right: [] } })
                          });
                          if (res.ok) {
                             const created = await res.json();
                             setAreas([...areas, created]);
                             setSelectedAreaId(created.categoryId);
                             setIsAddingArea(false);
                             setNewAreaLabel('');
                             setNewAreaId('');
                          } else {
                             alert('Failed to add area');
                          }
                        } catch(e) { alert(e.message) }
                      }}
                      style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Create
                    </button>
                    <button 
                      onClick={() => setIsAddingArea(false)}
                      style={{ padding: '8px 15px', background: '#e1e4e8', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {selectedAreaId && (() => {
                 const area = areas.find(a => a.categoryId === selectedAreaId);
                 if (!area) return null;
                 return (
                   <div key={area.categoryId} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                     <h3>{area.label} Block Editor</h3>
                     <p style={{fontSize: '13px', color: '#666', marginBottom: '10px'}}>Add or remove tables entirely, and list the seat labels within each row to form the room geometry.</p>
                     
                     <AreaLayoutEditor 
                       initialConfig={area.layoutConfig}
                       onSave={async (newLayoutConfig) => {
                         try {
                           const res = await fetch(`http://localhost:5000/api/areas/${area.categoryId}`, {
                             method: 'PUT',
                             headers: { 'Content-Type': 'application/json' },
                             body: JSON.stringify({ layoutConfig: newLayoutConfig })
                           });
                           if (res.ok) alert('Saved successfully!');
                           else alert('Failed to save configuration');
                         } catch(e) {
                           alert('Failed to save! ' + e.message);
                         }
                       }}
                     />
                   </div>
                 );
              })()}
            </div>
          </div>
        );

      case 'bookings':
        if (currentUser.role !== 'user') return null;
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>My Booked Seats</h2>
              <span className="dashboard-badge">{myBookings.length} Total</span>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>QR Code</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Area ID</th>
                    <th>Seats</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myBookings.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No bookings found</td></tr>
                  ) : (
                    myBookings.map(booking => {
                      const bookingEnd = new Date(`${booking.date}T${booking.endTime || '23:59'}`);
                      const isExpired = bookingEnd < new Date();
                      const to12h = (t) => {
                        if (!t) return '';
                        const [h, m] = t.split(':');
                        const hr = parseInt(h, 10);
                        const ampm = hr >= 12 ? 'PM' : 'AM';
                        return `${hr % 12 || 12}:${m} ${ampm}`;
                      };
                      return (
                        <tr key={booking._id}>
                          <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedBooking({ ...booking, isExpired, to12h })} title="View QR">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                              <rect x="14" y="14" width="3" height="3" />
                              <line x1="21" y1="14" x2="21" y2="21" />
                              <line x1="14" y1="21" x2="21" y2="21" />
                            </svg>
                          </td>
                          <td><strong>{formatDate(booking.date)}</strong></td>
                          <td>{to12h(booking.time)}{booking.endTime ? ` - ${to12h(booking.endTime)}` : ''}</td>
                          <td><span className="level-tag" style={{textTransform: 'capitalize'}}>{booking.area}</span></td>
                          <td>{booking.seats.join(', ')}</td>
                          <td>
                            <span className="role-tag" style={{ 
                              background: isExpired ? '#e2e3e5' : '#d4edda', 
                              color: isExpired ? '#383d41' : '#155724' 
                            }}>
                              {isExpired ? 'Completed' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {selectedBooking && (
              <div onClick={() => setSelectedBooking(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ marginBottom: '5px', color: '#24292e' }}>Booking QR Code</h3>
                  <p style={{ fontSize: '13px', color: '#586069', marginBottom: '20px' }}>Scan with your phone camera</p>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    <QRCodeSVG
                      value={`UniHelp Booking\nStudent: ${currentUser?.name || 'N/A'}\nArea: ${selectedBooking.area}\nDate: ${selectedBooking.date}\nTime: ${selectedBooking.to12h(selectedBooking.time)} - ${selectedBooking.to12h(selectedBooking.endTime)}\nSeats: ${selectedBooking.seats.join(', ')}\nStatus: ${selectedBooking.isExpired ? 'Completed' : 'Active'}`}
                      size={200}
                      level="M"
                    />
                  </div>
                  <div style={{ marginTop: '20px', fontSize: '14px', textAlign: 'left', background: '#f6f8fa', padding: '12px', borderRadius: '8px', lineHeight: '1.8' }}>
                    <div><strong>Student:</strong> {currentUser?.name}</div>
                    <div><strong>Area:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedBooking.area}</span></div>
                    <div><strong>Date:</strong> {formatDate(selectedBooking.date)}</div>
                    <div><strong>Time:</strong> {selectedBooking.to12h(selectedBooking.time)} - {selectedBooking.to12h(selectedBooking.endTime)}</div>
                    <div><strong>Seats:</strong> {selectedBooking.seats.join(', ')}</div>
                    <div><strong>Status:</strong> {selectedBooking.isExpired ? 'Completed' : 'Active'}</div>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} style={{ marginTop: '20px', padding: '10px 30px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Close</button>
                </div>
              </div>
            )}
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

            <button 
              className={`dashboard-nav__btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <span className="nav-icon">&#128221;</span> {currentUser.role === 'user' ? 'My Applications' : 'Applications'}
            </button>
            
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
