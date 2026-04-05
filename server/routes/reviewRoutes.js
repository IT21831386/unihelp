const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsForBoarding,
  getReviewsForOwner,
} = require('../controllers/reviewController');

router.route('/').post(addReview);
router.route('/boarding/:boardingId').get(getReviewsForBoarding);
router.route('/owner/:email').get(getReviewsForOwner);

module.exports = router;
