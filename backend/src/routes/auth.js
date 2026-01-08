// src/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/* ---------------------------
   SIGNUP (legacy - optional)
--------------------------- */
router.post("/signup", async (req, res, next) => {
  try {
    await authController.signup(req, res);
  } catch (e) {
    next(e);
  }
});

/* ---------------------------
   SIGNUP WITH OTP VERIFY
--------------------------- */
router.post("/signup-verify", async (req, res, next) => {
  try {
    await authController.signupVerify(req, res);
  } catch (e) {
    next(e);
  }
});

/* ---------------------------
   LOGIN (returns JWT token)
--------------------------- */
router.post("/login", async (req, res, next) => {
  try {
    await authController.login(req, res);
  } catch (e) {
    next(e);
  }
});

/* ---------------------------
   RESET PASSWORD
   accepts:
   - { resetToken, newPassword }
   - OR { email, otp, newPassword }
--------------------------- */
router.post("/reset", async (req, res, next) => {
  try {
    await authController.reset(req, res);
  } catch (e) {
    next(e);
  }
});

/* ---------------------------
   LOGOUT (JWT-based)
   Frontend clears localStorage
--------------------------- */
router.post("/logout", (req, res) => {
  // No server-side state for JWT logout
  return res.json({ success: true });
});

module.exports = router;
