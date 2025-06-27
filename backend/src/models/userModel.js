const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  profile_image: { type: String },
  account_status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 