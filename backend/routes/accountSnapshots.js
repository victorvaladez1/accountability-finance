import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import AccountSnapshot from "../models/AccountSnapshot.js";

const router = express.Router();

// POST a new snapshot
router.post("/", verifyToken, async (req, res) => {
  try {
    const { accountId, value } = req.body;

    if (!accountId || value == null) {
      return res.status(400).json({ message: "Missing accountId or value" });
    }

    const snapshot = new AccountSnapshot({
      user: req.user.id,
      accountId,
      value,
    });

    await snapshot.save();
    res.status(201).json(snapshot);
  } catch (err) {
    console.error("Error saving account snapshot:", err);
    res.status(500).json({ message: "Failed to save snapshot" });
  }
});

// GET all snapshots for a specific account
router.get("/:accountId", verifyToken, async (req, res) => {
  try {
    const { accountId } = req.params;

    const snapshots = await AccountSnapshot.find({
      user: req.user.id,
      accountId,
    }).sort({ timestamp: 1 });

    res.json(snapshots);
  } catch (err) {
    console.error("Error fetching account snapshots:", err);
    res.status(500).json({ message: "Failed to fetch snapshots" });
  }
});

export default router;
