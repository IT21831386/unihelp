const mongoose = require('mongoose');
const Conversation = require('../models/conversationModel');
const Marketplace = require('../models/marketplaceModel');

const uri = 'mongodb+srv://db_user:tharaka123@cluster0.xhawcbe.mongodb.net/unihelp?retryWrites=true&w=majority';

async function migrate() {
  try {
    await mongoose.connect(uri);
    console.log('--- Connected to MongoDB ---');

    console.log('1. Migrating Marketplace Items...');
    const itemsResult = await Marketplace.updateMany(
      { sellerName: 'Ashan Karunaratne', $or: [{ sellerId: { $exists: false } }, { sellerId: '' }, { sellerId: null }] },
      { $set: { sellerId: 'user_001' } }
    );
    console.log(`Updated ${itemsResult.modifiedCount} items.`);

    console.log('2. Migrating Conversation Buyers...');
    const convBuyersResult = await Conversation.updateMany(
      { buyerName: 'Ashan Karunaratne', $or: [{ buyerId: { $exists: false } }, { buyerId: '' }, { buyerId: null }] },
      { $set: { buyerId: 'user_001' } }
    );
    console.log(`Updated ${convBuyersResult.modifiedCount} conversations (Buyer).`);

    console.log('3. Migrating Conversation Sellers...');
    const convSellersResult = await Conversation.updateMany(
      { sellerName: 'Ashan Karunaratne', $or: [{ sellerId: { $exists: false } }, { sellerId: '' }, { sellerId: null }] },
      { $set: { sellerId: 'user_001' } }
    );
    console.log(`Updated ${convSellersResult.modifiedCount} conversations (Seller).`);

    console.log('--- Migration Completed ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
