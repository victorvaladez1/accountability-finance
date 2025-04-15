import React from "react";
import Navbar from "../components/Navbar";
import "./Planning.css";

function Planning()
{
    return (
        <div className="planning-container">
        <Navbar />
        <h2>Financial Planning Tools</h2>

        <div className="planning-section">
        <h3>🏡 Home Affordability Calculator</h3>
        <p>Estimate how much house you can afford based on income, down payment, loan terms, and interest rates.</p>
        <button disabled>Coming Soon</button>
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