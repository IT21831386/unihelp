import { useState } from 'react';

function ApplicationsTab({ applications, currentUser, formatDate, onDeleteApp, onUpdateApp, onUpdateAppStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingApp, setEditingApp] = useState(null);

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter ? (app.status || 'Pending') === statusFilter : true;
    if (!matchesStatus) return false;

    if (currentUser.role === 'employer') {
      const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJob = jobFilter ? (app.jobId && app.jobId._id === jobFilter) : true;
      return matchesSearch && matchesJob;
    } else if (currentUser.role === 'user') {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const jobTitle = app.jobId ? app.jobId.title.toLowerCase() : '';
      const company = app.jobId ? app.jobId.company.toLowerCase() : '';
      return jobTitle.includes(term) || company.includes(term);
    }
    return true;
  });

  const employerJobs = applications
    .map(app => app.jobId)
    .filter((job, index, self) => job && self.findIndex(j => j._id === job._id) === index);

  const handleUpdateApp = async (e) => {
    e.preventDefault();
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,5}[-\s\.]?[0-9]{4,6}$/;
    if (editingApp.fullName.trim().length < 3) { alert('Full name must be at least 3 characters.'); return; }
    if (!EMAIL_REGEX.test(editingApp.email)) { alert('Enter a valid email address.'); return; }
    if (!PHONE_REGEX.test(editingApp.phone.trim())) { alert('Enter a valid phone number.'); return; }

    const updated = await onUpdateApp(editingApp);
    if (updated) setEditingApp(null);
  };

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
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
          />
          <select
            value={jobFilter}
            onChange={e => setJobFilter(e.target.value)}
            style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
          >
            <option value="">All Jobs</option>
            {employerJobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '8px', border: '1px solid #d1d5da', borderRadius: '4px', flex: 1 }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
                  </td>
                  {(currentUser.role === 'user' || currentUser.role === 'employer') && (
                    <td style={{ verticalAlign: 'middle' }}>
                      {currentUser.role === 'user' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => setEditingApp({ ...app })} title="Edit" style={{ background: '#0366d6', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button onClick={() => onDeleteApp(app._id)} title="Withdraw" style={{ background: '#cb2431', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      )}
                      {currentUser.role === 'employer' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => onUpdateAppStatus(app._id, 'Accepted')} title="Accept" style={{ background: '#28a745', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Accept</button>
                          <button onClick={() => onUpdateAppStatus(app._id, 'Rejected')} title="Reject" style={{ background: '#cb2431', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Reject</button>
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
}

export default ApplicationsTab;
