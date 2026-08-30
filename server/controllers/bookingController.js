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

// @desc    Get live booking and capacity stats across all areas
// @route   GET /api/bookings/stats
const getBookingStats = async (req, res) => {
  try {
    const AreaLayout = require('../models/AreaLayout');
    const { date, time, endTime } = req.query;

    const now = new Date();
    const queryDate = date || now.toISOString().split('T')[0];
    
    let queryTime = time;
    if (!queryTime) {
      const h = now.getHours();
      queryTime = `${String(h).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    let queryEndTime = endTime;
    if (!queryEndTime) {
      const parts = queryTime.split(':');
      let endH = parseInt(parts[0], 10) + 1;
      if (endH > 22) endH = 22;
      queryEndTime = `${String(endH).padStart(2, '0')}:${parts[1] || '00'}`;
    }

    // Fetch all areas
    let areas = await AreaLayout.find();
    
    // Fetch active bookings for the specified date
    const bookings = await Booking.find({ date: queryDate, status: 'active' });

    // Filter overlapping bookings
    const overlapping = bookings.filter(b => {
      return (queryTime < b.endTime && queryEndTime > b.time);
    });

    const facilityMap = {
      'canteen': ['Food & Beverages', 'Casual Discussion', 'Group Seating', 'AC Lounge'],
      'study-area': ['Silent Study', 'Power Outlets', 'High-Speed WiFi', 'Individual Desks', 'Whiteboards'],
      'library': ['Ultra Quiet Pods', 'Research Terminals', 'Power Sockets', 'Air Conditioned', 'Ergonomic Chairs']
    };

    const stats = areas.map(area => {
      let totalSeats = 0;
      const allSeatIds = [];
      
      const countSeats = (groups) => {
        if (!Array.isArray(groups)) return;
        groups.forEach(g => {
          if (Array.isArray(g.rows)) {
            g.rows.forEach(r => {
              if (Array.isArray(r)) {
                r.forEach(seatId => {
                  totalSeats++;
                  allSeatIds.push(seatId);
                });
              }
            });
          }
        });
      };

      if (area.layoutConfig) {
        countSeats(area.layoutConfig.left);
        countSeats(area.layoutConfig.right);
      }

      // Default fallback total seats if custom structure is empty
      if (totalSeats === 0) totalSeats = 18;

      const areaBookings = overlapping.filter(b => b.area === area.categoryId || b.category === area.categoryId);
      const bookedSeatSet = new Set(areaBookings.flatMap(b => b.seats || []));
      const bookedCount = bookedSeatSet.size;
      const availableCount = Math.max(0, totalSeats - bookedCount);
      const occupancyPercentage = Math.round((bookedCount / totalSeats) * 100);

      return {
        categoryId: area.categoryId,
        label: area.label,
        totalSeats,
        bookedCount,
        availableCount,
        occupancyPercentage,
        facilities: facilityMap[area.categoryId] || ['High-Speed WiFi', 'Power Outlets', 'Quiet Space']
      };
    });

    res.json({
      date: queryDate,
      time: queryTime,
      endTime: queryEndTime,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookings,
  cancelBooking,
  getBookingStats
};
