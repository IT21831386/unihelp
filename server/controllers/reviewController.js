const reviewService = require('../services/reviewService');

// @desc    Add a new review
// @route   POST /api/reviews
const addReview = async (req, res) => {
  try {
    const newReview = await reviewService.addReview(req.body);
    res.status(201).json({
      success: true,
      data: newReview,
      message: 'Review added successfully',
    });
  } catch (error) {
    console.error('Error in addReview:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Server Error while adding review',
    });
  }
};

// @desc    Get reviews for a single boarding
// @route   GET /api/reviews/boarding/:boardingId
const getReviewsForBoarding = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByBoardingId(req.params.boardingId);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('Error in getReviewsForBoarding:', error);
    res.status(400).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all reviews for an owner
// @route   GET /api/reviews/owner/:email
const getReviewsForOwner = async (req, res) => {
  try {
    const reviews = await reviewService.getReviewsByOwnerEmail(req.params.email);
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('Error in getReviewsForOwner:', error);
    res.status(400).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res) => {
  try {
    const updatedReview = await reviewService.updateReview(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    console.error('Error in updateReview:', error);
    res.status(400).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(400).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add owner reply to review
// @route   PUT /api/reviews/:id/reply
const addOwnerReply = async (req, res) => {
  try {
    const repliedReview = await reviewService.addOwnerReply(req.params.id, req.body.reply);
    res.status(200).json({ success: true, data: repliedReview });
  } catch (error) {
    console.error('Error in addOwnerReply:', error);
    res.status(400).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  addReview,
  getReviewsForBoarding,
  getReviewsForOwner,
  updateReview,
  deleteReview,
  addOwnerReply,
};
