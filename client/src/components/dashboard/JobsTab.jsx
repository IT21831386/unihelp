import { useState } from 'react';
import { Link } from 'react-router-dom';

function JobsTab({ jobs, currentUser, formatDate, onDeleteJob, onUpdateJob }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const updated = await onUpdateJob(editingJob);
    if (updated) setEditingJob(null);
  };

  return (
    <div className="dashboard-card premium-table-card">
      <div className="dashboard-card__header">
        <div className="d-flex align-items-center gap-3">
          <h2 className="m-0">{currentUser.role === 'employer' ? 'Your Job Postings' : 'Job Opportunities'}</h2>
          <span className="dashboard-badge">{filteredJobs.length} Total</span>
        </div>
        {currentUser.role === 'employer' && (
          <Link to="/careers/post-job" className="btn-premium-add-new">
            + Post New Job
          </Link>
        )}
      </div>
      
      <div className="dashboard-filter-bar d-flex gap-3 align-items-center p-3">
        <div className="flex-grow-1 position-relative">
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3 opacity-50">🔍</span>
          <input
            type="text"
            placeholder="Search by Title or Company..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-input filter-input-search"
            style={{ paddingLeft: '40px' }}
          />
        </div>
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          className="form-select"
          style={{ width: 'auto' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
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
              filteredApps.map(job => (
                <tr key={job._id}>
                  <td><strong>{job.title}</strong></td>
                  <td>{job.company}</td>
                  <td>
                    <span className={`status-badge-premium ${job.level === 'senior' ? 'badge-other' : 'badge-available'}`}>
                      <span className="dot-indicator"></span>
                      {job.level}
                    </span>
                  </td>
                  <td>{formatDate(job.createdAt)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/careers/job/${job._id}`} className="premium-action-btn btn-premium-edit" title="View Details">
                        👁️
                      </Link>
                      {currentUser.role === 'employer' && (
                        <>
                          <button onClick={() => setEditingJob({...job})} className="premium-action-btn btn-premium-edit" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button onClick={() => onDeleteJob(job._id)} className="premium-action-btn btn-premium-delete" title="Delete">
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
        <div className="modal-overlay" onClick={() => setEditingJob(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', padding: '30px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '20px', color: '#24292e', fontWeight: '800' }}>Edit Job Posting</h3>
            <form onSubmit={handleUpdateJob} className="d-flex flex-column gap-3">
              <div className="form-group">
                <label className="fw-bold small mb-1">Job Title</label>
                <input type="text" value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} className="form-input" required />
              </div>
              <div className="form-group">
                <label className="fw-bold small mb-1">Company</label>
                <input type="text" value={editingJob.company} onChange={e => setEditingJob({...editingJob, company: e.target.value})} className="form-input" required />
              </div>
              <div className="d-flex gap-3">
                <div className="form-group flex-grow-1">
                  <label className="fw-bold small mb-1">Location</label>
                  <select value={editingJob.location} onChange={e => setEditingJob({...editingJob, location: e.target.value})} className="form-select" required>
                    <option value="colombo">Colombo</option><option value="kandy">Kandy</option><option value="galle">Galle</option><option value="remote">Remote</option>
                  </select>
                </div>
                <div className="form-group flex-grow-1">
                  <label className="fw-bold small mb-1">Level</label>
                  <select value={editingJob.level} onChange={e => setEditingJob({...editingJob, level: e.target.value})} className="form-select" required>
                    <option value="internship">Internship</option><option value="entry">Entry Level</option><option value="mid-senior">Mid - Senior</option><option value="senior">Senior</option>
                  </select>
                </div>
              </div>
              <div className="d-flex gap-3">
                <div className="form-group flex-grow-1">
                  <label className="fw-bold small mb-1">Modality</label>
                  <select value={editingJob.modality} onChange={e => setEditingJob({...editingJob, modality: e.target.value})} className="form-select" required>
                    <option value="remote">Remote</option><option value="on-site">On - Site</option><option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group flex-grow-1">
                  <label className="fw-bold small mb-1">Salary (LKR)</label>
                  <input type="number" value={editingJob.salary} onChange={e => setEditingJob({...editingJob, salary: e.target.value})} className="form-input" required />
                </div>
              </div>
              <div className="form-group">
                <label className="fw-bold small mb-1">Description</label>
                <textarea value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})} className="form-textarea" rows={4} required />
              </div>
              <div className="form-group">
                <label className="fw-bold small mb-1">Application Link (Optional)</label>
                <input type="url" value={editingJob.link || ''} onChange={e => setEditingJob({...editingJob, link: e.target.value})} className="form-input" />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-2">
                <button type="button" onClick={() => setEditingJob(null)} className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobsTab;
