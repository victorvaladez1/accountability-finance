import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HomeAffordabilityCalculator from "../components/HomeAffordabilityCalculator";
import CarAffordabilityCalculator from "../components/CarAffordabilityCalculator";
import LoanPaymentCalculator from "../components/LoanPaymentCalculator";
import RothIRACalculator from "../components/RothIRACalculator";
import MortgagePaymentCalculator from "../components/MortgagePaymentCalculator";
import BudgetCalculator from "../components/BudgetCalculator";
import "./Planning.css";
import "./CommonLayout.css";

function Planning() {
    const [showHomeCalculator, setShowHomeCalculator] = useState(false);
    const [showCarCalculator, setShowCarCalculator] = useState(false);
    const [showLoanCalculator, setShowLoanCalculator] = useState(false);
    const [showRothCalculator, setShowRothCalculator] = useState(false);
    const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
    const [showBudgetCalculator, setShowBudgetCalculator] = useState(false);

    return (
        <div className="planning-container">
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
                <h3>🏡 Mortgage Payment Calculator</h3>
                <p>
                    Break down your estimated monthly mortgage payment, including principal & interest, taxes, and insurance.
                </p>

                <button onClick={() => setShowMortgageCalculator(!showMortgageCalculator)}>
                    {showMortgageCalculator ? "Hide Calculator" : "Show Calculator"}
                </button>

                {showMortgageCalculator && (
                    <div className="calculator-toggle-box">
                        <MortgagePaymentCalculator />
                    </div>
                )}
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

            <div className="calculator-card">
                <h3>📚 Budget Calculator (50/30/20 Rule)</h3>
                <p>
                    Split your monthly after-tax income using the popular 50/30/20 rule: 
                    50% to needs, 30% to wants, and 20% to savings or debt payments.
                </p>

                <button onClick={() => setShowBudgetCalculator(!showBudgetCalculator)}>
                    {showBudgetCalculator ? "Hide Calculator" : "Show Calculator"}
                </button>

                {showBudgetCalculator && (
                    <div className="calculator-toggle-box">
                    <BudgetCalculator />
                    </div>
                )}
            </div>

            <div className="calculator-card">
                <h3>📉 Loan Payment Calculator</h3>
                <p>
                    Calculate your estimated monthly payment and total interest paid over the life of your loan. 
                    Perfect for understanding how much you'll owe based on loan amount, term, and interest rate.
                </p>

                <button onClick={() => setShowLoanCalculator(!showLoanCalculator)}>
                    {showLoanCalculator ? "Hide Calculator" : "Show Calculator"}
                </button>

                {showLoanCalculator && (
                    <div className="calculator-toggle-box">
                    <LoanPaymentCalculator />
                    </div>
                )}
            </div>

            <div className="calculator-card">
                <h3>🧮 Roth IRA Growth Calculator</h3>
                <p>
                    Estimate how your Roth IRA contributions could grow over time based on your annual contribution,
                    expected return rate, and investment period. Plan your retirement savings effectively!
                </p>

                <button onClick={() => setShowRothCalculator(!showRothCalculator)}>
                    {showRothCalculator ? "Hide Calculator" : "Show Calculator"}
                </button>

                {showRothCalculator && (
                    <div className="calculator-toggle-box">
                    <RothIRACalculator />
                    </div>
                )}
            </div>        
        </div>
    );
}

export default Planning;