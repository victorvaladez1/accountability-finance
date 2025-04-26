import React, { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
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
                                        <Pie
                                            data={[
                                                { name: "Loan Amount", value: parseFloat(result.loanAmount.replace(/,/g, "")) },
                                                { name: "Down Payment", value: result.downPayment },
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
                                            {["#1E88E5", "#43A047"].map((color, index) => (
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

export default CarAffordabilityCalculator;