const express = require('express');
const router = express.Router();
const conversationController = require('../Controller/conversationController');

router.get('/', conversationController.getAllConversations);
router.get('/:id', conversationController.getConversationById);
router.post('/', conversationController.createConversation);
router.post('/:id/message', conversationController.sendMessage);
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;