const Conversation = require('../Model/conversationModel');

// Get all conversations
const getAllConversations = async (req, res) => {
  let conversations;
  try {
    conversations = await Conversation.find().sort({ updatedAt: -1 });
  } catch (err) {
    console.log(err);
  }
  if (!conversations) {
    return res.status(404).json({ message: 'No conversations found' });
  }
  return res.status(200).json({ conversations });
};

// Get single conversation
const getConversationById = async (req, res) => {
  const id = req.params.id;
  let conversation;
  try {
    conversation = await Conversation.findById(id);
  } catch (err) {
    console.log(err);
  }
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  return res.status(200).json({ conversation });
};

// Create new conversation
const createConversation = async (req, res) => {
  const { itemId, itemName, itemPhoto, buyerName } = req.body;
  let conversation;
  try {
    conversation = new Conversation({ itemId, itemName, itemPhoto, buyerName, messages: [] });
    await conversation.save();
  } catch (err) {
    console.log(err);
  }
  if (!conversation) {
    return res.status(400).json({ message: 'Unable to create conversation' });
  }
  return res.status(201).json({ conversation });
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
    console.log(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteConversation = async (req, res) => {
  const id = req.params.id;
  try {
    await Conversation.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Conversation deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteConversation = deleteConversation;
exports.getAllConversations = getAllConversations;
exports.getConversationById = getConversationById;
exports.createConversation = createConversation;
exports.sendMessage = sendMessage;