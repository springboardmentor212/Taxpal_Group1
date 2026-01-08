const router = require("express").Router();
const { getDashboard } = require("../controllers/dashboardController");

/**
 * GET /api/dashboard?range=month|quarter|year
 * Auth is already applied in server.js
 */
router.get("/", getDashboard);

module.exports = router;
