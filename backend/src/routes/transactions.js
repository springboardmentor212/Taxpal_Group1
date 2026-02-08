const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

/* =========================
   GET ALL TRANSACTIONS
========================= */
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1, createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("FETCH TX ERROR:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

/* =========================
   CREATE TRANSACTION
========================= */
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, description, amount, category, date } = req.body;

    if (!type || !["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tx = await Transaction.create({
      user: userId,
      type,
      description: description.trim(),
      amount: Number(amount),
      category,
      date: new Date(date), // 🔥 critical for budgets
    });

    res.status(201).json(tx);
  } catch (err) {
    console.error("CREATE TX ERROR:", err);
    res.status(500).json({ message: "Failed to create transaction" });
  }
});

/* =========================
   UPDATE TRANSACTION
========================= */
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, description, amount, category, date } = req.body;

    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        ...(type && { type }),
        ...(description && { description: description.trim() }),
        ...(amount !== undefined && { amount: Number(amount) }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE TX ERROR:", err);
    res.status(500).json({ message: "Failed to update transaction" });
  }
});

/* =========================
   DELETE TRANSACTION
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;

    const tx = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!tx) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE TX ERROR:", err);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
});

module.exports = router;
