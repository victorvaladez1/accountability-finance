const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const verifyToken = require("../middleware/verifyToken");

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

module.exports = router;
