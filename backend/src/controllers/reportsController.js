const Transaction = require("../models/Transaction");

/**
 * Helper: get date range
 */
function getDateRange(period) {
  const now = new Date();
  let start, end;

  if (period === "last-month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  } else if (period === "year") {
    start = new Date(now.getFullYear(), 0, 1);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
  } else {
    // current month
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }

  return { start, end };
}

/**
 * POST: Generate Income Statement
 */
exports.generateIncomeStatement = async (req, res) => {
  try {
    const { period = "current-month" } = req.body;
    const userId = req.user.id;

    const { start, end } = getDateRange(period);

    const data = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    data.forEach(d => {
      if (d._id === "income") income = d.total;
      if (d._id === "expense") expense = d.total;
    });

    res.json({
      reportType: "Income Statement",
      period,
      generatedAt: new Date(),
      income,
      expense,
      netProfit: income - expense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};

/**
 * GET: Recent reports (mock for now)
 */
exports.listRecentReports = async (req, res) => {
  res.json([]);
};
