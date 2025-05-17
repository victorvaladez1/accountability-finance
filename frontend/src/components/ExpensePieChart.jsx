import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#f97316", "#14b8a6"];

function ExpensePieChart({ transactions }) {
  const data = transactions
    .filter((tx) => tx.type === "Expense")
    .reduce((acc, tx) => {
      const category = tx.category || "Uncategorized";
      const existing = acc.find((item) => item.name === category);
      if (existing) {
        existing.value += tx.amount;
      } else {
        acc.push({ name: category, value: tx.amount });
      }
      return acc;
    }, []);

  if (data.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#666", marginTop: "1rem" }}>
        No expenses to chart yet.
      </p>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <defs>
          {data.map((entry, index) => (
            <linearGradient id={`color-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.85} />
              <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.6} />
            </linearGradient>
          ))}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
          </filter>
        </defs>

        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={110}
          dataKey="value"
          label
          stroke="none"
          fillOpacity={0.9}
          filter="url(#shadow)"
          activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) => (
            <g>
              <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
              />
            </g>
          )}
        >
          {data.map((entry, index) => (
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
          formatter={(value, name) => {
            const percent = ((value / total) * 100).toFixed(2);
            return [`$${value.toFixed(2)}`, `${name} (${percent}%)`];
          }}
        />
        <Legend verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ExpensePieChart;
