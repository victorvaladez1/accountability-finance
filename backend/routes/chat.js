import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/ask", async (req, res) => {
    const { message } = req.body;

    console.log("✅ Received message:", message);
    console.log("🔐 API key exists?", !!process.env.OPENAI_API_KEY);

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error("❌ OpenAI API error:", err.response?.data || err.message || err);
        res.status(500).json({ error: "Failed to get response from OpenAI." });
    }
});


export default router;
