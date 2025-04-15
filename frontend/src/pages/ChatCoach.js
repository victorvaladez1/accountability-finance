import React from "react";
import Navbar from "../components/Navbar";
import "./ChatCoach.css";
import "./CommonLayout.css";

function ChatCoach() {
    return (
        <div className="page-container">
            <Navbar />
            <h2>Ask Me Anything: Personal Finance Coach</h2>
            <p>This is your AI-powered financial coach. Ask anything about budgeting</p>
            <div className="chat-box-placeholder">
                <p>Chat functionality coming soon...</p>
            </div>
        </div>
    );
}

export default ChatCoach;