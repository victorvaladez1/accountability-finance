import React, { useState } from 'react';
import "./CarAffordabilityCalculator.css";

const CarAffordabilityCalculator = () => {
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({
        monthlyIncome: "",
        downPayment: "",
        loanTerm: 4,
        interestRate: "",
    });

    const [result, setResult] = useState(null);

    const toggleShow = () => setShow(!show);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const monthlyIncome = parseFloat(form.monthlyIncome);
        const downPayment = parseFloat(form.downPayment);
        const loanTerm = parseFloat(form.loanTerm);
        const interestRate = parseFloat(form.interestRate) / 100 / 12;

        const maxMonthlyPayment = monthlyIncome * 0.10;
        const months = loanTerm * 12;
        const factor = (Math.pow(1 + interestRate, months) - 1) / (interestRate * Math.pow(1 + interestRate, months));
        const loanAmount = maxMonthlyPayment * factor;
        const totalCarBudget = loanAmount + downPayment;
        
        setResult({
            maxMonthlyPayment: maxMonthlyPayment.toFixed(2),
            loanAmount: loanAmount.toFixed(2),
            totalCarBudget: totalCarBudget.toFixed(2),
        });
    };

    return (
        <div>
                <form className="calculator-form" onSubmit={handleSubmit}>
                    <label>
                        Gross Monthly Income:
                        <input type="number" name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} required />
                    </label>
                    <label>
                        Down Payment:
                        <input type="number" name="downPayment" value={form.downPayment} onChange={handleChange} required />
                    </label>
                    <label>
                        Loan Term (years):
                        <input type="number" name="loanTerm" value={form.loanTerm} onChange={handleChange} required />
                    </label>
                    <label>
                        Interest Rate (%):
                        <input type="number" step="0.01" name="interestRate" value={form.interestRate} onChange={handleChange} required />
                    </label>
                    <button type="submit">Calculate</button>

                    {result && (
                        <div className="calculate-results">
                            <p><strong>Max Monthly Car Payment:</strong> ${parseFloat(result.maxMonthlyPayment).toLocaleString()}</p>
                            <p><strong>Estimated Loan Amount:</strong> ${parseFloat(result.loanAmount).toLocaleString()}</p>
                            <p><strong>Total Car Budget:</strong> ${parseFloat(result.totalCarBudget).toLocaleString()}</p>
                        </div>
                    )}
                </form>
        </div>
    );
};

export default CarAffordabilityCalculator;