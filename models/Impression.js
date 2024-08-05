const mongoose = require('mongoose');

const impressionSchema = new mongoose.Schema({
  impression_id: String,
  timestamp: Date,
  banner_size: String,
  category: String,
  user_id: String,
  bid: Number,
});
impressionSchema.index({ banner_size: 1, category: 1 });

module.exports = mongoose.model('Impression', impressionSchema);