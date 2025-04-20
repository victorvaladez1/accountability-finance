import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HomeAffordabilityCalculator from "../components/HomeAffordabilityCalculator";
import CarAffordabilityCalculator from "../components/CarAffordabilityCalculator";
import "./Planning.css";
import "./CommonLayout.css";

function Planning() {
    const [showHomeCalculator, setShowHomeCalculator] = useState(false);
    const [showCarCalculator, setShowCarCalculator] = useState(false);

    return (
        <div className="page-container">
            <Navbar />
            <h2>Financial Planning Tools</h2>
            
            <div>
                <div className="calculator-card">
                    <h3>🏠 Home Affordability Calculator</h3>
                    <p>
                        Estimate how much house you can afford based on your income,
                        down payment, interest rate, and other debt. This calculator follows the{" "}
                        <strong>28/36 rule</strong> — meaning no more than 28% of your gross income
                        should go to housing expenses, and no more than 36% toward total debt
                        (including credit cards, car payments, student loans, etc).
                    </p>

                    <button onClick={() => setShowHomeCalculator(!showHomeCalculator)}>
                        {showHomeCalculator ? "Hide Calculator" : "Show Calculator"}
                    </button>

                    {showHomeCalculator && (
                        <div className="calculator-toggle-box">
                            <HomeAffordabilityCalculator />
                        </div>
                    )}
                </div>
            </div>

            <div className="calculator-card">
                <h3>🚗 Car Affordability Calculator</h3>
                <p>
                    Use the <strong>20/4/10 rule</strong> to determine how much car you can afford. This rule suggests:
                    20% down payment, 4-year loan term, and a monthly payment no more than 10% of your gross monthly income.
                </p>
                
                <button onClick={() => setShowCarCalculator(!showCarCalculator)}>
                        {showCarCalculator ? "Hide Calculator" : "Show Calculator"}
                    </button>

                    {showCarCalculator && (
                        <div className="calculator-toggle-box">
                            <CarAffordabilityCalculator />
                        </div>
                    )}
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