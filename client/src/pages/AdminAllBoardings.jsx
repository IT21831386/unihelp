import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './AdminAllBoardings.css';

const AdminAllBoardings = () => {
  const navigate = useNavigate();
  const [boardings, setBoardings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoardings();
  }, []);

  const fetchBoardings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/boardings');
      if (response.data && response.data.success) {
        setBoardings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching boardings:", error);
      toast.error('Failed to load boardings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        toast.loading('Deleting...', { id: 'deleteToast' });
        const response = await axios.delete(`http://localhost:5000/api/boardings/${id}`);
        if (response.data.success) {
          toast.success('Boarding deleted successfully', { id: 'deleteToast' });
          setBoardings(boardings.filter(b => (b._id || b.id) !== id));
        }
      } catch (error) {
        console.error("Error deleting boarding:", error);
        toast.error('Failed to delete boarding place', { id: 'deleteToast' });
      }
    }
  };

  return (
    <div className="admin-mgmt-page">
      <Toaster position="top-center" />
      
      {/* Aurora Backdrop */}
      <div className="bg-aurora" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div className="bg-grain" aria-hidden="true" />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            
            {/* Action Header */}
            <div className="admin-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="admin-header__icon">
                  <i className="bi bi-buildings"></i>
                </div>
                <div>
                  <h2 className="admin-header__title mb-0">Manage Boarding Places</h2>
                  <p className="text-secondary small mb-0 fw-medium">Admin Dashboard • Control your entire marketplace catalogue</p>
                </div>
              </div>
              
              <div className="d-flex align-items-center gap-3">
                <Link to="/" className="btn btn-light px-4 py-2 border shadow-sm fw-bold text-secondary rounded-pill d-flex align-items-center gap-2">
                  <i className="bi bi-house-star fs-5 text-primary"></i> <span className="d-none d-lg-inline">Back to Home</span>
                </Link>
                <Link to="/admin/addboarding" className="btn btn-premium-add">
                  <i className="bi bi-plus-circle fs-5 me-1"></i> Add New Boarding
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="admin-stats-bar">
              <div className="admin-stat-pill">
                <span className="admin-stat-pill__val">{boardings.length}</span>
                <span className="admin-stat-pill__label">Total Properties</span>
              </div>
              <div className="admin-stat-pill">
                <span className="admin-stat-pill__val">
                  {boardings.filter(b => b.availabilityStatus === 'Available').length}
                </span>
                <span className="admin-stat-pill__label">Available</span>
              </div>
            </div>

            {/* Main Table Container */}
            <div className="card admin-table-card border-0">
              <div className="card-body p-0">
                {loading ? (
                  <div className="unihelp-loader-container" style={{ minHeight: '400px' }}>
                    <div className="unihelp-loader">
                      <div className="loader-ring"></div>
                      <div className="loader-ring"></div>
                      <div className="loader-ring"></div>
                      <div className="loader-logo">U</div>
                    </div>
                    <p className="loader-text mt-4">Syncing Catalogue...</p>
                  </div>
                ) : boardings.length === 0 ? (
                  <div className="text-center py-5" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto" style={{ width: '120px', height: '120px' }}>
                       <i className="bi bi-box-seam display-2 text-secondary opacity-25"></i>
                    </div>
                    <h4 className="fw-bold text-dark">No boarding places found.</h4>
                    <p className="text-secondary mb-4">You haven't listed any boarding places yet.</p>
                    <Link to="/admin/addboarding" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">
                       <i className="bi bi-plus-lg me-2"></i>Create First Listing
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table admin-table align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Property Details</th>
                          <th>Location</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {boardings.map((boarding) => {
                          const id = boarding._id || boarding.id;
                          const displayImage = boarding.imageUrls && boarding.imageUrls.length > 0 
                            ? boarding.imageUrls[0] 
                            : 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop';
                          
                          return (
                            <tr key={id}>
                              <td>
                                <div className="table-img-wrap">
                                  <img src={displayImage} alt={boarding.title} className="w-100 h-100 object-fit-cover" />
                                </div>
                              </td>
                              <td>
                                <p className="table-prop-title mb-0">{boarding.title}</p>
                                <span className="badge bg-light text-secondary small border-0 px-2" style={{ fontSize: '0.65rem' }}>{boarding.propertyType}</span>
                              </td>
                              <td className="text-secondary">
                                <span className="d-flex align-items-center gap-2 small fw-semibold">
                                  <i className="bi bi-geo-alt-fill text-danger opacity-75"></i> {boarding.city}
                                </span>
                              </td>
                              <td>
                                <div className="table-price-val">
                                  {boarding.currency} {boarding.price.toLocaleString()}
                                </div>
                              </td>
                              <td>
                                <div className={`status-badge-dot ${
                                  boarding.availabilityStatus === 'Available' ? 'badge-available' : 
                                  boarding.availabilityStatus === 'Full' ? 'badge-full' : 
                                  'badge-other'
                                }`}>
                                  <span className="dot-indicator" style={{ color: boarding.availabilityStatus === 'Available' ? '#10b981' : boarding.availabilityStatus === 'Full' ? '#ef4444' : '#f59e0b' }}></span>
                                  {boarding.availabilityStatus}
                                </div>
                              </td>
                              <td className="text-end">
                                <div className="d-flex gap-2 justify-content-end px-2">
                                  <button 
                                    onClick={() => navigate(`/admin/editboarding/${id}`)}
                                    className="admin-action-btn btn-edit" 
                                    title="Edit Details"
                                  >
                                    <i className="bi bi-pencil-fill"></i>
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(id, boarding.title)}
                                    className="admin-action-btn btn-delete" 
                                    title="Permanently Delete"
                                  >
                                    <i className="bi bi-trash3-fill"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllBoardings;
