const express = require("express");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");

const router = express.Router();

/* ----------------------------
   Utility: Date filter
---------------------------- */
function getDateFilter(query) {
  const filter = {};
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }
  return filter;
}

/* ============================
   GET /api/reports/summary
============================ */
router.get("/summary", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const dateFilter = getDateFilter(req.query);

    const result = await Transaction.aggregate([
      { $match: { user: userId, ...dateFilter } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0;
    let expense = 0;

    result.forEach(r => {
      if (r._id === "income") income = r.total;
      if (r._id === "expense") expense = r.total;
    });

    res.json({
      income,
      expense,
      balance: income - expense
    });
  } catch (err) {
    console.error("Summary report error:", err);
    res.status(500).json({ error: "Failed to generate summary report" });
  }
});

/* ============================
   GET /api/reports/category
============================ */
router.get("/category", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const dateFilter = getDateFilter(req.query);

    const data = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error("Category report error:", err);
    res.status(500).json({ error: "Failed to generate category report" });
  }
});

/* ============================
   GET /api/reports/monthly
============================ */
router.get("/monthly", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const dateFilter = getDateFilter(req.query);

    const data = await Transaction.aggregate([
      { $match: { user: userId, ...dateFilter } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(data);
  } catch (err) {
    console.error("Monthly report error:", err);
    res.status(500).json({ error: "Failed to generate monthly report" });
  }
});

/* ============================
   GET /api/reports/pdf
   Generate PDF report
============================ */
router.get("/pdf", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const dateFilter = getDateFilter(req.query);

    // Fetch summary data
    const summaryAgg = await Transaction.aggregate([
      { $match: { user: userId, ...dateFilter } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0;
    let expense = 0;
    summaryAgg.forEach(r => {
      if (r._id === "income") income = r.total;
      if (r._id === "expense") expense = r.total;
    });

    // Category breakdown
    const categories = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Create PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "inline; filename=taxpal-report.pdf"
    );

    doc.pipe(res);

    /* -------- PDF CONTENT -------- */

    doc.fontSize(20).text("TaxPal Financial Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Generated on: ${new Date().toDateString()}`);
    doc.moveDown(2);

    doc.fontSize(16).text("Summary");
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total Income: ₹${income}`);
    doc.text(`Total Expense: ₹${expense}`);
    doc.text(`Balance: ₹${income - expense}`);
    doc.moveDown();

    doc.fontSize(16).text("Expenses by Category");
    doc.moveDown(0.5);
    doc.fontSize(12);

    categories.forEach(c => {
      doc.text(`${c._id}: ₹${c.total}`);
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
});

const { Parser } = require("json2csv");

/* ============================
   GET /api/reports/csv
   Export transactions as CSV
============================ */
router.get("/csv", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const dateFilter = getDateFilter(req.query);

    const transactions = await Transaction.find({
      user: userId,
      ...dateFilter
    })
      .sort({ date: -1 })
      .lean();

    const fields = [
      {
        label: "Date",
        value: row =>
          new Date(row.date).toISOString().split("T")[0]
      },
      { label: "Type", value: "type" },
      { label: "Category", value: "category" },
      { label: "Description", value: "description" },
      { label: "Amount", value: "amount" }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=taxpal-transactions.csv"
    );

    res.status(200).send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

module.exports = router;
