import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HomeAffordabilityCalculator from "../components/HomeAffordabilityCalculator";
import "./Planning.css";
import "./CommonLayout.css";

function Planning() {
    const [showHomeCalculator, setShowHomeCalculator] = useState(false);

    const toggleOpen = () => {
        setShowHomeCalculator(!showHomeCalculator);
    };

    return (
        <div className="page-container">
            <Navbar />
            <h2>Financial Planning Tools</h2>

            <div className="planning-section">
                <div className="calculator-card">
                    <button onClick={toggleOpen}>
                        {showHomeCalculator ? "Hide Calculator" : "Show Calculator"}
                    </button>
                    {showHomeCalculator && <HomeAffordabilityCalculator />}
                </div>
            </div>

            <div className="planning-section">
                <h3>🚗 Car Affordability Calculator</h3>
                <p>Use the 20/4/10 rule to see what kind of car you can afford responsibly.</p>
                <button disabled>Coming Soon</button>
            </div>

            <div className="planning-section">
                <h3>📉 Loan Payment Calculator</h3>
                <p>Calculate your monthly loan payments and total interest paid.</p>
                <button disabled>Coming Soon</button>
            </div>
        </div>
    );
}

export default Planning;