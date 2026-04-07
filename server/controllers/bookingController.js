const mongoose = require('mongoose');
const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { category, area, date, time, endTime, seats, user } = req.body;
    
    // Check if seats are already booked for that date/area and mathematically intersect the block
    const existingBookings = await Booking.find({ category, area, date, status: 'active' });
    const overlappingBookings = existingBookings.filter(b => {
      return (time < b.endTime && endTime > b.time);
    });
    
    const bookedSeats = overlappingBookings.flatMap(b => b.seats);
    
    const overlap = seats.some(seat => bookedSeats.includes(seat));
    if (overlap) {
      return res.status(400).json({ message: 'One or more seats are already booked for this slot.' });
    }

    const booking = new Booking({
      user: user ? new mongoose.Types.ObjectId(user) : null,
      category, area, date, time, endTime, seats
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get bookings (to check availability)
// @route   GET /api/bookings
const getBookings = async (req, res) => {
  try {
    const { category, area, date, user } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (area) filter.area = area;
    if (date) filter.date = date;
    if (user) {
      // When fetching a specific user's bookings (dashboard), return all statuses
      filter.user = new mongoose.Types.ObjectId(user);
    } else {
      // When checking seat availability, only return active bookings
      filter.status = 'active';
    }
    
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking
};
