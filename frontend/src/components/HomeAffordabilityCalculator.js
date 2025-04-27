import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector, Legend } from "recharts";
import "./HomeAffordabilityCalculator.css";

const HomeAffordabilityCalculator = () => {
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

        if (isNaN(income) || income <= 0) {
            alert("Please enter a valid gross monthly income.");
            return;
        }
        if (isNaN(downPayment) || downPayment < 0) {
            alert("Please enter a valid down payment.");
            return;
        }
        if (isNaN(interestRate) || interestRate <= 0) {
            alert("Please enter a valid interest rate.");
            return;
        }

        const maxHousing = income * 0.28;
        const maxTotalDebt = income * 0.36 - monthlyDebt;
        const maxMonthly = Math.min(maxHousing, maxTotalDebt);

        const months = loanTerm * 12;
        const factor = (Math.pow(1 + interestRate, months) - 1) / (interestRate * Math.pow(1 + interestRate, months));
        const loanAmount = maxMonthly * factor;
        const homePrice = loanAmount + downPayment;

        const taxes = taxRate * homePrice / 12;
        const insuranceCost = insurance;
        const loanPayment = maxMonthly - taxes - insuranceCost;

        setResult({
            maxMonthly: maxMonthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            loanAmount: loanAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            homePrice: homePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            loanPayment: loanPayment,
            taxes: taxes,
            insuranceCost: insuranceCost,
        });
        console.log({
            maxMonthly,
            loanAmount,
            homePrice,
            loanPayment,
            taxes,
            insuranceCost,
        });
    };

    return (
        <div>
            <div className="calculator-visuals-wrapper">
            {/* Left Half: Calculator */}
            <div className="calculator-section">
                <form className="calculator-form" onSubmit={handleSubmit}>
                    {/* Calculator Input Fields */}
                    <label>Gross Monthly Income:</label>
                    <input type="number" name="income" value={form.income} onChange={handleChange} required />
                    <label>Down Payment:</label>
                    <input type="number" name="downPayment" value={form.downPayment} onChange={handleChange} required />
                    <label>Loan Term (years):</label>
                    <input type="number" name="loanTerm" value={form.loanTerm} onChange={handleChange} required />
                    <label>Interest Rate (%):</label>
                    <input type="number" step="0.01" name="interestRate" value={form.interestRate} onChange={handleChange} required />
                    <label>Other Monthly Debt:</label>
                    <input type="number" name="monthlyDebt" value={form.monthlyDebt} onChange={handleChange} required />
                    <label>Property Tax Rate (%):</label>
                    <input type="number" step="0.01" name="taxRate" value={form.taxRate} onChange={handleChange} />
                    <label>Monthly Insurance Cost:</label>
                    <input type="number" name="insurance" value={form.insurance} onChange={handleChange} />
                    <button type="submit">Calculate</button>
                </form>
            </div>

            {/* Right Half: Combined Summary Card and Pie Chart */}
            <div className="visuals-section">
                {result && (
                    <div className="right-container">
                        <div className="summary-card">
                            <h3>Key Affordability Insights</h3>
                            <p><strong>Affordable House Price:</strong> ${result.homePrice}</p>
                            <p><strong>Estimated Loan Amount:</strong> ${result.loanAmount}</p>
                            <p><strong>Max Monthly Payment:</strong> ${result.maxMonthly}</p>
                        </div>

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <defs>
                                    {["#1976D2", "#64B5F6", "#BBDEFB"].map((color, index) => (
                                        <linearGradient id={`color-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                                        </linearGradient>
                                    ))}
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
                                    </filter>
                                    </defs>

                                    <Pie
                                    data={[
                                        { name: "Loan Payment", value: result.loanPayment },
                                        { name: "Taxes", value: result.taxes },
                                        { name: "Insurance", value: result.insuranceCost },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    stroke="none"
                                    fillOpacity={0.9}
                                    filter="url(#shadow)"
                                    activeShape={({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill }) => {
                                        const RADIAN = Math.PI / 180;
                                        const sin = Math.sin(-RADIAN * midAngle);
                                        const cos = Math.cos(-RADIAN * midAngle);
                                        const sx = cx + (outerRadius + 10) * cos;
                                        const sy = cy + (outerRadius + 10) * sin;
                                        const ex = sx + (cos >= 0 ? 1 : -1) * 22;
                                        const ey = sy;
                                        
                                        return (
                                          <g>
                                            <Sector
                                              cx={cx}
                                              cy={cy}
                                              innerRadius={innerRadius}
                                              outerRadius={outerRadius + 8}
                                              startAngle={startAngle - 2}
                                              endAngle={endAngle + 2}
                                              fill={fill}
                                            />
                                          </g>
                                        );
                                      }}
                                      
                                    dataKey="value"
                                    nameKey="name"
                                    >
                                    {["#1976D2", "#64B5F6", "#BBDEFB"].map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={`url(#color-${index})`} />
                                    ))}
                                    </Pie>

                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                        border: "1px solid #e0e0e0",
                                    }}
                                    itemStyle={{ color: "#333", fontWeight: 500 }}
                                    formatter={(value, name, props) => {
                                        const total = result.loanPayment + result.taxes + result.insuranceCost;
                                        const percent = ((value / total) * 100).toFixed(2);
                                        return [`$${value.toFixed(2)}`, `${name} (${percent}%)`];
                                    }}
                                    cursor={{ fill: "rgba(107, 114, 128, 0.05)" }}
                                    />

                                    <Legend verticalAlign="bottom" height={36} />
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

export default HomeAffordabilityCalculator;