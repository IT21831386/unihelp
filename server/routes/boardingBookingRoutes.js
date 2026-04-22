const express = require('express');
const router = express.Router();
const {
  createBoardingBooking,
  getMyBoardingBookings,
  cancelBoardingBooking,
  getOwnerBoardingBookings,
  updateBoardingBookingStatus
} = require('../controllers/boardingBookingController');

router.post('/', createBoardingBooking);
router.get('/my-bookings/:userId', getMyBoardingBookings);
router.get('/owner/:email', getOwnerBoardingBookings);
router.patch('/:id/cancel', cancelBoardingBooking);
router.patch('/:id/status', updateBoardingBookingStatus);

module.exports = router;
