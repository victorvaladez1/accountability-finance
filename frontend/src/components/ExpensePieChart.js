import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#facc15", "#f97316", "#06b6d4", "#84cc16", "#eab308", "#ec4899"];

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

  if (data.length === 0) return <p style={{ textAlign: "center" }}>No expenses to chart yet.</p>;

  return (
    <div>
      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label
            outerRadius={110}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpensePieChart;
