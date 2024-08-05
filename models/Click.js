const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  click_id: String,
  timestamp: Date,
  impression_id: String,
  user_id: String,
});
clickSchema.index({ impression_id: 1 });

module.exports = mongoose.model('Click', clickSchema);