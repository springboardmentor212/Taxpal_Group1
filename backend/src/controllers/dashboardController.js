const Transaction = require("../models/Transaction");

/**
 * Helper: get date range based on filter
 */
function getDateRange(range) {
  const now = new Date();
  let start;

  if (range === "year") {
    start = new Date(now.getFullYear(), 0, 1);
  } else if (range === "quarter") {
    const q = Math.floor(now.getMonth() / 3);
    start = new Date(now.getFullYear(), q * 3, 1);
  } else {
    // month (default)
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { start, end: now };
}

/**
 * Helper: build income vs expense bar chart
 */
function buildBarChart(txns, range) {
  let labels = [];
  let income = [];
  let expense = [];

  if (range === "year") {
    labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    income = Array(12).fill(0);
    expense = Array(12).fill(0);

    txns.forEach(t => {
      const idx = new Date(t.date).getMonth();
      if (t.type === "income") income[idx] += t.amount;
      else expense[idx] += t.amount;
    });
  } else if (range === "quarter") {
    labels = ["Month 1", "Month 2", "Month 3"];
    income = Array(3).fill(0);
    expense = Array(3).fill(0);

    txns.forEach(t => {
      const idx = new Date(t.date).getMonth() % 3;
      if (t.type === "income") income[idx] += t.amount;
      else expense[idx] += t.amount;
    });
  } else {
    // month → weeks
    labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
    income = Array(4).fill(0);
    expense = Array(4).fill(0);

    txns.forEach(t => {
      const idx = Math.min(3, Math.floor(new Date(t.date).getDate() / 7));
      if (t.type === "income") income[idx] += t.amount;
      else expense[idx] += t.amount;
    });
  }

  return { labels, income, expense };
}

/**
 * Helper: build expense pie chart (CURRENT RANGE)
 */
function buildExpensePie(txns) {
  const map = {};

  txns.forEach(t => {
    if (t.type !== "expense") return;
    map[t.category] = (map[t.category] || 0) + t.amount;
  });

  return {
    labels: Object.keys(map),
    datasets: [
      {
        data: Object.values(map),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#22c55e",
          "#3b82f6",
          "#a855f7",
        ],
      },
    ],
  };
}

/**
 * GET /api/dashboard?range=month|quarter|year
 */
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const range = req.query.range || "month";
    const { start, end } = getDateRange(range);

    // ✅ FIXED QUERY (user, not userId)
    const txns = await Transaction.find({
      user: userId,
      date: { $gte: start, $lte: end },
    });

    let income = 0;
    let expense = 0;

    txns.forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    const savingsRate =
      income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0;

    res.json({
      income,
      expense,
      savingsRate,
      chart: buildBarChart(txns, range),
      expensePie: buildExpensePie(txns),
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
