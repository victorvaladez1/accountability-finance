import React, { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
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
                                    <LineChart data={amortizationData}>
                                        <XAxis dataKey="month" label={{ value: "Month", position: "insideBottom", offset: -5 }} />
                                        <YAxis label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }} />
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
                                            cursor={{ stroke: "rgba(107, 114, 128, 0.2)", strokeWidth: 2 }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="principalPaid" stroke="#1E88E5" name="Principal Paid" strokeWidth={2} />
                                        <Line type="monotone" dataKey="interestPaid" stroke="#F57C00" name="Interest Paid" strokeWidth={2} />
                                        <Line type="monotone" dataKey="loanBalance" stroke="#43A047" name="Loan Balance" strokeWidth={2} />
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