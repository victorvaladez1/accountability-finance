import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const PortfolioPerformanceCard = ({ snapshots, chartFilter, setChartFilter }) => {
  if (!snapshots || snapshots.length < 2) return null;

  const first = snapshots[0].value;
  const last = snapshots[snapshots.length - 1].value;
  const isGain = last - first >= 0;
  const lineColor = isGain ? "#4CAF50" : "#F44336";

  return (
    <div className="card">
      <h3>📈 Portfolio Performance</h3>

      <div className="chart-filters">
        <button className={chartFilter === "7d" ? "active" : ""} onClick={() => setChartFilter("7d")}>7d</button>
        <button className={chartFilter === "30d" ? "active" : ""} onClick={() => setChartFilter("30d")}>30d</button>
        <button className={chartFilter === "all" ? "active" : ""} onClick={() => setChartFilter("all")}>All</button>
      </div>

      <div className={`performance-header ${isGain ? "gain-bg" : "loss-bg"}`}>
        <span className="performance-icon">📈</span>
        <strong>{isGain ? "Gain" : "Loss"}:</strong> ${Math.abs(last - first).toLocaleString()}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={snapshots}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
          <YAxis tickFormatter={(val) => `$${val.toLocaleString()}`} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0",
            }}
            itemStyle={{ color: "#333", fontWeight: 500 }}
            labelStyle={{ fontWeight: "bold", color: "#555" }}
            labelFormatter={(str) => `Date: ${new Date(str).toLocaleDateString()}`}
            formatter={(val) => [`$${val.toLocaleString()}`, "Portfolio Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#colorValue)"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPerformanceCard;
