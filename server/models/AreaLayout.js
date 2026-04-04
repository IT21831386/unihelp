const mongoose = require('mongoose');

const areaLayoutSchema = new mongoose.Schema({
  categoryId: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  layoutConfig: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AreaLayout', areaLayoutSchema);
