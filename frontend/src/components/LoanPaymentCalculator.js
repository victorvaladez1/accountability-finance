import React, { useState } from 'react';
import "./LoanPaymentCalculator.css";

const LoanPaymentCalculator = () => {
    const [form, setForm] = useState({
        loanAmount: "",
        interestRate: "",
        loanTerm: ""
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

        const monthlyRate = annualRate / 100 / 12;
        const totalPayments = termYears * 12;

        const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
        const totalPayment = monthlyPayment * totalPayments;
        const totalInterest = totalPayment - principal;

        setResult({
            monthlyPayment: monthlyPayment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }),
            totalInterest: totalInterest.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }),
            totalPayment: totalPayment.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
        });
    };

    return (
        <div>
            <form className="calculator-form" onSubmit={handleSubmit}>
                <label>
                    Loan Amount
                    <input
                        type="number"
                        name="loanAmount"
                        value={form.loanAmount}
                        onChange={handleChange}
                        required
                    />
                    </label>
                    <label>
                    Interest Rate (%):
                    <input
                        type="number"
                        step="0.01"
                        name="interestRate"
                        value={form.interestRate}
                        onChange={handleChange}
                        required
                    />
                    </label>
                    <label>
                    Loan Term (Years):
                    <input
                        type="number"
                        name="loanTerm"
                        value={form.loanTerm}
                        onChange={handleChange}
                        required
                    />
                    </label>
                    <button type="submit">Calculate</button>

                    {result && (
                    <div className="calculate-results">
                        <p>
                        <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                        </p>
                        <p>
                        <strong>Total Interest:</strong> ${result.totalInterest}
                        </p>
                        <p>
                        <strong>Total Payment:</strong> ${result.totalPayment}
                        </p>
                    </div>
                    )}
            </form>
        </div>
    );
};

export default LoanPaymentCalculator;