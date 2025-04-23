import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import PortfolioSnapshot from "../models/PortfolioSnapshot.js";

// Get latest snapshots
router.get("/", verifyToken, async (req, res) => {
    try {
        const snapshots = await PortfolioSnapshot.find({ user: req.user.id })
        .sort({ timestamp: 1 });
        res.json(snapshots);
    } catch (err) {
        res.status(500).json({ message: "Error fetching snapshots" });
    }
});

// Add a new snapshot
router.post("/", verifyToken, async (req, res) => {
    try {
        const snapshot = new PorfolioSnapshot({
            user: req.user.id,
            value: req.body.value,
        });

        await snapshot.save();
        res.status(201).json(snapshot);
    } catch (err) {
        res.status(500).json({ message: "Error saving snapshot" });
    }
});

export default router;