const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const requireAuth = require("../middleware/verifyToken");

router.use(requireAuth);

router.get("/monthly-expenses", async (req, res) => {
  try {
    const now = new Date();
    const pastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    console.log("User ID:", req.user.id);
    console.log("Date Range:", pastYear.toISOString(), "->", now.toISOString());

    const results = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          type: "Expense",
          date: { $gte: pastYear, $lte: now }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          total: 1
        }
      }
    ]);

    const monthsMap = {};
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      const key = date.toISOString().slice(0, 7);
      monthsMap[key] = 0;
    }

    results.forEach((r) => {
      monthsMap[r.month] = r.total;
    });

    const monthsArray = Object.keys(monthsMap).map((month) => ({
      month,
      total: monthsMap[month]
    }));

    const totalSpending = monthsArray.reduce((sum, m) => sum + m.total, 0);
    const average = totalSpending / 12;
    const currentMonthKey = now.toISOString().slice(0, 7);
    const currentMonth = monthsMap[currentMonthKey] || 0;

    res.json({
      months: monthsArray,
      average,
      currentMonth
    });
  } catch (err) {
    console.error("Error in monthly-expenses route:", err);
    res.status(500).json({ error: "Server error in analytics route" });
  }
});

module.exports = router;
