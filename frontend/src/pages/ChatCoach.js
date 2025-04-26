import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ChatCoach.css";
import "./CommonLayout.css";

function ChatCoach() {
    const [input, setInput] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef(null);

    const suggestedPrompts = [
        "How do I start budgeting?",
        "What's a Roth IRA?",
        "How much house can I afford?"
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get("/api/chat/history", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setChatLog(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch chat history:", err);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatLog]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const now = new Date().toISOString();

        const userMessage = { role: "user", content: input, createdAt: now };
        setChatLog((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "/api/chat/ask",
                { message: input },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const assistantMessage = {
                role: "assistant",
                content: res.data.reply,
                createdAt: new Date().toISOString(),
            };
            setChatLog((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("❌ Error from backend:", err);
            setChatLog((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Error: Could not fetch response.",
                    createdAt: new Date().toISOString(),
                },
            ]);
        }

        setLoading(false);
    };

    const handleClearHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete("/api/chat/history", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setChatLog([]);
        } catch (err) {
            console.error("❌ Failed to clear chat history:", err);
        }
    };

    const sendPrompt = async (prompt) => {
        const now = new Date().toISOString();

        const userMessage = { role: "user", content: prompt, createdAt: now };
        setChatLog((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "/api/chat/ask",
                { message: prompt },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const assistantMessage = {
                role: "assistant",
                content: res.data.reply,
                createdAt: new Date().toISOString(),
            };
            setChatLog((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("❌ Error from backend:", err);
            setChatLog((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Error: Could not fetch response.",
                    createdAt: new Date().toISOString(),
                },
            ]);
        }

        setLoading(false);
    };

    const formatDate = (isoDateStr) => {
        const date = new Date(isoDateStr);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="page-container">
            <Navbar />

            <h2 className="chat-title">Ask Me Anything: Personal Finance Coach</h2>

            <div className="chat-box">
                <div className="chat-log">
                    {chatLog.length === 0 && !loading && (
                        <div className="message assistant" style={{ opacity: 0.6 }}>
                            <em>Ask me anything about budgeting, saving, or finance to get started.</em>
                        </div>
                    )}

                    {(() => {
                        let lastDate = null;

                        return chatLog.map((msg, idx) => {
                            const msgDate = formatDate(msg.createdAt);
                            const showDateSeparator = msgDate !== lastDate;
                            lastDate = msgDate;

                            return (
                                <React.Fragment key={idx}>
                                    {showDateSeparator && (
                                        <div className="date-separator">
                                            <span>{msgDate}</span>
                                        </div>
                                    )}
                                    <div className={`message ${msg.role}`}>
                                        <strong>{msg.role === "user" ? "You" : "Coach"}:</strong> {msg.content}
                                        {msg.createdAt && (
                                            <span className="timestamp">
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </span>
                                        )}
                                    </div>
                                </React.Fragment>
                            );
                        });
                    })()}

                    {loading && (
                        <div className="message assistant">
                            <strong>Coach:</strong> <em>Typing...</em>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                <div className="suggested-prompts">
                    {suggestedPrompts.map((prompt, idx) => (
                        <button
                            key={idx}
                            className="prompt-btn"
                            onClick={() => sendPrompt(prompt)}
                            disabled={loading}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask a personal finance question..."
                    />

                    <button onClick={handleSend} disabled={!input.trim() || loading}>
                        {loading ? "Sending..." : "Send"}
                    </button>

                    <button className="clear-btn-inline" onClick={handleClearHistory}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatCoach;
