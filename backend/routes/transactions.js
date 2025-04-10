const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const verifyToken = require("../middleware/verifyToken");

// Get all transactions for a user
router.get("/", verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1});
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message});
    }
});

// Create a new transaction
router.post("/", verifyToken, async (req, res) => {
    const { account, type, amount, category, description, date} = req.body;

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
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message});
    }
});

module.exports = router;