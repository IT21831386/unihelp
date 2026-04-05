import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReviewForm = ({ boardingId, onReviewAdded, studentId, studentName }) => {
  const [rating, setRating] = useState(5);
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

  return (
    <div className="bg-light p-4 rounded-3 border mt-4">
      <h5 className="fw-bold mb-3">Leave a Review</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-secondary fw-medium">Rating</label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`bi bi-star${star <= rating ? '-fill text-warning' : ' text-secondary'} fs-4`}
                style={{ cursor: 'pointer' }}
                onClick={() => setRating(star)}
              ></i>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label text-secondary fw-medium">Comment</label>
          <textarea
            className="form-control rounded-3"
            rows="3"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary px-4 fw-bold rounded-pill" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
