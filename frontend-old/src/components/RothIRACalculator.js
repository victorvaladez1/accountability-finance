import React, { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from "recharts";
import "./HomeAffordabilityCalculator.css";

const RothIraCalculator = () => {
    const [form, setForm] = useState({
        startingBalance: "",
        annualContribution: "",
        expectedReturnRate: "",
        years: "",
    });

    const [result, setResult] = useState(null);
    const [growthData, setGrowthData] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const startingBalance = parseFloat(form.startingBalance);
        const annualContribution = parseFloat(form.annualContribution);
        const expectedReturnRate = parseFloat(form.expectedReturnRate) / 100;
        const years = parseFloat(form.years);

        if (isNaN(startingBalance) || isNaN(annualContribution) || isNaN(expectedReturnRate) || isNaN(years) || years <= 0) {
            alert("Please enter valid inputs.");
            return;
        }

        let futureValue = startingBalance;
        const data = [{ year: 0, balance: startingBalance }];

        for (let i = 1; i <= years; i++) {
            futureValue = futureValue * (1 + expectedReturnRate) + annualContribution;
            data.push({ year: i, balance: futureValue });
        }

        setGrowthData(data);

        setResult({
            futureValue: futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        });
    };

    return (
        <div>
            <div className="calculator-visuals-wrapper">
                {/* Left Half: Calculator */}
                <div className="calculator-section">
                    <form className="calculator-form" onSubmit={handleSubmit}>
                        <label>Starting Balance ($):</label>
                        <input
                            type="number"
                            name="startingBalance"
                            value={form.startingBalance}
                            onChange={handleChange}
                            required
                        />
                        <label>Annual Contribution ($):</label>
                        <input
                            type="number"
                            name="annualContribution"
                            value={form.annualContribution}
                            onChange={handleChange}
                            required
                        />
                        <label>Expected Annual Return (%):</label>
                        <input
                            type="number"
                            step="0.01"
                            name="expectedReturnRate"
                            value={form.expectedReturnRate}
                            onChange={handleChange}
                            required
                        />
                        <label>Years to Grow:</label>
                        <input
                            type="number"
                            name="years"
                            value={form.years}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit">Calculate</button>
                    </form>
                </div>

                {/* Right Half: Summary Card and Line Chart */}
                <div className="visuals-section">
                    {result && (
                        <div className="right-container">
                            <div className="summary-card">
                                <h3>Roth IRA Growth Summary</h3>
                                <p><strong>Estimated Roth IRA Value:</strong> ${result.futureValue}</p>
                            </div>

                            <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={growthData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                                    <defs>
                                    <linearGradient id="growthLineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1E88E5" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#1E88E5" stopOpacity={0.2} />
                                    </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                                    <XAxis 
                                    dataKey="year" 
                                    label={{ value: "Years", position: "insideBottom", offset: -10 }}
                                    tick={{ fontSize: 12 }}
                                    />
                                    
                                    <YAxis 
                                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                                    label={{
                                        value: "Balance ($)", 
                                        angle: -90, 
                                        position: "insideLeft", 
                                        offset: 10,
                                        style: { textAnchor: 'middle', fontSize: 14 }
                                    }}
                                    tick={{ fontSize: 12 }}
                                    width={90}
                                    />

                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "8px",
                                        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                        border: "1px solid #e0e0e0",
                                    }}
                                    itemStyle={{ color: "#333", fontWeight: 500 }}
                                    formatter={(value) =>
                                        `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    }
                                    cursor={{ stroke: "rgba(107, 114, 128, 0.15)", strokeWidth: 2 }}
                                    />

                                    <Line
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="url(#growthLineGradient)"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    name="Balance"
                                    />

                                    <Legend verticalAlign="bottom" height={36} />
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

export default RothIraCalculator;