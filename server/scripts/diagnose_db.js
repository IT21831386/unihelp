const mongoose = require('mongoose');
const Conversation = require('../models/conversationModel');
const Marketplace = require('../models/marketplaceModel');

const uri = 'mongodb+srv://db_user:tharaka123@cluster0.xhawcbe.mongodb.net/unihelp?retryWrites=true&w=majority';

async function diagnose() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');

    const oneConv = await Conversation.findOne();
    console.log('\n--- Conversation Probe ---');
    console.log(JSON.stringify(oneConv, null, 2));

    const oneItem = await Marketplace.findOne();
    console.log('\n--- Marketplace Item Probe ---');
    console.log(JSON.stringify(oneItem, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

diagnose();
