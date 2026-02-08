const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // needed
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      index: true, // reports filter
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      default: "Other",
      index: true, // category reports
    },

    date: {
      type: Date,
      required: true,
      index: true, // time-based reports
    },
  },
  {
    timestamps: true,
  }
);

/* Compound indexes for real-world queries */
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ user: 1, type: 1, date: -1 });
TransactionSchema.index({ user: 1, category: 1, date: -1 });

module.exports = mongoose.model("Transaction", TransactionSchema);




/*
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      default: "Other",
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
*/