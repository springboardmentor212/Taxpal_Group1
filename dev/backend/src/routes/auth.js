// src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup (legacy)
router.post('/signup', async (req, res, next) => {
  try { await authController.signup(req, res); } catch (e) { next(e); }
});

// Signup that verifies OTP server-side then creates user
router.post('/signup-verify', async (req, res, next) => {
  try { await authController.signupVerify(req, res); } catch (e) { next(e); }
});

// Login
router.post('/login', async (req, res, next) => {
  try { await authController.login(req, res); } catch (e) { next(e); }
});

// Reset password (accepts either { resetToken, newPassword } OR { email, otp, newPassword })
router.post('/reset', async (req, res, next) => {
  try { await authController.reset(req, res); } catch (e) { next(e); }
});

module.exports = router;
