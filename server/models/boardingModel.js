const mongoose = require('mongoose');

const boardingSchema = new mongoose.Schema(
  {
    boardingId: {
      type: Number,
      required: false,
      unique: true,
      // You can implement auto-increment logic later if strictly needed, or let MongoDB use _id primarily.
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    propertyType: { type: String, required: true },
    totalRooms: { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    maxOccupantsPerRoom: { type: Number, required: true },
    attachedBathroom: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    waterIncluded: { type: Boolean, default: false },
    electricityIncluded: { type: Boolean, default: false },
    genderPreference: { type: String, enum: ['Male', 'Female', 'Any'], default: 'Any' },
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    availabilityStatus: { type: String, enum: ['Available', 'Full', 'Under Maintenance'], default: 'Available' },
    ownerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    imageUrls: { type: [String], default: [] }
  },
  {
    timestamps: true,
  }
);

// If boardingId is empty but needed as sequential, this pre-save can handle it or use a plugin.
boardingSchema.pre('save', async function (next) {
  if (!this.boardingId) {
    // Basic fallback to timestamp if sequential isn't configured, though typically _id is used
    this.boardingId = Math.floor(Math.random() * 1000000); 
  }
  next();
});

module.exports = mongoose.model('Boarding', boardingSchema);
