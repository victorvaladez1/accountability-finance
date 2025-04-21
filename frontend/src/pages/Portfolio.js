import React from "react";
import Navbar from "../components/Navbar";
import "./CommonLayout.css";
import "./Portfolio.css";

function Portfolio() {
    return (
        <div className="page-container">
            <Navbar />
            <h2>Investment Portfolio</h2>
            <p>This feature is coming soon! Track you brokerage accounts, stocks, and real-time market data.</p>
        </div>
    );
}

export default Portfolio;