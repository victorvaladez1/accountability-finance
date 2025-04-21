import express from "express";
import Holding from "../models/Holding.js";
import Account from "../models/Account.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Get all holdings for an investment account
router.get("/:accountId", verifyToken, async (req, res) => {
    try {
        const account = await Account.findOne({ _id: req.params.accountId, user: req.user.id });
        if (!account || account.type !== "Investment") {
            return res.status(403).json({ message: "Access denied or invalid account type" });
        }

        const holdings = await Holding.find({ account: req.params.accountId });
        res.json(holdings);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Add a holding to an investment account
router.post("/", verifyToken, async (req, res) => {
    const { accountId, ticker, shares, averageCost } = req.body;

    try {
        const account = await Account.findOne({ _id: accountId, user: req.user.id });
        if (!account || account.type !== "Investment") {
            return res.status(403).json({ message: "Access denied or invalid account type" });
        }

        const newHolding = new Holding({ account: accountId, ticker, shares, averageCost });
        const saved = await newHolding.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});