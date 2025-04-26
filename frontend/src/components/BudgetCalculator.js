import React, { useState } from 'react';
import "./HomeAffordabilityCalculator.css";

const BudgetCalculator = () => {
    const [income, setIncome] = useState("");
    const [result, setResult] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const monthlyIncome = parseFloat(income);

        const needs = monthlyIncome * 0.5;
        const wants = monthlyIncome * 0.3;
        const savings = monthlyIncome * 0.2;

        setResult({
            needs: needs.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            wants: wants.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            savings: savings.toLocaleString(undefined, { minimumFractionDigits: 2 }),
        });
    };

    return (
        <div>
            <form className="calculator-form" onSubmit={handleSubmit}>
                <label>
                    Monthly Income:
                    <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Calculate</button>

                {result && (
                    <div className="calculate-results">
                        <p><strong>Needs (50%):</strong> ${result.needs}</p>
                        <p><strong>Wants (30%):</strong> ${result.wants}</p>
                        <p><strong>Savings (20%):</strong> ${result.savings}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default BudgetCalculator;
