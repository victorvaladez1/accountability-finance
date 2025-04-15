import React, { useState } from 'react';
import "./HomeAffordabilityCalculator.css";

const HomeAffordabilityCalculator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        income: "",
        downPayment: "",
        loanTerm: 30,
        interestRate: "",
        monthlyDebt: "",
        taxRate: "",
        insurance: "",
    });

    const [result, setResult] = useState(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const income = parseFloat(form.income);
        const downPayment = parseFloat(form.downPayment);
        const loanTerm = parseFloat(form.loanTerm);
        const interestRate = parseFloat(form.interestRate) / 100 / 12;
        const monthlyDebt = parseFloat(form.monthlyDebt);
        const taxRate = parseFloat(form.taxRate) / 100;
        const insurance = parseFloat(form.insurance);

        const maxHousing = income * 0.28;
        const maxTotalDebt = income * 0.36 - monthlyDebt;
        const maxMonthly = Math.min(maxHousing, maxTotalDebt);

        const months = loanTerm * 12;
        const factor = (Math.pow(1 + interestRate, months) - 1) / (interestRate * Math.pow(1 + interestRate, months));
        const loanAmount = maxMonthly * factor;
        const homePrice = loanAmount + downPayment;

        setResult({
            maxMonthly: maxMonthly.toFixed(2),
            loanAmount: loanAmount.toFixed(2),
            homePrice: homePrice.toFixed(2),
        });
    };

    return (
        <div className="calculator-card">
            <button className="calculator-toggle" onClick={toggleOpen}>
                🏠 Home Affordability Calculator
            </button>
            { isOpen && (
                <form className="calculator-form" onSubmit={handleSubmit}>
                    <label>
                        Gross Monthly Income:
                        <input type="number" name="income" value={form.income} onChange={handleChange} required />
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
                    <label>
                        Other Monthly Debt:
                        <input type="number" name="monthlyDebt" value={form.monthlyDebt} onChange={handleChange} required />
                    </label>
                    <label>
                        Property Tax Rate (%):
                        <input type="number" step="0.01" name="taxRate" value={form.taxRate} onChange={handleChange} />
                    </label>
                    <label>
                        Monthly Insurance Cost:
                        <input type="number" name="insurance" value={form.insurance} onChange={handleChange} />
                    </label>
                    <button type="submit">Calculate</button>

                    {result && (
                        <div className="calculate-results">
                            <p><strong>Max Monthly Mortgage Payment:</strong> ${result.maxMonthly}</p>
                            <p><strong>Estimated Loan Amount:</strong> ${result.loanAmount}</p>
                            <p><strong>Estimated Home Price:</strong> ${result.homePrice}</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default HomeAffordabilityCalculator;