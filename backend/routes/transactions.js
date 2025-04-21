import express from "express";
import Transaction from "../models/Transaction.js";
import Account from "../models/Account.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all transactions for a user (paginated)
router.get("/", verifyToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments({ user: req.user.id });

    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("account", "name balance");

    res.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create a new transaction
router.post("/", verifyToken, async (req, res) => {
  const { account, type, amount, category, description, date } = req.body;

  try {
    const transaction = new Transaction({
      user: req.user.id,
      account,
      type,
      amount,
      category,
      description,
      date,
    });

    const saved = await transaction.save();

    const accountToUpdate = await Account.findById(transaction.account);

    if (transaction.type === "Expense") {
      accountToUpdate.balance -= transaction.amount;
    } else {
      accountToUpdate.balance += transaction.amount;
    }

    await accountToUpdate.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a transaction
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    const accountToUpdate = await Account.findById(transaction.account);

    if (transaction.type === "Expense") {
      accountToUpdate.balance += transaction.amount;
    } else {
      accountToUpdate.balance -= transaction.amount;
    }

    await accountToUpdate.save();

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a transaction
router.put("/:id", verifyToken, async (req, res) => {
  const { account, type, amount, category, description, date } = req.body;

  try {
    const oldTransaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!oldTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const oldAccount = await Account.findById(oldTransaction.account);

    // Revert old effect
    if (oldTransaction.type === "Expense") {
      oldAccount.balance += oldTransaction.amount;
    } else {
      oldAccount.balance -= oldTransaction.amount;
    }

    await oldAccount.save();

    // Update transaction
    if (account) oldTransaction.account = account;
    if (type) oldTransaction.type = type;
    if (amount !== undefined) oldTransaction.amount = amount;
    if (category) oldTransaction.category = category;
    if (description) oldTransaction.description = description;
    if (date) oldTransaction.date = date;

    const updatedTransaction = await oldTransaction.save();

    const newAccount = await Account.findById(updatedTransaction.account);

    // Apply new effect
    if (updatedTransaction.type === "Expense") {
      newAccount.balance -= updatedTransaction.amount;
    } else {
      newAccount.balance += updatedTransaction.amount;
    }

    await newAccount.save();

    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Monthly breakdown
router.get("/monthly", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    const monthly = {};

    transactions.forEach((tx) => {
      const month = tx.date.toISOString().slice(0, 7);
      if (!monthly[month]) {
        monthly[month] = [];
      }
      monthly[month].push(tx);
    });

    res.json(monthly);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
