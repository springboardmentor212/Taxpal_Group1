// src/routes/otp.js
const express = require('express');
const router = express.Router();

// destructure required functions from controller
const { requestOtp, verifyOtp } = require('../controllers/otpController');

// route definitions
router.post('/request', requestOtp);
router.post('/verify', verifyOtp);

module.exports = router;
