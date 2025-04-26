import React, { useState } from 'react';
import "./HomeAffordabilityCalculator.css";

const RothIraCalculator = () => {
  const [form, setForm] = useState({
    startingBalance: "",
    annualContribution: "",
    expectedReturnRate: "",
    years: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const startingBalance = parseFloat(form.startingBalance);
    const annualContribution = parseFloat(form.annualContribution);
    const expectedReturnRate = parseFloat(form.expectedReturnRate) / 100;
    const years = parseFloat(form.years);

    let futureValue = startingBalance;

    for (let i = 0; i < years; i++) {
      futureValue = futureValue * (1 + expectedReturnRate) + annualContribution;
    }

    setResult({
      futureValue: futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    });
  };

  return (
    <div>
      <form className="calculator-form" onSubmit={handleSubmit}>
        <label>
          Starting Balance ($):
          <input
            type="number"
            name="startingBalance"
            value={form.startingBalance}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Annual Contribution ($):
          <input
            type="number"
            name="annualContribution"
            value={form.annualContribution}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Expected Annual Return (%):
          <input
            type="number"
            step="0.01"
            name="expectedReturnRate"
            value={form.expectedReturnRate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Years to Grow:
          <input
            type="number"
            name="years"
            value={form.years}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Calculate</button>

        {result && (
          <div className="calculate-results">
            <p><strong>Estimated Roth IRA Value:</strong> ${result.futureValue}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RothIraCalculator;
