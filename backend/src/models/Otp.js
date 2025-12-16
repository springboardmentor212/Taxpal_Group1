// src/models/Otp.js
const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  attempts: { type: Number, default: 0 },
  lastAttempt: { type: Date }
});

// safe export to avoid OverwriteModelError during hot-reload / multiple requires
module.exports = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
