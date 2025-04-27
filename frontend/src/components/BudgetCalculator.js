import React, { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import "./HomeAffordabilityCalculator";

const BudgetCalculator = () => {
    const [income, setIncome] = useState("");
    const [result, setResult] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const monthlyIncome = parseFloat(income);

        if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
            alert("Please enter a valid monthly income.");
            return;
        }

        const needs = monthlyIncome * 0.5;
        const wants = monthlyIncome * 0.3;
        const savings = monthlyIncome * 0.2;

        setResult({
            needs: needs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            wants: wants.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            savings: savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            needsRaw: needs,
            wantsRaw: wants,
            savingsRaw: savings,
        });
    };

    return (
        <div>
            <div className="calculator-visuals-wrapper">
                {/* Left Half: Calculator */}
                <div className="calculator-section">
                    <form className="calculator-form" onSubmit={handleSubmit}>
                        <label>Monthly Income:</label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                            required
                        />
                        <button type="submit">Calculate</button>
                    </form>
                </div>

                {/* Right Half: Summary Card and Pie Chart */}
                <div className="visuals-section">
                    {result && (
                        <div className="right-container">
                            <div className="summary-card">
                                <h3>Budget Summary</h3>
                                <p><strong>Needs (50%):</strong> ${result.needs}</p>
                                <p><strong>Wants (30%):</strong> ${result.wants}</p>
                                <p><strong>Savings (20%):</strong> ${result.savings}</p>
                            </div>

                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: "Needs (50%)", value: result.needsRaw },
                                                { name: "Wants (30%)", value: result.wantsRaw },
                                                { name: "Savings (20%)", value: result.savingsRaw },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            innerRadius={60}
                                            label={(entry) => `${entry.name}: $${entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                                            labelStyle={{ fontSize: "12px", fontWeight: "bold", fill: "#4B5563" }}
                                            dataKey="value"
                                            paddingAngle={5}
                                        >
                                            {["#1E88E5", "#F57C00", "#43A047"].map((color, index) => (
                                                <Cell key={`cell-${index}`} fill={color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "8px",
                                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                                                border: "1px solid #dee2e6",
                                                padding: "12px",
                                            }}
                                            formatter={(value) =>
                                                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            }
                                            cursor={{ fill: "rgba(107, 114, 128, 0.05)" }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BudgetCalculator;