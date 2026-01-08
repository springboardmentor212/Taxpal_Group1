const express = require("express");
const { estimatedQuarterlyTax } = require ("../controllers/taxController");
const auth = require ("../middleware/auth");

const router = express.Router();

router.post("/estimate", auth, estimatedQuarterlyTax);

module.exports = router;