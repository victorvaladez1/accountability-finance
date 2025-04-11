import React from "react";
import { PieChart, pie, Cell, Tooltip, Legend, Pie } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#ffc0cb"];

function ExpensePieChart({ transactions }) {
    //Group expenses by category

    const data = transactions
    .filter((tx) => tx.type === "Expense")
    .reduce((acc, tx) => {
        const category = tx.category || "Uncategorized";
        const existing = acc.find((item) => item.name === category);
        if (existing) {
            existing.value += tx.amount;
        } else {
            acc.push({name: category, value: tx.amount });
        }
        return acc;
    }, []);

    if (data.length === 0) return <p>No expenses to chart yet.</p>;

    return (
        <div>
            <h3>Expenses by Category</h3>
            <PieChart width={400} height={300}>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                label
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                >
                    {data.map((entry, index) =>(
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}

export default ExpensePieChart;