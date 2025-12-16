// src/controllers/otpController.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Otp = require('../models/Otp');
const { sendMail } = require('../mailer');

const OTP_EXP_MIN = Number(process.env.OTP_EXPIRY_MINUTES || 5);
const MAX_OTP_ATTEMPTS = Number(process.env.MAX_OTP_ATTEMPTS || 5);

function genOtp() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return String(num);
}

function hashOtp(otp) {
  const secret = process.env.OTP_HASH_SECRET || '';
  return crypto.createHmac('sha256', secret).update(String(otp)).digest('hex');
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function looksLikeEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Request OTP
 */
exports.requestOtp = async (req, res) => {
  console.log('[DEBUG OTP] requestOtp ENTER', { time: new Date().toISOString() });

  try {
    let { email } = req.body || {};
    email = normalizeEmail(email);
    console.log('[DEBUG OTP] normalized email:', email);

    if (!email || !looksLikeEmail(email)) {
      return res.status(400).json({ error: 'valid email is required' });
    }

    const otp = genOtp();
    const otpHash = hashOtp(otp);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXP_MIN * 60 * 1000);

    // remove previous OTPs then save
    await Otp.deleteMany({ email });

    const doc = new Otp({
      email,
      otpHash,
      expiresAt,
      createdAt: now,
      attempts: 0
    });
    await doc.save();

    // send mail in background (do not let mail failure crash request)
    (async () => {
      try {
        const subject = "Your TaxPal verification code";
        const text = `Your TaxPal verification code is ${otp}. It expires in ${OTP_EXP_MIN} minutes.`;
        const html = `<p>Your TaxPal verification code is <strong>${otp}</strong>. It expires in ${OTP_EXP_MIN} minutes.</p>`;
        await sendMail({ to: email, subject, text, html });
        console.log('[DEBUG OTP] email send attempted (background)');
      } catch (mailErr) {
        console.warn('[DEBUG OTP] sendMail failed (background)', mailErr && mailErr.message ? mailErr.message : mailErr);
      }
    })();

    const resp = { message: 'OTP generated' };
    if (process.env.NODE_ENV === 'development') resp.debugOtp = otp; // dev convenience only

    return res.json(resp);
  } catch (err) {
    console.error('requestOtp error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Verify OTP
 */

// inside verifyOtp (replace your current verifyOtp implementation)
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp, purpose } = req.body || {};
    email = normalizeEmail(email);

    console.log('[DEBUG OTP] verifyOtp called for', email, 'raw otp received (length):', (otp ? String(otp).length : 0));

    if (!email || !otp) return res.status(400).json({ error: 'email and otp required' });

    const doc = await Otp.findOne({ email });
    if (!doc) return res.status(400).json({ error: 'No OTP found' });

    if (doc.expiresAt && doc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: doc._id });
      return res.status(400).json({ error: 'OTP expired' });
    }

    if ((doc.attempts || 0) >= MAX_OTP_ATTEMPTS) {
      await Otp.deleteOne({ _id: doc._id });
      return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
    }

    const providedHash = hashOtp(otp);

    if (providedHash !== doc.otpHash) {
      doc.attempts = (doc.attempts || 0) + 1;
      doc.lastAttempt = new Date();
      await doc.save();

      if (doc.attempts >= MAX_OTP_ATTEMPTS) {
        await Otp.deleteOne({ _id: doc._id });
        return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
      }
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP valid -> delete OTP doc (to prevent reuse)
    await Otp.deleteOne({ _id: doc._id });

    // If this verification is for password reset, also return a short-lived reset token
    if (purpose === 'reset') {
      const jwtSecret = process.env.JWT_SECRET || 'secret';
      // short expiry for reset token (e.g. 15 minutes)
      const token = jwt.sign({ email }, jwtSecret, { expiresIn: process.env.RESET_TOKEN_EXPIRES || '15m' });
      return res.json({ verified: true, resetToken: token });
    }

    return res.json({ verified: true });
  } catch (err) {
    console.error('verifyOtp error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
