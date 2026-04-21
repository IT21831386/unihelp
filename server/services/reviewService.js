const Review = require('../models/Review');
const Boarding = require('../models/boardingModel');

const addReview = async (reviewData) => {
  try {
    const newReview = await Review.create(reviewData);
    return newReview;
  } catch (error) {
    throw error;
  }
};

const getReviewsByBoardingId = async (boardingId) => {
  try {
    const reviews = await Review.find({ boardingId }).sort({ createdAt: -1 });
    return reviews;
  } catch (error) {
    throw error;
  }
};

const getReviewsByOwnerEmail = async (email) => {
  try {
    const boardings = await Boarding.find({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    const boardingIds = boardings.map((b) => b._id);
    const reviews = await Review.find({ boardingId: { $in: boardingIds } })
      .populate('boardingId', 'title city address')
      .sort({ createdAt: -1 });
      
    return reviews;
  } catch (error) {
    throw error;
  }
};

const addOwnerReply = async (reviewId, reply) => {
  try {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { ownerReply: reply },
      { new: true }
    );
    if (!review) throw new Error('Review not found');
    return review;
  } catch (error) {
    throw error;
  }
};

const updateReview = async (reviewId, updateData) => {
  try {
    const review = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
    if (!review) throw new Error('Review not found');
    return review;
  } catch (error) {
    throw error;
  }
};

const deleteReview = async (reviewId) => {
  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) throw new Error('Review not found');
    return review;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addReview,
  addOwnerReply,
  updateReview,
  deleteReview,
  getReviewsByBoardingId,
  getReviewsByOwnerEmail,
};
