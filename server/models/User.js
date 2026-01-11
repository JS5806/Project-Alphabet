const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // MVP: Plain text or simple hash (Simulated here)
  username: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);