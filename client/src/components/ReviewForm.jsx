import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewForm = ({ boardingId, onReviewAdded, studentId, studentName }) => {
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/reviews', {
        boardingId,
        studentId,
        studentName,
        rating,
        comment,
      });
      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setRating(5);
        setComment('');
        onReviewAdded();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  const displayRating = hoveredStar || rating;

  return (
    <div className="review-form-card">
      <h5 className="review-form-card__title">
        <i className="bi bi-pencil-square review-form-card__title-icon" />
        Write a Review
      </h5>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-3">
          <span className="review-form__label">Your Rating</span>
          <div className="review-form-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`review-form-star ${star <= displayRating ? 'filled' : 'empty'}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <i className={`bi bi-star${star <= displayRating ? '-fill' : ''}`} />
              </span>
            ))}
            {displayRating > 0 && (
              <span style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#5938B6',
                alignSelf: 'center',
                marginLeft: '6px',
                background: 'rgba(89,56,182,0.08)',
                padding: '3px 10px',
                borderRadius: '8px',
              }}>
                {ratingLabels[displayRating]}
              </span>
            )}
          </div>
        </div>

        {/* Comment with Character Counter */}
        <div className="mb-4 position-relative">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="review-form__label mb-0">Your Comment</span>
            <span className={`small fw-bold ${comment.length > 450 ? 'text-danger' : 'text-secondary'}`} style={{ fontSize: '0.7rem', opacity: 0.8 }}>
              {comment.length}/500
            </span>
          </div>
          <textarea
            className={`review-form-textarea form-control ${comment.length > 0 && comment.trim().length < 10 ? 'is-invalid border-danger' : ''}`}
            rows="3"
            maxLength={500}
            placeholder="Share your experience (min. 10 characters)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            style={{ transition: 'all 0.3s' }}
          />
          {comment.length > 0 && comment.trim().length < 10 && (
            <div className="text-danger mt-1" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
              <i className="bi bi-info-circle me-1" />
              Please write at least 10 characters for a helpful review.
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-submit-review" 
          disabled={submitting || comment.trim().length < 10}
          style={{ opacity: (submitting || comment.trim().length < 10) ? 0.6 : 1 }}
        >
          {submitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                style={{ width: '14px', height: '14px', borderWidth: '2px' }}
              />
              Submitting Review…
            </>
          ) : (
            <>
              <i className="bi bi-send-fill me-2" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
