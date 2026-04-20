const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  itemId: { type: String, default: '' },
  itemName: { type: String, required: true },
  itemPhoto: { type: String, default: '' },
  buyerId: { type: String, default: '' },
  buyerName: { type: String, required: true },
  sellerId: { type: String, default: '' },
  sellerName: { type: String, default: '' },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
