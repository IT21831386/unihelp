const express = require('express');
const router = express.Router();
const { createBooking, getBookings, cancelBooking, getBookingStats } = require('../controllers/bookingController');

router.get('/stats', getBookingStats);
router.post('/', createBooking);
router.get('/', getBookings);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
