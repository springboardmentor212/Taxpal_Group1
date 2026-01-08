const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  try {
    const txn = await Transaction.create({
      ...req.body,
      userId: req.user.id,
    });
    res.json(txn);
  } catch (e) {
    res.status(400).json({ error: "Failed to save transaction" });
  }
};

exports.getTransactions = async (req, res) => {
  const txns = await Transaction.find({ userId: req.user.id }).sort({
    date: -1,
  });
  res.json(txns);
};
