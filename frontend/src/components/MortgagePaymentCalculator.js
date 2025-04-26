import React, { useState } from 'react';
import "./HomeAffordabilityCalculator.css";

const MortgagePaymentCalculator = () => {
    const [form, setForm] = useState({
        loanAmount: "",
        loanTerm: 30,
        interestRate: "",
        annualTaxes: "",
        annualInsurance: ""
    });

    const [result, setResult] = useState(null);

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

        const months = loanTerm * 12;

        const factor = (interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);
        const monthlyPrincipalAndInterest = loanAmount * factor;

        const monthlyTaxes = annualTaxes / 12;
        const monthlyInsurance = annualInsurance / 12;

        const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyTaxes + monthlyInsurance;

        setResult({
            principalInterest: monthlyPrincipalAndInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            taxes: monthlyTaxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            insurance: monthlyInsurance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            total: totalMonthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        });
    };

    return (
        <div>
            <form className="calculator-form" onSubmit={handleSubmit}>
                <label>
                    Loan Amount ($):
                    <input type="number" name="loanAmount" value={form.loanAmount} onChange={handleChange} required />
                </label>
                <label>
                    Loan Term (years):
                    <input type="number" name="loanTerm" value={form.loanTerm} onChange={handleChange} required />
                </label>
                <label>
                    Interest Rate (%):
                    <input type="number" step="0.01" name="interestRate" value={form.interestRate} onChange={handleChange} required />
                </label>
                <label>
                    Annual Property Taxes ($):
                    <input type="number" name="annualTaxes" value={form.annualTaxes} onChange={handleChange} />
                </label>
                <label>
                    Annual Insurance ($):
                    <input type="number" name="annualInsurance" value={form.annualInsurance} onChange={handleChange} />
                </label>
                <button type="submit">Calculate</button>

                {result && (
                    <div className="calculate-results">
                        <p><strong>Principal & Interest:</strong> ${result.principalInterest} / month</p>
                        <p><strong>Taxes:</strong> ${result.taxes} / month</p>
                        <p><strong>Insurance:</strong> ${result.insurance} / month</p>
                        <p><strong><u>Total Monthly Payment:</u></strong> ${result.total}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MortgagePaymentCalculator;
