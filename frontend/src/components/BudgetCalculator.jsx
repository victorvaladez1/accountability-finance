import React, { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector, Legend
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
                                    <defs>
                                    {["#1E88E5", "#F57C00", "#43A047"].map((color, index) => (
                                        <linearGradient id={`budget-color-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                                        </linearGradient>
                                    ))}
                                    <filter id="budget-shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
                                    </filter>
                                    </defs>

                                    <Pie
                                    data={[
                                        { name: "Needs (50%)", value: result.needsRaw },
                                        { name: "Wants (30%)", value: result.wantsRaw },
                                        { name: "Savings (20%)", value: result.savingsRaw },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    filter="url(#budget-shadow)"
                                    activeShape={({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill }) => {
                                        const RADIAN = Math.PI / 180;
                                        return (
                                        <g>
                                            <Sector
                                            cx={cx}
                                            cy={cy}
                                            innerRadius={innerRadius}
                                            outerRadius={outerRadius + 6}
                                            startAngle={startAngle}
                                            endAngle={endAngle}
                                            fill={fill}
                                            />
                                        </g>
                                        );
                                    }}
                                    >
                                    {["#1E88E5", "#F57C00", "#43A047"].map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#budget-color-${index})`} />
                                    ))}
                                    </Pie>

                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                        border: "1px solid #e0e0e0",
                                    }}
                                    itemStyle={{ color: "#333", fontWeight: 500 }}
                                    formatter={(value, name) => {
                                        const total = result.needsRaw + result.wantsRaw + result.savingsRaw;
                                        const percent = ((value / total) * 100).toFixed(2);
                                        return [`$${value.toFixed(2)}`, `${name} (${percent}%)`];
                                    }}
                                    />
                                    <Legend verticalAlign="bottom" />
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