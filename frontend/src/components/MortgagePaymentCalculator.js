import React, { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import "./HomeAffordabilityCalculator.css";

const MortgagePaymentCalculator = () => {
    const [form, setForm] = useState({
        loanAmount: "",
        loanTerm: 30,
        interestRate: "",
        annualTaxes: "",
        annualInsurance: "",
    });

    const [result, setResult] = useState(null);
    const [amortizationData, setAmortizationData] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const loanAmount = parseFloat(form.loanAmount);
        const loanTerm = parseFloat(form.loanTerm);
        const interestRate = parseFloat(form.interestRate) / 100 / 12;
        const annualTaxes = parseFloat(form.annualTaxes);
        const annualInsurance = parseFloat(form.annualInsurance);

        if (isNaN(loanAmount) || isNaN(interestRate) || loanAmount <= 0 || interestRate <= 0) {
            alert("Please enter valid loan details.");
            return;
        }

        const months = loanTerm * 12;
        const monthlyTaxes = annualTaxes / 12 || 0;
        const monthlyInsurance = annualInsurance / 12 || 0;

        const factor = (interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);
        const monthlyPrincipalAndInterest = loanAmount * factor;
        const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTaxes + monthlyInsurance;

        const amortization = [];
        let remainingBalance = loanAmount;

        for (let month = 1; month <= months; month++) {
            const interestForMonth = remainingBalance * interestRate;
            const principalForMonth = monthlyPrincipalAndInterest - interestForMonth;

            remainingBalance -= principalForMonth;

            amortization.push({
                month,
                principalPaid: loanAmount - remainingBalance,
                interestPaid: month * interestForMonth,
                loanBalance: Math.max(remainingBalance, 0), // Avoid negative values
            });
        }

        setAmortizationData(amortization);

        setResult({
            principalInterest: monthlyPrincipalAndInterest.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            taxes: monthlyTaxes.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            insurance: monthlyInsurance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
            total: totalMonthlyPayment.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        });
    };

    return (
        <div>
            <div className="calculator-visuals-wrapper">
                {/* Left Half: Calculator */}
                <div className="calculator-section">
                    <form className="calculator-form" onSubmit={handleSubmit}>
                        <label>Loan Amount ($):</label>
                        <input type="number" name="loanAmount" value={form.loanAmount} onChange={handleChange} required />
                        <label>Loan Term (years):</label>
                        <input type="number" name="loanTerm" value={form.loanTerm} onChange={handleChange} required />
                        <label>Interest Rate (%):</label>
                        <input type="number" step="0.01" name="interestRate" value={form.interestRate} onChange={handleChange} required />
                        <label>Annual Property Taxes ($):</label>
                        <input type="number" name="annualTaxes" value={form.annualTaxes} onChange={handleChange} />
                        <label>Annual Insurance ($):</label>
                        <input type="number" name="annualInsurance" value={form.annualInsurance} onChange={handleChange} />
                        <button type="submit">Calculate</button>
                    </form>
                </div>

                {/* Right Half: Summary Card and Line Chart */}
                <div className="visuals-section">
                    {result && (
                        <div className="right-container">
                            <div className="summary-card">
                                <h3>Mortgage Payment Summary</h3>
                                <p><strong>Principal & Interest:</strong> ${result.principalInterest} / month</p>
                                <p><strong>Taxes:</strong> ${result.taxes} / month</p>
                                <p><strong>Insurance:</strong> ${result.insurance} / month</p>
                                <p><strong><u>Total Monthly Payment:</u></strong> ${result.total}</p>
                            </div>

                            <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart 
                                    data={amortizationData}
                                    margin={{ top: 20, right: 40, left: 30, bottom: 20 }}
                                >
                                    <defs>
                                    <linearGradient id="principalGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#1E88E5" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#64B5F6" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="interestGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#F57C00" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#FFB74D" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#43A047" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#81C784" stopOpacity={0.6} />
                                    </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                                    <XAxis
                                    dataKey="month"
                                    label={{
                                        value: "Month",
                                        position: "insideBottom",
                                        offset: -5,
                                        style: { fill: "#6B7280", fontSize: "0.9rem" },
                                    }}
                                    tick={{ fontSize: 12, fill: "#6B7280" }}
                                    />

                                    <YAxis
                                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                                    label={{
                                        value: "Amount ($)",
                                        angle: -90,
                                        position: "insideLeft",
                                        offset: 10,
                                        style: { fill: "#6B7280", fontSize: "0.9rem" },
                                    }}
                                    tick={{ fontSize: 12, fill: "#6B7280" }}
                                    width={80}
                                    />

                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                        border: "1px solid #e0e0e0",
                                        padding: "10px",
                                    }}
                                    itemStyle={{
                                        color: "#333",
                                        fontWeight: 500,
                                    }}
                                    formatter={(value) =>
                                        `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    }
                                    cursor={{ stroke: "rgba(107, 114, 128, 0.1)", strokeWidth: 2 }}
                                    />

                                    <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ paddingBottom: "10px" }} />

                                    <Line
                                    type="monotone"
                                    dataKey="principalPaid"
                                    name="Principal Paid"
                                    stroke="url(#principalGradient)"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    />
                                    <Line
                                    type="monotone"
                                    dataKey="interestPaid"
                                    name="Interest Paid"
                                    stroke="url(#interestGradient)"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    />
                                    <Line
                                    type="monotone"
                                    dataKey="loanBalance"
                                    name="Loan Balance"
                                    stroke="url(#balanceGradient)"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MortgagePaymentCalculator;