const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { category, area, date, time, seats } = req.body;
    
    // Check if seats are already booked for that date/time/area
    const existingBookings = await Booking.find({ category, area, date, time, status: 'active' });
    const bookedSeats = existingBookings.flatMap(b => b.seats);
    
    const overlap = seats.some(seat => bookedSeats.includes(seat));
    if (overlap) {
      return res.status(400).json({ message: 'One or more seats are already booked for this slot.' });
    }

    const booking = new Booking({
      category, area, date, time, seats
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
    const { category, area, date, time } = req.query;
    
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (area) filter.area = area;
    if (date) filter.date = date;
    if (time) filter.time = time;
    
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookings
};
