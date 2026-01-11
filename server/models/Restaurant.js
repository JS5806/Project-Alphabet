const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'General' },
  votes: { type: Number, default: 0 },
  votedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // 중복 투표 방지 및 토글용
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);