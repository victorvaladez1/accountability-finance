import express from "express";
import Account from "../models/Account.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all accounts
router.get("/", verifyToken, async (req, res) => {
    try {
        const accounts = await Account.find({ user: req.user.id });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Create new account
router.post("/", verifyToken, async (req, res) => {
    const { name, type, balance } = req.body;

    try {
        const newAccount = new Account({
            name,
            type,
            balance,
            user: req.user.id,
        });

        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update account
router.put("/:id", verifyToken, async (req, res) => {
    const { name, type, balance } = req.body;

    try {
        const account = await Account.findOne({ _id: req.params.id, user: req.user.id });

        if (!account) return res.status(404).json({ message: "Account not found" });

        if (name) account.name = name;
        if (type) account.type = type;
        if (balance !== undefined) account.balance = balance;

        const updated = await account.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Delete account
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const account = await Account.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!account) return res.status(404).json({ message: "Account not found" });

        res.json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
