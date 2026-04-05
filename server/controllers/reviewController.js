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

module.exports = {
  addReview,
  getReviewsForBoarding,
  getReviewsForOwner,
};
