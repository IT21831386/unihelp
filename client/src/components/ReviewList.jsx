import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';

const ReviewList = ({ boardingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/boarding/${boardingId}`);
      if (response.data && response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [boardingId]);

  const handleReviewAdded = () => {
    fetchReviews();
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`bi bi-star${i < rating ? '-fill text-warning' : ''} me-1`}></i>
    ));
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 mt-5 bg-white">
      <div className="card-body p-4 p-md-5">
        <h4 className="fw-bold text-dark mb-4 border-bottom pb-3">
          <i className="bi bi-star-half text-primary me-2"></i> Reviews & Ratings
        </h4>
        
        {loading ? (
          <p className="text-secondary">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="mb-4 d-flex flex-column gap-3">
            {reviews.map((review) => (
              <div key={review._id} className="p-3 bg-light rounded-3 border">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">{review.studentName}</h6>
                  <div>{renderStars(review.rating)}</div>
                </div>
                <p className="text-secondary mb-1">{review.comment}</p>
                <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-light border mb-4 text-center">
            <p className="mb-0 text-secondary">No reviews yet. Be the first to review!</p>
          </div>
        )}

        {user && user.role === 'user' ? (
          <ReviewForm boardingId={boardingId} onReviewAdded={handleReviewAdded} studentId={user.id} studentName={user.name} />
        ) : (
          !user && <p className="text-muted mt-3">Please log in as a student to leave a review.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
