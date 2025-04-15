const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" }, // <== must reference Account
  type: { type: String, enum: ["Income", "Expense"], required: true },
  amount: { type: Number, required: true },
  category: String,
  description: String,
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
