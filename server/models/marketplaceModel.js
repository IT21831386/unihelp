const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketplaceSchema = new Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Furniture', 'Books', 'Clothing', 'Boarding', 'Sports', 'Stationery', 'Other']
    },
    condition: {
        type: String,
        required: true,
        enum: ['Like New', 'Good', 'Fair', 'Poor']
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isNegotiable: {
        type: Boolean,
        required: true,
        default: false
    },
    photos: {
        type: [String],
        validate: [arr => arr.length <= 4, 'Maximum 4 photos allowed']
    },
    showContact: {
        type: Boolean,
        required: true,
        default: false
    },
    phone: {
        type: String,
        default: null
    },
    sellerId: {
        type: String,
        default: ''
    },
    sellerName: {
        type: String,
        default: 'Unknown Seller'
    },
    status: {
        type: String,
        enum: ['active', 'sold'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('marketplaceModel', marketplaceSchema);