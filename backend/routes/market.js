import express from "express";
import axios from "axios";
const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

router.get("/:ticker", async (req, res) => {
    const ticker = req.params.ticker.toUpperCase();

    const cached = cache[ticker];
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_TTL) {
        return res.json({ price: cached.price, cached: true });
    }

    try {
        const response = await axios.get("https://finnhub.io/api/v1/quote", {
            params: {
                symbol: ticker,
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

        cache[ticker] = {
            price,
            timestamp: now,
        };

        res.json({ price, cached: false });
    } catch (err) {
        console.error("❌ Finnhub error:", err.message || err);
        res.status(503).json({
            message: "Market API limit reached or failed. Showing fallback data.",
            fallback: true,
        });
    }
});

export default router;
