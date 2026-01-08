require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/taxpal";

async function seed() {
  await mongoose.connect(MONGO_URI);

  const user = await User.findOne();
  if (!user) {
    console.error("❌ No user found. Please sign up first.");
    process.exit(1);
  }

  const categories = [
    "Food",
    "Rent",
    "Transport",
    "Shopping",
    "Entertainment",
  ];

  const transactions = [];

  for (let month = 0; month < 12; month++) {
    // Monthly income
    transactions.push({
      user: user._id,                 // ✅ correct field
      type: "income",
      category: "Salary",
      description: "Monthly salary",  // ✅ required
      amount: 40000 + Math.floor(Math.random() * 5000),
      date: new Date(2025, month, 1),
    });

    // Expenses
    for (let i = 0; i < 6; i++) {
      const cat =
        categories[Math.floor(Math.random() * categories.length)];

      transactions.push({
        user: user._id,                      // ✅ correct field
        type: "expense",
        category: cat,
        description: `${cat} expense`,       // ✅ required
        amount: 1000 + Math.floor(Math.random() * 5000),
        date: new Date(
          2025,
          month,
          Math.floor(Math.random() * 28) + 1
        ),
      });
    }
  }

  await Transaction.insertMany(transactions);
  console.log("✅ Dummy transactions inserted successfully");

  process.exit();
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
