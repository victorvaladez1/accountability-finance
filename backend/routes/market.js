import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/:ticker", async (req, res) => {
    const { ticker } = req.params;
    const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

    try {
        const response = await axios.get("https://finnhub.io/api/v1/quote", {
            params: {
                symbol: ticker.toUpperCase(),
                token: FINNHUB_API_KEY,
            },
        });

        const price = response.data.c;

        if (!price) {
            return res.status(503).json({
                message: "Live data unavailable. Showing fallback data.",
                fallback: true,
            });
        }

        res.json({ price });
    } catch (err) {
        console.error("Finnhub error:", err.message);
        res.status(503).json({
            message: "Market API limit reached or failed. Showing fallback data.",
            fallback: true,
        });
    }
});

export default router;