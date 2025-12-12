// src/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  fullName: { type: String },
  country: { type: String },
  incomeBracket: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// safe export
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
