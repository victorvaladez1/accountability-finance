import express from "express";
import Transaction from "../models/Transaction.js";
import requireAuth from "../middleware/verifyToken.js";
import { DateTime } from "luxon";

const router = express.Router();
router.use(requireAuth);

router.get("/monthly-expenses", async (req, res) => {
  try {
    const now = DateTime.now().setZone("America/Chicago");
    const pastYear = now.minus({ months: 11 }).startOf("month");
    const endOfToday = now.endOf("day");

    const transactions = await Transaction.find({
      user: req.user.id,
      type: "Expense",
      date: {
        $gte: pastYear.toJSDate(),
        $lte: endOfToday.toJSDate(),
      },
    });

    const grouped = {};
    transactions.forEach((tx) => {
      const monthKey = DateTime.fromJSDate(tx.date).setZone("America/Chicago").toFormat("yyyy-MM");
      grouped[monthKey] = (grouped[monthKey] || 0) + tx.amount;
    });

    const monthsArray = [];
    for (let i = 0; i < 12; i++) {
      const key = now.minus({ months: 11 - i }).toFormat("yyyy-MM");
      monthsArray.push({ month: key, total: grouped[key] || 0 });
    }

    const totalSpending = monthsArray.reduce((sum, m) => sum + m.total, 0);
    const average = totalSpending / 12;
    const currentMonthKey = now.toFormat("yyyy-MM");
    const currentMonth = grouped[currentMonthKey] || 0;

    res.json({
      months: monthsArray,
      average,
      currentMonth,
    });
  } catch (err) {
    console.error("Error in monthly-expenses route:", err);
    res.status(500).json({ error: "Server error in analytics route" });
  }
});

export default router;
