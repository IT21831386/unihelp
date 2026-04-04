const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true },
  area: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ type: String, required: true }],
  status: { type: String, default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
