const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsForBoarding,
  getReviewsForOwner,
  updateReview,
  deleteReview,
  addOwnerReply,
} = require('../controllers/reviewController');

router.route('/').post(addReview);
router.route('/boarding/:boardingId').get(getReviewsForBoarding);
router.route('/owner/:email').get(getReviewsForOwner);

router.route('/:id').put(updateReview).delete(deleteReview);
router.route('/:id/reply').put(addOwnerReply);

module.exports = router;
