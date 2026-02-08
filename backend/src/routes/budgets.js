const express = require("express");
const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const router = express.Router();

/* =========================
   CREATE BUDGET
========================= */
router.post("/", async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    if (!category || !amount || !month) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      amount: Number(amount),
      month, // "YYYY-MM"
    });

    res.status(201).json(budget);
  } catch (err) {
    console.error("BUDGET CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET BUDGETS (WITH SPENT) ✅ FINAL FIX
========================= */
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const results = await Promise.all(
      budgets.map(async (b) => {
        // 🔥 CRITICAL FIX: strict YYYY-MM parsing
        const [year, month] = b.month.split("-").map(Number);

        const start = new Date(year, month - 1, 1, 0, 0, 0);
        const end = new Date(year, month, 0, 23, 59, 59);

        const spentAgg = await Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.user.id),
              type: "expense",
              category: b.category,
              date: { $gte: start, $lte: end },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const spent = spentAgg[0]?.total || 0;
        const remaining = b.amount - spent;

        let status = "good";
        if (remaining < 0) status = "over";
        else if (remaining <= b.amount * 0.2) status = "warning";

        return {
          ...b,
          spent,
          remaining,
          status,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("BUDGET FETCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   UPDATE BUDGET
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { category, amount, month } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        category,
        amount: Number(amount),
        month,
      },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (err) {
    console.error("BUDGET UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   DELETE BUDGET
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error("BUDGET DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
