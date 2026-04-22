const mongoose = require('mongoose');

const boardingBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    boarding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boarding',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    message: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('BoardingBooking', boardingBookingSchema);
