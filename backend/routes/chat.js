import express from "express";
import axios from "axios";
import verifyToken from "../middleware/verifyToken.js";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

router.post("/ask", verifyToken, async (req, res) => {
    const { message } = req.body;

    console.log("✅ Received message:", message);
    console.log("🔐 API key exists?", !!process.env.OPENAI_API_KEY);

    try {
        // Save user's message

        await ChatMessage.create({
            user: req.user.id,
            role: "user",
            content: message,
        });

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful and friendly budgeting coach that gives personal finance advice to users in their 20s. Be realistic, practical, and encouraging. Your tone should be chill, supportive, and easy to understand — no finance jargon unless you explain it.`,
                    },
                    {
                        role: "user",
                        content: message,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const reply = response.data.choices[0].message.content;

        // Save assistant's reply

        await ChatMessage.create({
            user: req.user.id,
            role: "assistant",
            content: reply,
        });

        res.json({ reply });
    } catch (err) {
        console.error("❌ OpenAI API error:", err.response?.data || err.message || err);
        res.status(500).json({ error: "Failed to get response from OpenAI." });
    }
});

router.get("/history", verifyToken, async (req, res) => {
    try {
        const messages = await ChatMessage.find({ user: req.user.id })
        .sort({ createdAt: 1 }); // oldest first
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to load chat history. "});
    }
});

router.delete("/history", verifyToken, async (req, res) => {
    try {
        await ChatMessage.deleteMany({ user: req.user.id });
        res.json({ message: "Chat history cleared." });
    } catch (err) {
        res.status(500).json({ error: "Failed to clear chat history."});
    }
});

export default router;
