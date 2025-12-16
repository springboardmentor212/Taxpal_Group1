// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const Otp = require('../models/Otp');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

/**
 * Utility: normalize emails
 */
function normalizeEmail(email = '') {
  return String(email || '').trim().toLowerCase();
}

/**
 * Hash OTP using HMAC-SHA256 with OTP_HASH_SECRET.
 * Must match hashing used when storing OTP docs.
 */
function hashOtp(otp) {
  const secret = process.env.OTP_HASH_SECRET || '';
  return crypto.createHmac('sha256', secret).update(String(otp)).digest('hex');
}

/**
 * Legacy signup (no OTP) - kept for compatibility.
 * Body: { username, email, password, fullName, country, incomeBracket }
 */
async function signup(req, res) {
  try {
    const { username, email, password, fullName, country, incomeBracket } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email and password are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });
    if (existing) return res.status(409).json({ error: 'User exists with username or email' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, email: normalizedEmail, password: hashed, fullName, country, incomeBracket });
    await user.save();

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('signup error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * signupVerify
 * Body: { username, email, password, fullName, country, incomeBracket, otp }
 * Server verifies OTP before creating user.
 */
async function signupVerify(req, res) {
  try {
    const { username, email, password, fullName, country, incomeBracket, otp } = req.body || {};
    if (!email || !password || !username || !otp) {
      return res.status(400).json({ error: 'username, email, password and otp are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    const otpDoc = await Otp.findOne({ email: normalizedEmail });
    if (!otpDoc) return res.status(400).json({ error: 'No OTP request found for this email' });

    // expiry check
    if (otpDoc.expiresAt && otpDoc.expiresAt < new Date()) {
      try { await Otp.deleteOne({ _id: otpDoc._id }); } catch (e) {}
      return res.status(400).json({ error: 'OTP expired' });
    }

    // compare provided OTP (hashed) with stored hash
    const computed = hashOtp(otp);
    if (computed !== otpDoc.otpHash) {
      otpDoc.attempts = (otpDoc.attempts || 0) + 1;
      otpDoc.lastAttempt = new Date();
      await otpDoc.save();
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP valid -> create user
    const existing = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });
    if (existing) {
      try { await Otp.deleteOne({ _id: otpDoc._id }); } catch (e) {}
      return res.status(409).json({ error: 'User exists with username or email' });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ username, email: normalizedEmail, password: hashed, fullName, country, incomeBracket });
    await user.save();

    // cleanup OTP doc after successful account creation
    try { await Otp.deleteOne({ _id: otpDoc._id }); } catch (e) {}

    return res.status(201).json({ message: 'User created (verified)' });
  } catch (err) {
    console.error('signupVerify error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Login
 * Accepts `username` (or email) and `password`.
 * Returns a JWT token and basic user info.
 */
async function login(req, res) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    // allow username OR email in the same field
    const normalized = normalizeEmail(username);
    const user = await User.findOne({ $or: [{ username }, { email: normalized }] });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

    return res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error('login error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Reset password (used in forgot-password flow)
 * Accepts either:
 *  - { resetToken, newPassword }  (preferred)
 *  - { email, otp, newPassword }  (legacy)
 *
 * If resetToken provided: verify JWT and extract email.
 * If email+otp provided: validate OTP server-side.
 *
 * On success: hash new password, replace the user's password, delete OTP docs.
 */
async function reset(req, res) {
  try {
    const { email, otp, newPassword, resetToken } = req.body || {};
    let targetEmail = null;

    if (resetToken) {
      // Prefer token flow
      try {
        const payload = jwt.verify(resetToken, process.env.JWT_SECRET || 'secret');
        targetEmail = normalizeEmail(payload.email);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
      if (!newPassword) return res.status(400).json({ error: 'newPassword is required' });
    } else {
      // Legacy flow: email + otp + newPassword
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'email, otp and newPassword are required' });
      }

      const normalizedEmail = normalizeEmail(email);
      const otpDoc = await Otp.findOne({ email: normalizedEmail });
      if (!otpDoc) return res.status(400).json({ error: 'No OTP found for this email' });

      if (otpDoc.expiresAt && otpDoc.expiresAt < new Date()) {
        try { await Otp.deleteOne({ _id: otpDoc._id }); } catch (e) {}
        return res.status(400).json({ error: 'OTP expired' });
      }

      const computed = hashOtp(otp);
      if (computed !== otpDoc.otpHash) {
        otpDoc.attempts = (otpDoc.attempts || 0) + 1;
        otpDoc.lastAttempt = new Date();
        await otpDoc.save();
        return res.status(400).json({ error: 'Invalid OTP' });
      }

      // OTP validated
      targetEmail = otpDoc.email;
    }

    // find user and update password
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      try { await Otp.deleteMany({ email: targetEmail }); } catch (e) {}
      return res.status(404).json({ error: 'User not found' });
    }

    // hash new password and update
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashed;
    await user.save();

    // cleanup any OTPs for this email
    try { await Otp.deleteMany({ email: targetEmail }); } catch (e) {}

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('reset error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  signup,
  signupVerify,
  login,
  reset,
};
