import React, { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector, Legend
} from "recharts";
import "./HomeAffordabilityCalculator.css";

const CarAffordabilityCalculator = () => {
    const [form, setForm] = useState({
        monthlyIncome: "",
        downPayment: "",
        loanTerm: 4,
        interestRate: "",
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const monthlyIncome = parseFloat(form.monthlyIncome);
        const downPayment = parseFloat(form.downPayment);
        const loanTerm = parseFloat(form.loanTerm);
        const interestRate = parseFloat(form.interestRate) / 100 / 12;

        if (isNaN(monthlyIncome) || isNaN(downPayment) || isNaN(interestRate) || monthlyIncome <= 0 || interestRate <= 0) {
            alert("Please enter valid details.");
            return;
        }

        const maxMonthlyPayment = monthlyIncome * 0.10;
        const months = loanTerm * 12;
        const factor = (Math.pow(1 + interestRate, months) - 1) / (interestRate * Math.pow(1 + interestRate, months));
        const loanAmount = maxMonthlyPayment * factor;
        const totalCarBudget = loanAmount + downPayment;

        setResult({
            maxMonthlyPayment: maxMonthlyPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            loanAmount: loanAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            totalCarBudget: totalCarBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            downPayment,
        });
    };

    return (
        <div>
            <div className="calculator-visuals-wrapper">
                {/* Left Half: Calculator */}
                <div className="calculator-section">
                    <form className="calculator-form" onSubmit={handleSubmit}>
                        <label>Gross Monthly Income:</label>
                        <input type="number" name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} required />
                        <label>Down Payment:</label>
                        <input type="number" name="downPayment" value={form.downPayment} onChange={handleChange} required />
                        <label>Loan Term (years):</label>
                        <input type="number" name="loanTerm" value={form.loanTerm} onChange={handleChange} required />
                        <label>Interest Rate (%):</label>
                        <input type="number" step="0.01" name="interestRate" value={form.interestRate} onChange={handleChange} required />
                        <button type="submit">Calculate</button>
                    </form>
                </div>

                {/* Right Half: Summary Card and Pie Chart */}
                <div className="visuals-section">
                    {result && (
                        <div className="right-container">
                            <div className="summary-card">
                                <h3>Car Budget Summary</h3>
                                <p><strong>Max Monthly Car Payment:</strong> ${result.maxMonthlyPayment}</p>
                                <p><strong>Estimated Loan Amount:</strong> ${result.loanAmount}</p>
                                <p><strong>Total Car Budget:</strong> ${result.totalCarBudget}</p>
                            </div>

                            <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <defs>
                                    {/* Soft modern gradients for each slice */}
                                    <linearGradient id="loanAmountGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#1E88E5" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#1E88E5" stopOpacity={0.5} />
                                    </linearGradient>
                                    <linearGradient id="downPaymentGradient" x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor="#43A047" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#43A047" stopOpacity={0.5} />
                                    </linearGradient>

                                    {/* Soft drop shadow effect */}
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
                                    </filter>
                                    </defs>

                                    <Pie
                                    data={[
                                        { name: "Loan Amount", value: parseFloat(result.loanAmount.replace(/,/g, "")) },
                                        { name: "Down Payment", value: result.downPayment },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    filter="url(#shadow)"
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
                                    <Cell fill="url(#loanAmountGradient)" />
                                    <Cell fill="url(#downPaymentGradient)" />
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
                                        const total = parseFloat(result.loanAmount.replace(/,/g, "")) + result.downPayment;
                                        const percent = ((value / total) * 100).toFixed(2);
                                        return [`$${value.toFixed(2)}`, `${name} (${percent}%)`];
                                    }}
                                    />

                                    <Legend verticalAlign="bottom" height={36} />
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

export default CarAffordabilityCalculator;