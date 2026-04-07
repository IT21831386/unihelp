import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import './ReviewList.css';

const ReviewList = ({ boardingId, boardingEmail: boardingEmailProp }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvedBoardingEmail, setResolvedBoardingEmail] = useState(boardingEmailProp || '');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState({ rating: 5, comment: '' });
  const [replyInput, setReplyInput] = useState({});

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

  // Fetch the boarding's owner email directly so we always have fresh data
  useEffect(() => {
    if (boardingEmailProp) {
      setResolvedBoardingEmail(boardingEmailProp);
    } else if (boardingId) {
      axios
        .get(`http://localhost:5000/api/boardings/${boardingId}`)
        .then((res) => {
          if (res.data?.success && res.data?.data?.email) {
            setResolvedBoardingEmail(res.data.data.email);
          }
        })
        .catch(() => {});
    }
  }, [boardingId, boardingEmailProp]);

  useEffect(() => {
    fetchReviews();
  }, [boardingId]);

  const handleReviewAdded = () => fetchReviews();

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`bi bi-star${i < rating ? '-fill star-filled' : ' star-empty'}`}
      />
    ));

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
        if (response.data.success) fetchReviews();
      } catch (error) {
        console.error('Failed to delete review', error);
      }
    }
  };

  const startEdit = (review) => {
    setEditingReviewId(review._id);
    setEditContent({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (reviewId) => {
    try {
      if (!editContent.comment.trim()) return;
      const response = await axios.put(`http://localhost:5000/api/reviews/${reviewId}`, editContent);
      if (response.data.success) {
        setEditingReviewId(null);
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to update review', error);
    }
  };

  const handleReplyChange = (reviewId, text) =>
    setReplyInput((prev) => ({ ...prev, [reviewId]: text }));

  const handleOwnerReply = async (reviewId) => {
    try {
      const reply = replyInput[reviewId];
      if (!reply || !reply.trim()) return;
      const response = await axios.put(`http://localhost:5000/api/reviews/${reviewId}/reply`, { reply });
      if (response.data.success) {
        fetchReviews();
        setReplyInput((prev) => ({ ...prev, [reviewId]: '' }));
      }
    } catch (error) {
      console.error('Failed to add reply', error);
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const isOwner = (review) =>
    user && String(user.id || user._id) === String(review.studentId?._id || review.studentId);

  // An employer who owns this boarding can reply to reviews
  const isBoardingOwner =
    user &&
    user.role === 'employer' &&
    user.email &&
    resolvedBoardingEmail &&
    user.email.trim().toLowerCase() === resolvedBoardingEmail.trim().toLowerCase();

  // Debug: uncomment to troubleshoot
  // console.log('[ReviewList] isBoardingOwner check:', { userEmail: user?.email, boardingEmail: resolvedBoardingEmail, role: user?.role, result: isBoardingOwner });

  return (
    <div className="review-section">
      {/* Header */}
      <div className="review-section__header">
        <div className="review-section__icon">
          <i className="bi bi-star-fill" />
        </div>
        <h4 className="review-section__title">Reviews &amp; Ratings</h4>
        {reviews.length > 0 && (
          <span className="review-section__count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Review List */}
      {loading ? (
        <div className="review-loading">
          <div className="review-loading__spinner" />
          Loading reviews…
        </div>
      ) : reviews.length > 0 ? (
        <div className="d-flex flex-column gap-3 mb-4">
          {reviews.map((review) => (
            <div key={review._id} className="review-card">
              {editingReviewId === review._id ? (
                /* ── EDIT MODE ── */
                <div className="review-edit-mode">
                  <span className="review-edit-mode__label">Edit Your Review</span>

                  {/* Star selector */}
                  <div className="d-flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`review-edit-star ${star <= editContent.rating ? 'filled' : 'empty'}`}
                        onClick={() => setEditContent({ ...editContent, rating: star })}
                      >
                        <i className={`bi bi-star${star <= editContent.rating ? '-fill' : ''}`} />
                      </span>
                    ))}
                  </div>

                  {/* Edit Textarea with Counter */}
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="review-edit-mode__label mb-0">Edit Your Review</span>
                    <span className={`small fw-bold ${editContent.comment.length > 450 ? 'text-danger' : 'text-secondary'}`} style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      {editContent.comment.length}/500
                    </span>
                  </div>

                  <textarea
                    className={`review-edit-textarea form-control ${editContent.comment.length > 0 && editContent.comment.trim().length < 10 ? 'is-invalid border-danger' : 'mb-0'}`}
                    rows="3"
                    maxLength={500}
                    value={editContent.comment}
                    onChange={(e) => setEditContent({ ...editContent, comment: e.target.value })}
                    placeholder="Update your comment (min. 10 characters)…"
                  />

                  {editContent.comment.length > 0 && editContent.comment.trim().length < 10 && (
                    <div className="text-danger mt-1" style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      <i className="bi bi-info-circle me-1" />
                      Must be at least 10 characters.
                    </div>
                  )}

                  <div className="review-edit-actions mt-3">
                    <button 
                      className="btn-review-save" 
                      onClick={() => handleUpdate(review._id)}
                      disabled={editContent.comment.trim().length < 10}
                      style={{ opacity: editContent.comment.trim().length < 10 ? 0.6 : 1 }}
                    >
                      <i className="bi bi-check-lg" /> Save Changes
                    </button>
                    <button className="btn-review-cancel" onClick={() => setEditingReviewId(null)}>
                      <i className="bi bi-x-lg" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ── VIEW MODE ── */
                <>
                  <div className="review-card__header">
                    {/* Author */}
                    <div className="review-card__author-block">
                      <div className="review-card__avatar">
                        {getInitials(review.studentName)}
                      </div>
                      <div>
                        <p className="review-card__author-name">{review.studentName}</p>
                        <p className="review-card__date">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Stars + action menu */}
                    <div className="d-flex align-items-center gap-2">
                      <div className="review-stars">
                        {renderStars(review.rating)}
                        <span className="review-stars__label">{review.rating}/5</span>
                      </div>

                      {isOwner(review) && (
                        <div className="dropdown">
                          <button
                            className="review-menu-btn"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="bi bi-three-dots-vertical" />
                          </button>

                          <ul className="dropdown-menu dropdown-menu-end review-dropdown-menu">
                            <li>
                              <button
                                className="review-dropdown-item review-dropdown-item--edit"
                                onClick={() => startEdit(review)}
                              >
                                <span className="review-dropdown-item__icon">
                                  <i className="bi bi-pencil-fill" />
                                </span>
                                Edit Review
                              </button>
                            </li>
                            <li><hr className="dropdown-divider review-dropdown-divider" /></li>
                            <li>
                              <button
                                className="review-dropdown-item review-dropdown-item--delete"
                                onClick={() => handleDelete(review._id)}
                              >
                                <span className="review-dropdown-item__icon">
                                  <i className="bi bi-trash3-fill" />
                                </span>
                                Delete Review
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="review-card__comment">{review.comment}</p>

                  {/* Owner reply */}
                  {review.ownerReply ? (
                    <div className="review-owner-reply">
                      <div className="review-owner-reply__label">
                        <i className="bi bi-person-badge-fill" /> Owner Reply
                      </div>
                      <p className="review-owner-reply__text">{review.ownerReply}</p>
                    </div>
                  ) : (
                    isBoardingOwner && (
                      <div className="review-reply-input-area">
                        <span className="review-reply-input-area__label">
                          <i className="bi bi-reply-fill me-1" />Reply to this review
                        </span>
                        <div className="review-reply-input-group">
                          <input
                            type="text"
                            className="review-reply-input form-control"
                            placeholder="Thank the student or address their feedback…"
                            value={replyInput[review._id] || ''}
                            onChange={(e) => handleReplyChange(review._id, e.target.value)}
                          />
                          <button
                            className="btn-reply-submit"
                            onClick={() => handleOwnerReply(review._id)}
                            disabled={!replyInput[review._id]?.trim()}
                          >
                            <i className="bi bi-send-fill" /> Reply
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="review-empty-state">
          <i className="bi bi-chat-dots review-empty-state__icon" />
          <p className="review-empty-state__title">No reviews yet</p>
          <p className="review-empty-state__sub">Be the first to share your experience!</p>
        </div>
      )}

      {/* Review form or login prompt */}
      {user && user.role === 'user' ? (
        <ReviewForm
          boardingId={boardingId}
          onReviewAdded={handleReviewAdded}
          studentId={user.id}
          studentName={user.name}
        />
      ) : (
        !user && (
          <div className="review-login-prompt">
            <i className="bi bi-lock me-2" />
            Please <strong>log in as a student</strong> to leave a review.
          </div>
        )
      )}
    </div>
  );
};

export default ReviewList;
