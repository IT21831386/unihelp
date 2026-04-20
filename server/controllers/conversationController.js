const Conversation = require('../models/conversationModel');
const User = require('../models/User');

// Get all conversations for a specific user
const getAllConversations = async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    // 1. Find conversations
    const conversations = await Conversation.find({
      $or: [
        { buyerId: userId },
        { sellerId: userId }
      ]
    }).sort({ updatedAt: -1 }).lean();

    // 2. Fetch live names for all participants to avoid hardcoded/stale names
    const userIds = new Set();
    conversations.forEach(c => {
      if (c.buyerId) userIds.add(c.buyerId);
      if (c.sellerId) userIds.add(c.sellerId);
    });

    const users = await User.find({ _id: { $in: Array.from(userIds) } }, 'name').lean();
    const userMap = users.reduce((acc, u) => ({ ...acc, [u._id.toString()]: u.name }), {});

    // 3. Map conversations with live names
    const enrichedConversations = conversations.map(c => ({
      ...c,
      buyerName: userMap[c.buyerId] || c.buyerName || 'Unknown User',
      sellerName: userMap[c.sellerId] || c.sellerName || 'Unknown Seller'
    }));

    return res.status(200).json({ conversations: enrichedConversations });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return res.status(500).json({ message: 'Server error fetching conversations' });
  }
};

// Get single conversation details
const getConversationById = async (req, res) => {
  const id = req.params.id;
  try {
    const conversation = await Conversation.findById(id).lean();
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Fetch live names for participants
    const participants = await User.find({ 
      _id: { $in: [conversation.buyerId, conversation.sellerId].filter(Boolean) } 
    }, 'name').lean();
    
    const userMap = participants.reduce((acc, u) => ({ ...acc, [u._id.toString()]: u.name }), {});

    const enrichedConversation = {
      ...conversation,
      buyerName: userMap[conversation.buyerId] || conversation.buyerName || 'Unknown User',
      sellerName: userMap[conversation.sellerId] || conversation.sellerName || 'Unknown Seller'
    };

    return res.status(200).json({ conversation: enrichedConversation });
  } catch (err) {
    console.error('Error fetching conversation:', err);
    return res.status(500).json({ message: 'Server error fetching conversation' });
  }
};

// Create or retrieve existing conversation
const createConversation = async (req, res) => {
  const { itemId, itemName, itemPhoto, buyerId, buyerName, sellerId, sellerName } = req.body;
  
  if (!itemId || !buyerId || !sellerId) {
    return res.status(400).json({ message: 'itemId, buyerId, and sellerId are required' });
  }

  try {
    // Ensure we are working with string versions of IDs for comparison
    const sItemId = String(itemId).trim();
    const sBuyerId = String(buyerId).trim();
    const sSellerId = String(sellerId).trim();

    // Check if a conversation already exists for this item/buyer/seller triad
    let conversation = await Conversation.findOne({
      itemId: sItemId,
      buyerId: sBuyerId,
      sellerId: sSellerId
    });

    if (conversation) {
      // If it exists, return the existing one
      return res.status(200).json({ conversation, existing: true });
    }

    // Ensure we have participant names, fetching from User if needed
    let finalBuyerName = buyerName;
    let finalSellerName = sellerName;

    if (!finalBuyerName || finalBuyerName === 'Ashan Karunaratne') {
      const bUser = await User.findById(sBuyerId);
      if (bUser) finalBuyerName = bUser.name;
    }
    if (!finalSellerName || finalSellerName === 'Ashan Karunaratne' || finalSellerName === 'Unknown Seller') {
      const sUser = await User.findById(sSellerId);
      if (sUser) finalSellerName = sUser.name;
    }

    // Otherwise, create a new one
    conversation = new Conversation({ 
      itemId, 
      itemName, 
      itemPhoto, 
      buyerId: sBuyerId, 
      buyerName: finalBuyerName || 'University Student', 
      sellerId: sSellerId, 
      sellerName: finalSellerName || 'Item Seller', 
      messages: [] 
    });
    
    await conversation.save();
    return res.status(201).json({ conversation, existing: false });

  } catch (err) {
    console.error('Error creating/finding conversation:', err);
    return res.status(500).json({ message: 'Server error handling conversation' });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  const id = req.params.id;
  const { sender, text } = req.body;
  
  try {
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    conversation.messages.push({ sender, text });
    await conversation.save();
    
    return res.status(200).json({ conversation });
    
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a conversation
const deleteConversation = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Conversation.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    return res.status(200).json({ message: 'Conversation deleted' });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllConversations,
  getConversationById,
  createConversation,
  sendMessage,
  deleteConversation
};