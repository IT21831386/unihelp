import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const OwnerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || user.role === 'user') {
      navigate('/');
      return;
    }
    fetchOwnerReviews();
  }, [user, navigate]);

  const fetchOwnerReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/owner/${user.email}`);
      if (response.data && response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`bi bi-star${i < rating ? '-fill text-warning' : ''} me-1`}></i>
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '50px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold"><i className="bi bi-star-fill text-primary me-2"></i> Reviews for My Properties</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-secondary">Loading your reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
            <i className="bi bi-chat-square-text text-secondary opacity-50 display-1 mb-3"></i>
            <h4 className="fw-bold">No Reviews Yet</h4>
            <p className="text-secondary">You haven't received any reviews for your boarding places yet.</p>
          </div>
        ) : (
          <div className="row g-4">
            {reviews.map((review) => (
              <div key={review._id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-0">{review.studentName}</h6>
                        <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="bg-light p-1 rounded">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="card-text text-secondary mb-3">"{review.comment}"</p>
                    {review.boardingId && (
                      <div className="mt-auto p-2 bg-light border rounded">
                        <small className="fw-bold text-dark d-block">Property:</small>
                        <Link to={`/boarding/${review.boardingId._id}`} className="text-decoration-none">
                          <small className="text-primary">{review.boardingId.title} - {review.boardingId.city}</small>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OwnerReviews;
