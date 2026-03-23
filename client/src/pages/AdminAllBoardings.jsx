import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

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
          // Remove from local state
          setBoardings(boardings.filter(b => b._id !== id));
        }
      } catch (error) {
        console.error("Error deleting boarding:", error);
        toast.error('Failed to delete boarding place', { id: 'deleteToast' });
      }
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Toaster position="top-center" />
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xxl-11">
            
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h2 className="fw-bolder text-dark mb-1 d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-buildings fs-4"></i>
                  </div>
                  Manage Boarding Places
                </h2>
                <p className="text-secondary mb-0 ms-5 ps-3">View, modify, or permanently remove existing boarding places.</p>
              </div>
              <div className="d-flex align-items-center gap-3">
                <Link to="/" className="btn btn-light border shadow-sm fw-medium d-flex align-items-center gap-2 text-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '50rem' }}>
                  <i className="bi bi-house-door"></i> Back to Home
                </Link>
                <Link to="/admin/addboarding" className="btn btn-primary shadow-sm fw-medium d-flex align-items-center gap-2" style={{ padding: '0.6rem 1.25rem', borderRadius: '50rem' }}>
                  <i className="bi bi-plus-lg"></i> Add New Boarding
                </Link>
              </div>
            </div>

            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-0">
                {loading ? (
                  <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-primary border-4" style={{ width: '3rem', height: '3rem' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : boardings.length === 0 ? (
                  <div className="text-center py-5 text-secondary">
                    <i className="bi bi-inbox display-1 text-light mb-3"></i>
                    <h4>No boarding places found.</h4>
                    <p>Start by adding a new boarding place.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light text-secondary small text-uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 border-bottom-0 fw-semibold" style={{ width: '80px' }}>Image</th>
                          <th className="px-4 py-3 border-bottom-0 fw-semibold">Property Details</th>
                          <th className="px-4 py-3 border-bottom-0 fw-semibold">Location</th>
                          <th className="px-4 py-3 border-bottom-0 fw-semibold">Price</th>
                          <th className="px-4 py-3 border-bottom-0 fw-semibold">Status</th>
                          <th className="px-4 py-3 border-bottom-0 fw-semibold text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="border-top-0">
                        {boardings.map((boarding) => {
                          const displayImage = boarding.imageUrls && boarding.imageUrls.length > 0 
                            ? boarding.imageUrls[0] 
                            : 'https://images.unsplash.com/photo-1522771731470-ea44358153a5?q=80&w=2070&auto=format&fit=crop';
                          
                          return (
                            <tr key={boarding._id} style={{ transition: 'all 0.2s' }}>
                              <td className="px-4 py-3">
                                <div className="rounded-3 overflow-hidden bg-light shadow-sm" style={{ width: '60px', height: '60px' }}>
                                  <img src={displayImage} alt={boarding.title} className="w-100 h-100 object-fit-cover" />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <h6 className="mb-1 fw-bold text-dark text-truncate" style={{ maxWidth: '250px' }} title={boarding.title}>
                                  {boarding.title}
                                </h6>
                                <span className="text-secondary small d-flex align-items-center gap-1">
                                  <span className="badge bg-light text-dark border">{boarding.propertyType}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 text-secondary">
                                <i className="bi bi-geo-alt-fill text-primary me-1"></i> {boarding.city}
                              </td>
                              <td className="px-4 py-3">
                                <div className="fw-bolder text-primary">
                                  {boarding.currency} {boarding.price.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`badge rounded-pill px-3 py-2 fw-medium ${
                                  boarding.availabilityStatus === 'Available' ? 'bg-success bg-opacity-10 text-success border border-success-subtle' : 
                                  boarding.availabilityStatus === 'Full' ? 'bg-danger bg-opacity-10 text-danger border border-danger-subtle' : 
                                  'bg-warning bg-opacity-10 text-warning-emphasis border border-warning-subtle'
                                }`}>
                                  {boarding.availabilityStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-end">
                                <div className="d-flex gap-2 justify-content-end">
                                  <button 
                                    onClick={() => navigate(`/admin/editboarding/${boarding._id || boarding.id}`)}
                                    className="btn btn-light btn-sm text-primary rounded-circle shadow-sm" 
                                    style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }} 
                                    title="Edit"
                                  >
                                    <i className="bi bi-pencil-square"></i>
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(boarding._id || boarding.id, boarding.title)}
                                    className="btn btn-light btn-sm text-danger rounded-circle shadow-sm hover-danger" 
                                    style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Delete"
                                  >
                                    <i className="bi bi-trash3"></i>
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
