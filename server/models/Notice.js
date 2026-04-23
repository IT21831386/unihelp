const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  noticeNo: { type: String },
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String }, // General, Events, Lost & Found, Special
  location: { type: String }, // used for events
  audience: { type: String, required: true },
  attachments: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
