import React, { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector, Legend
} from "recharts";
import "./LoanPaymentCalculator.css";

const LoanPaymentCalculator = () => {
    const [form, setForm] = useState({
        loanAmount: "",
        interestRate: "",
        loanTerm: "",
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const principal = parseFloat(form.loanAmount);
        const annualRate = parseFloat(form.interestRate);
        const termYears = parseFloat(form.loanTerm);

        if (isNaN(principal) || isNaN(annualRate) || isNaN(termYears) || principal <= 0 || annualRate <= 0 || termYears <= 0) {
            alert("Please enter valid loan details.");
            return;
        }

        const monthlyRate = annualRate / 100 / 12;
        const totalPayments = termYears * 12;

        const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - principal;

        setResult({
            monthlyPayment: monthlyPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            totalInterest: totalInterest.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            totalPayment: totalPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            principal,
            totalInterestRaw: totalInterest,
        });
    };

    return (
        <div>
            <div className="calculator-visuals-wrapper">
                {/* Left Half: Calculator */}
                <div className="calculator-section">
                    <form className="calculator-form" onSubmit={handleSubmit}>
                        <label>Loan Amount:</label>
                        <input
                            type="number"
                            name="loanAmount"
                            value={form.loanAmount}
                            onChange={handleChange}
                            required
                        />
                        <label>Interest Rate (%):</label>
                        <input
                            type="number"
                            step="0.01"
                            name="interestRate"
                            value={form.interestRate}
                            onChange={handleChange}
                            required
                        />
                        <label>Loan Term (Years):</label>
                        <input
                            type="number"
                            name="loanTerm"
                            value={form.loanTerm}
                            onChange={handleChange}
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
                                <h3>Loan Payment Summary</h3>
                                <p><strong>Monthly Payment:</strong> ${result.monthlyPayment}</p>
                                <p><strong>Total Interest:</strong> ${result.totalInterest}</p>
                                <p><strong>Total Payment:</strong> ${result.totalPayment}</p>
                            </div>

                            <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <defs>
                                    {["#1E88E5", "#F57C00"].map((color, index) => (
                                        <linearGradient id={`color-principal-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                                        </linearGradient>
                                    ))}
                                    <filter id="shadow-principal" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
                                    </filter>
                                    </defs>

                                    <Pie
                                    data={[
                                        { name: "Principal", value: result.principal },
                                        { name: "Total Interest", value: result.totalInterestRaw },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={5}
                                    stroke="none"
                                    fillOpacity={0.9}
                                    filter="url(#shadow-principal)"
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
                                    {["#1E88E5", "#F57C00"].map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#color-principal-${index})`} />
                                    ))}
                                    </Pie>

                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                        border: "1px solid #e0e0e0",
                                    }}
                                    itemStyle={{
                                        color: "#333",
                                        fontWeight: 500,
                                    }}
                                    formatter={(value, name) => {
                                        const total = result.principal + result.totalInterestRaw;
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

export default LoanPaymentCalculator;