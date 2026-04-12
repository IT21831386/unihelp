import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AreaLayoutEditor from '../components/AreaLayoutEditor';
import { QRCodeCanvas } from '../../node_modules/qrcode.react/lib/esm/index.js';
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
  const [myBookings, setMyBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [jobSearchTerm, setJobSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [appJobFilter, setAppJobFilter] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [bookingFilterArea, setBookingFilterArea] = useState('all');
  const [bookingSort, setBookingSort] = useState('newest');  
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

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, { method: 'DELETE' });
      if (res.ok) setJobs(prev => prev.filter(j => j._id !== jobId));
      else alert('Failed to delete job');
    } catch (e) { alert('Network error'); }
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${editingJob._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingJob, salary: Number(editingJob.salary) })
      });
      if (res.ok) {
        const updated = await res.json();
        setJobs(prev => prev.map(j => j._id === updated._id ? updated : j));
        setEditingJob(null);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update job');
      }
    } catch (e) { alert('Network error'); }
  };

  const handleDeleteApp = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/job-applications/${appId}`, { method: 'DELETE' });
      if (res.ok) setApplications(prev => prev.filter(a => a._id !== appId));
      else alert('Failed to delete application');
    } catch (e) { alert('Network error'); }
  };

  const handleUpdateApp = async (e) => {
    e.preventDefault();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,5}[-\s\.]?[0-9]{4,6}$/;
    if (editingApp.fullName.trim().length < 3) { alert('Full name must be at least 3 characters.'); return; }
    if (!EMAIL_REGEX.test(editingApp.email)) { alert('Enter a valid email address.'); return; }
    if (!PHONE_REGEX.test(editingApp.phone.trim())) { alert('Enter a valid phone number.'); return; }
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
        setEditingApp(null);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to update application');
      }
    } catch (e) { alert('Network error'); }
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
        
        const filteredStudents = students.filter(student => 
          student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || 
          student.email.toLowerCase().includes(studentSearchTerm.toLowerCase())
        );

        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Registered Students</h2>
              <span className="dashboard-badge">{filteredStudents.length} Total</span>
            </div>
            <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8' }}>
              <input 
                type="text" 
                placeholder="Search students by name or email..." 
                value={studentSearchTerm} 
                onChange={e => setStudentSearchTerm(e.target.value)} 
                style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
              />
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th style={{ minWidth: '200px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No students found matching your search</td></tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student._id}>
                        <td><strong>{student.name}</strong></td>
                        <td>{student.email}</td>
                        <td><span className="role-tag role-student">Student</span></td>
                        <td>{formatDate(student.createdAt)}</td>
                        <td>
                          <button onClick={() => setSelectedStudent(student)} style={{ padding: '5px 12px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '5px', fontWeight: 'bold' }}>View</button>
                          <button onClick={async () => {
                            if (!window.confirm('Are you sure you want to delete this student?')) return;
                            try {
                              const res = await fetch(`http://localhost:5000/api/auth/users/${student._id}`, { method: 'DELETE' });
                              if (res.ok) {
                                setUsers(prev => prev.filter(u => u._id !== student._id));
                              } else {
                                alert('Failed to delete student');
                              }
                            } catch (e) {
                              alert(e.message);
                            }
                          }} style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {selectedStudent && (
              <div onClick={() => setSelectedStudent(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '350px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 15px' }}>
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 style={{ marginBottom: '5px', color: '#24292e' }}>{selectedStudent.name}</h3>
                  <p style={{ fontSize: '13px', color: '#586069', marginBottom: '20px' }}><span className="role-tag role-student">Student</span></p>
                  
                  <div style={{ textAlign: 'left', background: '#f6f8fa', padding: '15px', borderRadius: '8px', lineHeight: '1.8', fontSize: '14px' }}>
                    <div><strong>Email:</strong> <a href={`mailto:${selectedStudent.email}`} style={{ color: 'var(--color-primary)' }}>{selectedStudent.email}</a></div>
                    <div><strong>Joined:</strong> {formatDate(selectedStudent.createdAt)}</div>
                    <div><strong>Account ID:</strong> <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{selectedStudent._id}</span></div>
                  </div>
                  
                  <button onClick={() => setSelectedStudent(null)} style={{ marginTop: '20px', padding: '10px 30px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', width: '100%' }}>Close</button>
                </div>
              </div>
            )}
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
        const filteredJobs = jobs.filter(job => 
          job.title.toLowerCase().includes(jobSearchTerm.toLowerCase()) || 
          job.company.toLowerCase().includes(jobSearchTerm.toLowerCase())
        );
        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>{currentUser.role === 'employer' ? 'Your Job Postings' : 'Job Opportunities'}</h2>
              <span className="dashboard-badge">{filteredJobs.length} Total</span>
            </div>
            <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8' }}>
              <input 
                type="text" 
                placeholder="Search jobs by Title or Company..." 
                value={jobSearchTerm} 
                onChange={e => setJobSearchTerm(e.target.value)} 
                style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
              />
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
                  {filteredJobs.length === 0 ? (
                    <tr><td colSpan="5" className="empty-row">No jobs found matching your search</td></tr>
                  ) : (
                    filteredJobs.map(job => (
                      <tr key={job._id}>
                        <td><strong>{job.title}</strong></td>
                        <td>{job.company}</td>
                        <td><span className="level-tag">{job.level}</span></td>
                        <td>{formatDate(job.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <Link to={`/careers/job/${job._id}`} className="dashboard-link">View</Link>
                            {currentUser.role === 'employer' && (
                              <>
                                <button onClick={() => setEditingJob({...job})} title="Edit" style={{ background: '#0366d6', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onClick={() => handleDeleteJob(job._id)} title="Delete" style={{ background: '#cb2431', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {editingJob && (
              <div onClick={() => setEditingJob(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ marginBottom: '20px', color: '#24292e' }}>Edit Job Posting</h3>
                  <form onSubmit={handleUpdateJob} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Job Title</label>
                      <input type="text" value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required minLength={3} maxLength={100} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Company</label>
                      <input type="text" value={editingJob.company} onChange={e => setEditingJob({...editingJob, company: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required minLength={2} maxLength={100} />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Location</label>
                        <select value={editingJob.location} onChange={e => setEditingJob({...editingJob, location: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required>
                          <option value="colombo">Colombo</option><option value="kandy">Kandy</option><option value="galle">Galle</option><option value="remote">Remote</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Level</label>
                        <select value={editingJob.level} onChange={e => setEditingJob({...editingJob, level: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required>
                          <option value="internship">Internship</option><option value="entry">Entry Level</option><option value="mid-senior">Mid - Senior</option><option value="senior">Senior</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Modality</label>
                        <select value={editingJob.modality} onChange={e => setEditingJob({...editingJob, modality: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required>
                          <option value="remote">Remote</option><option value="on-site">On - Site</option><option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Salary (LKR)</label>
                        <input type="number" value={editingJob.salary} onChange={e => setEditingJob({...editingJob, salary: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required min={1} max={10000000} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
                      <textarea value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} rows={4} required minLength={20} maxLength={5000} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Application Link (Optional)</label>
                      <input type="url" value={editingJob.link || ''} onChange={e => setEditingJob({...editingJob, link: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                      <button type="button" onClick={() => setEditingJob(null)} style={{ padding: '8px 15px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                      <button type="submit" style={{ padding: '8px 15px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'applications':
        const filteredApps = applications.filter(app => {
          const matchesStatus = appStatusFilter ? (app.status || 'Pending') === appStatusFilter : true;
          if (!matchesStatus) return false;
          
          if (currentUser.role === 'employer') {
            const matchesSearch = app.fullName.toLowerCase().includes(appSearchTerm.toLowerCase());
            const matchesJob = appJobFilter ? (app.jobId && app.jobId._id === appJobFilter) : true;
            return matchesSearch && matchesJob;
          } else if (currentUser.role === 'user') {
            if (!appSearchTerm) return true;
            const term = appSearchTerm.toLowerCase();
            const jobTitle = app.jobId ? app.jobId.title.toLowerCase() : '';
            const company = app.jobId ? app.jobId.company.toLowerCase() : '';
            return jobTitle.includes(term) || company.includes(term);
          }
          return true;
        });

        const employerJobs = applications
          .map(app => app.jobId)
          .filter((job, index, self) => job && self.findIndex(j => j._id === job._id) === index);

        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>{currentUser.role === 'user' ? 'My Sent Applications' : 'Job Applications'}</h2>
              <span className="dashboard-badge">{filteredApps.length} Total</span>
            </div>
            
            {currentUser.role === 'employer' && (
              <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search by applicant name..." 
                  value={appSearchTerm} 
                  onChange={e => setAppSearchTerm(e.target.value)} 
                  style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
                />
                <select 
                  value={appJobFilter} 
                  onChange={e => setAppJobFilter(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
                >
                  <option value="">All Jobs</option>
                  {employerJobs.map(job => (
                    <option key={job._id} value={job._id}>{job.title}</option>
                  ))}
                </select>
                <select 
                  value={appStatusFilter} 
                  onChange={e => setAppStatusFilter(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
            
            {currentUser.role === 'user' && (
              <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Search by Job Title or Company..." 
                  value={appSearchTerm} 
                  onChange={e => setAppSearchTerm(e.target.value)} 
                  style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
                />
                <select 
                  value={appStatusFilter} 
                  onChange={e => setAppStatusFilter(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Contact</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>CV / Resume</th>
                    {(currentUser.role === 'user' || currentUser.role === 'employer') && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr><td colSpan={currentUser.role === 'user' ? '7' : '6'} className="empty-row">No applications found.</td></tr>
                  ) : (
                    filteredApps.map(app => (
                      <tr key={app._id}>
                        <td><strong>{app.fullName}</strong></td>
                        <td>{app.jobId ? app.jobId.title : 'Deleted Job'}</td>
                        <td>{app.jobId ? app.jobId.company : 'N/A'}</td>
                        <td>
                          <a href={`mailto:${app.email}`} className="dashboard-link">{app.email}</a><br/>
                          <small>{app.phone}</small>
                        </td>
                        <td>{formatDate(app.createdAt)}</td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <span style={{
                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                            backgroundColor: app.status === 'Accepted' ? '#dcffe4' : app.status === 'Rejected' ? '#ffeef0' : '#fffbdd',
                            color: app.status === 'Accepted' ? '#22863a' : app.status === 'Rejected' ? '#cb2431' : '#b08800'
                          }}>
                            {app.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <a
                            href={`http://localhost:5000/${app.cvFilePath.replace(/\\/g, '/')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-block', borderRadius: '4px', textDecoration: 'none' }}
                          >
                            View
                          </a>
                          {/* <a
                            href={`http://localhost:5000/${app.cvFilePath.replace(/\\/g, '/')}`}
                            download
                            className="btn-primary"
                            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-block', borderRadius: '4px', textDecoration: 'none', background: '#2ea44f' }}
                          >
                            ⬇ Download
                          </a> */}
                        </td>
                        {(currentUser.role === 'user' || currentUser.role === 'employer') && (
                          <td style={{ verticalAlign: 'middle' }}>
                            {currentUser.role === 'user' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setEditingApp({ ...app })} title="Edit" style={{ background: '#0366d6', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button onClick={() => handleDeleteApp(app._id)} title="Withdraw" style={{ background: '#cb2431', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </div>
                            )}
                            {currentUser.role === 'employer' && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleUpdateAppStatus(app._id, 'Accepted')} title="Accept" style={{ background: '#28a745', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Accept</button>
                                <button onClick={() => handleUpdateAppStatus(app._id, 'Rejected')} title="Reject" style={{ background: '#cb2431', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Reject</button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {editingApp && (
              <div onClick={() => setEditingApp(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '420px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ marginBottom: '20px', color: '#24292e' }}>Edit Application</h3>
                  <form onSubmit={handleUpdateApp} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
                      <input type="text" value={editingApp.fullName} onChange={e => setEditingApp({ ...editingApp, fullName: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required minLength={3} maxLength={100} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
                      <input type="email" value={editingApp.email} onChange={e => setEditingApp({ ...editingApp, email: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Phone Number</label>
                      <input type="tel" value={editingApp.phone} onChange={e => setEditingApp({ ...editingApp, phone: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px' }} required placeholder="+94 77 123 4567" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>CV / Resume</label>
                      {editingApp.cvFilePath && (
                        <div style={{ marginBottom: '8px', padding: '8px 12px', background: '#f6f8fa', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>📄</span>
                          <a href={`http://localhost:5000/${editingApp.cvFilePath.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0366d6', fontSize: '13px', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {editingApp.cvFilePath.split(/[/\\]/).pop()}
                          </a>
                          <span style={{ fontSize: '12px', color: '#586069' }}>(current)</span>
                        </div>
                      )}
                      <input type="file" accept=".pdf,.doc,.docx" onChange={e => { if (e.target.files[0]) setEditingApp({ ...editingApp, newCvFile: e.target.files[0] }); }} style={{ width: '100%', padding: '6px', border: '1px solid #d1d5da', borderRadius: '4px', fontSize: '13px' }} />
                      <small style={{ color: '#586069', fontSize: '12px' }}>Upload a new file to replace. PDF, DOC, DOCX (Max 5MB)</small>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
                      <button type="button" onClick={() => setEditingApp(null)} style={{ padding: '8px 15px', background: '#e1e4e8', color: '#24292e', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                      <button type="submit" style={{ padding: '8px 15px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'companies':
        if (currentUser.role !== 'admin') return null;
        
        const filteredCompanies = companies.filter(company => 
          company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
        );

        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>Associated Companies</h2>
              <span className="dashboard-badge">{filteredCompanies.length} Total</span>
            </div>
            <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8' }}>
              <input 
                type="text" 
                placeholder="Search companies by name..." 
                value={companySearchTerm} 
                onChange={e => setCompanySearchTerm(e.target.value)} 
                style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', width: '100%', maxWidth: '400px' }}
              />
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
                  {filteredCompanies.length === 0 ? (
                    <tr><td colSpan="3" className="empty-row">No companies found matching your search</td></tr>
                  ) : (
                    filteredCompanies.map((company, index) => (
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
        
        let displayBookings = [...myBookings];
        
        // Filter by Status
        if (bookingFilterStatus !== 'all') {
          displayBookings = displayBookings.filter(b => {
             const bookingEnd = new Date(`${b.date}T${b.endTime || '23:59'}`);
             const isExpired = bookingEnd < new Date();
             const isCancelled = b.status === 'cancelled';
             if (bookingFilterStatus === 'active') return !isCancelled && !isExpired;
             if (bookingFilterStatus === 'completed') return isExpired && !isCancelled;
             if (bookingFilterStatus === 'cancelled') return isCancelled;
             return true;
          });
        }
        
        // Filter by Area
        if (bookingFilterArea !== 'all') {
          displayBookings = displayBookings.filter(b => b.area === bookingFilterArea);
        }

        // Apply Sort (Backend returns newest first, so we just reverse it if oldest is selected)
        if (bookingSort === 'oldest') {
          displayBookings.reverse();
        }
        
        const uniqueAreas = [...new Set(myBookings.map(b => b.area))];

        return (
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <h2>My Booked Seats</h2>
              <span className="dashboard-badge">{displayBookings.length} Total</span>
            </div>
            <div style={{ padding: '15px', background: '#f6f8fa', borderBottom: '1px solid #e1e4e8', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={bookingFilterStatus} onChange={e => setBookingFilterStatus(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1, minWidth: '150px' }}>
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select value={bookingFilterArea} onChange={e => setBookingFilterArea(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1, minWidth: '150px', textTransform: 'capitalize' }}>
                <option value="all">All Areas</option>
                {uniqueAreas.map(area => <option key={area} value={area}>{area}</option>)}
              </select>
              <select value={bookingSort} onChange={e => setBookingSort(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1, minWidth: '150px' }}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>QR Code</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th style={{ minWidth: '160px' }}>Area ID</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayBookings.length === 0 ? (
                    <tr><td colSpan="7" className="empty-row">No bookings found matching your filters</td></tr>
                  ) : (
                    displayBookings.map(booking => {
                      const bookingEnd = new Date(`${booking.date}T${booking.endTime || '23:59'}`);
                      const isExpired = bookingEnd < new Date();
                      const isCancelled = booking.status === 'cancelled';
                      const to12h = (t) => {
                        if (!t) return '';
                        const [h, m] = t.split(':');
                        const hr = parseInt(h, 10);
                        const ampm = hr >= 12 ? 'PM' : 'AM';
                        return `${hr % 12 || 12}:${m} ${ampm}`;
                      };
                      
                      const getStatusLabel = () => {
                        if (isCancelled) return 'Cancelled';
                        if (isExpired) return 'Completed';
                        return 'Active';
                      };
                      const getStatusStyle = () => {
                        if (isCancelled) return { background: '#f8d7da', color: '#721c24' };
                        if (isExpired) return { background: '#e2e3e5', color: '#383d41' };
                        return { background: '#d4edda', color: '#155724' };
                      };

                      return (
                        <tr key={booking._id} style={isCancelled ? { opacity: 0.65 } : {}}>
                          <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setSelectedBooking({ ...booking, isExpired, isCancelled, to12h, getStatusLabel })} title="View QR">
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
                            <span className="role-tag" style={getStatusStyle()}>
                              {getStatusLabel()}
                            </span>
                          </td>
                          <td>
                            {!isCancelled && !isExpired ? (
                              <button
                                onClick={async () => {
                                  if (!window.confirm('Are you sure you want to cancel this booking?')) return;
                                  try {
                                    const res = await fetch(`http://localhost:5000/api/bookings/${booking._id}/cancel`, { method: 'PATCH' });
                                    if (!res.ok) {
                                      const data = await res.json();
                                      alert(data.message || 'Failed to cancel booking');
                                      return;
                                    }
                                    setMyBookings(prev => prev.map(b => b._id === booking._id ? { ...b, status: 'cancelled' } : b));
                                  } catch (err) {
                                    alert('Error cancelling booking: ' + err.message);
                                  }
                                }}
                                style={{ padding: '5px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                Cancel
                              </button>
                            ) : (
                              <span style={{ color: '#999', fontSize: '12px' }}>—</span>
                            )}
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
                    <QRCodeCanvas
                      id="qr-code-canvas"
                      value={`UniHelp Booking\nStudent: ${currentUser?.name || 'N/A'}\nArea: ${selectedBooking.area}\nDate: ${selectedBooking.date}\nTime: ${selectedBooking.to12h(selectedBooking.time)} - ${selectedBooking.to12h(selectedBooking.endTime)}\nSeats: ${selectedBooking.seats.join(', ')}\nStatus: ${selectedBooking.getStatusLabel()}`}
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
                    <div><strong>Status:</strong> {selectedBooking.getStatusLabel()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    <button onClick={() => {
                        const canvas = document.getElementById("qr-code-canvas");
                        if (!canvas) return;
                        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        const a = document.createElement("a");
                        a.href = pngUrl;
                        a.download = "unihelp-booking-qr.png";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }} style={{ padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Download QR</button>
                    <button onClick={() => setSelectedBooking(null)} style={{ padding: '10px 30px', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Close</button>
                  </div>
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
