import React, { useState } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
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
                                        <Pie
                                            data={[
                                                { name: "Principal", value: result.principal },
                                                { name: "Total Interest", value: result.totalInterestRaw },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={110}
                                            innerRadius={60}
                                            label={(entry) =>
                                                `${entry.name}: $${entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                                            }
                                            labelStyle={{ fontSize: "12px", fontWeight: "bold", fill: "#4B5563" }}
                                            dataKey="value"
                                            paddingAngle={5}
                                        >
                                            {["#1E88E5", "#F57C00"].map((color, index) => (
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

export default LoanPaymentCalculator;