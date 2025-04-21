import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ChatCoach.css";
import "./CommonLayout.css";

function ChatCoach() {
    const [input, setInput] = useState("");
    const [chatLog, setChatLog] = useState([]);

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
    

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setChatLog([...chatLog, userMessage]);
        setInput("");

        try {
            console.log("📤 Sending message:", input);

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

            console.log("✅ Response from backend:", res.data);
            const assistantMessage = {
                role: "assistant",
                content: res.data.reply,
            };
            setChatLog((prev) => [...prev, assistantMessage]);
        } catch (err) {
            console.error("❌ Error from backend:", err);
            setChatLog((prev) => [
                ...prev,
                { role: "assistant", content: "Error: Could not fetch response." },
            ]);
        }
    };
    
    return (
        <div className="page-container">
        <Navbar />
        <h2>Ask Me Anything: Personal Finance Coach</h2>
        <div className="chat-box">
            <div className="chat-log">
                {chatLog.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                        <strong>{msg.role === "user" ? "You" : "Coach"}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a personal finance question..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    </div>
    );
}

export default ChatCoach;