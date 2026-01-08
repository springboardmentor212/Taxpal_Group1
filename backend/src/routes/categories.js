const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");

/* =========================
   GET categories
========================= */
router.get("/", auth, async (req, res) => {
  const { type } = req.query;
  const filter = { userId: req.user.id };
  if (type) filter.type = type;

  const cats = await Category.find(filter).sort({ name: 1 });
  res.json(cats);
});

/* =========================
   CREATE category
========================= */
router.post("/", auth, async (req, res) => {
  const { name, type } = req.body;

  const colors = ["#ff3b3b", "#2ecc71", "#3498db", "#f1c40f", "#9b59b6"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  const cat = await Category.create({
    userId: req.user.id,
    name,
    type,
    color,
  });

  res.status(201).json(cat);
});

/* =========================
   DELETE category
========================= */
router.delete("/:id", auth, async (req, res) => {
  await Category.deleteOne({
    _id: req.params.id,
    userId: req.user.id,
  });

  res.json({ success: true });
});

module.exports = router;
