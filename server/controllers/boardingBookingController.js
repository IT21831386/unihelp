const BoardingBooking = require('../models/BoardingBooking');
const Boarding = require('../models/boardingModel');

// @desc    Create a new boarding booking
// @route   POST /api/boarding-bookings
const createBoardingBooking = async (req, res) => {
  try {
    const { boardingId, userId, message } = req.body;
    console.log('Booking Request:', { boardingId, userId });

    // Check if boarding exists
    const boarding = await Boarding.findById(boardingId);
    if (!boarding) {
      console.log('Boarding not found for ID:', boardingId);
      return res.status(404).json({ success: false, message: 'Boarding place not found' });
    }

    // Check if it's available
    if (boarding.availabilityStatus !== 'Available') {
      return res.status(400).json({ success: false, message: 'This boarding place is no longer available' });
    }

    const booking = new BoardingBooking({
      user: userId,
      boarding: boardingId,
      message
    });

    const savedBooking = await booking.save();
    console.log('Booking Saved:', savedBooking._id);

    res.status(201).json({
      success: true,
      data: savedBooking
    });
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all boarding bookings for a user
// @route   GET /api/boarding-bookings/my-bookings/:userId
const getMyBoardingBookings = async (req, res) => {
  try {
    const bookings = await BoardingBooking.find({ user: req.params.userId })
      .populate('boarding')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Cancel a boarding booking
// @route   PATCH /api/boarding-bookings/:id/cancel
const cancelBoardingBooking = async (req, res) => {
  try {
    const booking = await BoardingBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if authorized (simplified for now, usually check req.user.id)
    
    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all bookings for a boarding owner (by email)
// @route   GET /api/boarding-bookings/owner/:email
const getOwnerBoardingBookings = async (req, res) => {
  try {
    // 1. Find all boardings owned by this email
    const myBoardings = await Boarding.find({ email: req.params.email });
    const boardingIds = myBoardings.map(b => b._id);

    // 2. Find all bookings for these boardings
    const bookings = await BoardingBooking.find({ boarding: { $in: boardingIds } })
      .populate('boarding')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Update boarding booking status
// @route   PATCH /api/boarding-bookings/:id/status
const updateBoardingBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await BoardingBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

module.exports = {
  createBoardingBooking,
  getMyBoardingBookings,
  cancelBoardingBooking,
  getOwnerBoardingBookings,
  updateBoardingBookingStatus
};
