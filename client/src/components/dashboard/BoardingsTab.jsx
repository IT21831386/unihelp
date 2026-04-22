import { Link } from 'react-router-dom';
import { Trash2, Edit3 } from 'lucide-react';

function BoardingsTab({ boardings, navigate, handleDeleteBoarding, deletingIds }) {
  return (
    <div className="dashboard-card premium-table-card border-0">
      <div className="dashboard-card__header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div style={{ padding: '8px', background: 'linear-gradient(135deg, #5938B6, #ec4899)', borderRadius: '10px', color: '#fff', fontSize: '18px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Manage Boarding Places</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="dashboard-badge">{boardings.length} Total</span>
            <span className="dashboard-badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              {boardings.filter(b => b.availabilityStatus === 'Available').length} Available
            </span>
          </div>
        </div>
        <Link to="/admin/addboarding" className="btn-premium-add-new">
          Add New Boarding
        </Link>
      </div>
      <div className="table-responsive">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Location</th>
              <th>Pricing</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {boardings.length === 0 ? (
              <tr><td colSpan="5" className="empty-row">No boarding places found</td></tr>
            ) : (
              boardings.map((boarding) => {
                const id = boarding._id || boarding.id;
                const displayImage = boarding.imageUrls?.[0] || 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop';
                const statusClass = boarding.availabilityStatus === 'Available' ? 'badge-available' : 
                                   boarding.availabilityStatus === 'Full' ? 'badge-full' : 'badge-other';
                
                return (
                  <tr key={id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div className="premium-img-wrap">
                          <img src={displayImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '800', fontSize: '14.5px', color: '#1e1b4b' }}>{boarding.title}</div>
                          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>{boarding.propertyType}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
                      {boarding.city}
                    </td>
                    <td>
                      <span className="premium-price-val">
                        {boarding.currency} {boarding.price.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div className={`status-badge-premium ${statusClass}`}>
                        <span className="dot-indicator" style={{ color: 'currentColor' }}></span>
                        {boarding.availabilityStatus}
                      </div>
                    </td>
                    <td className="text-end">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => navigate(`/admin/editboarding/${id}`)} className="premium-action-btn btn-premium-edit" title="Edit Listing">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBoarding(id, boarding.title)} 
                          className="premium-action-btn btn-premium-delete" 
                          title="Permanently Delete"
                          disabled={deletingIds.includes(id)}
                        >
                          {deletingIds.includes(id) ? <div className="spinner-border spinner-border-sm" role="status" style={{width: '1rem', height: '1rem'}}></div> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BoardingsTab;
