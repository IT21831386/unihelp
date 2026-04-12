import { useState } from 'react';
import { Link } from 'react-router-dom';

function JobsTab({ jobs, currentUser, formatDate, onDeleteJob, onUpdateJob }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingJob, setEditingJob] = useState(null);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const updated = await onUpdateJob(editingJob);
    if (updated) setEditingJob(null);
  };

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
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
                          <button onClick={() => onDeleteJob(job._id)} title="Delete" style={{ background: '#cb2431', color: '#ffffff', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
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
}

export default JobsTab;
