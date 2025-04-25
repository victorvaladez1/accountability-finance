import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF4081",
  "#FF5722", "#4CAF50", "#607D8B", "#795548",
];

const InvestmentAccountCard = ({
  account,
  holdings,
  livePrices,
  snapshots,
  chartFilter,
  setChartFilter,
  onEdit,
  onDelete,
  onAddHolding,
}) => {
  const getPieData = () => {
    const data = [];
    holdings.forEach((holding) => {
      const livePrice = livePrices[holding.ticker];
      if (!livePrice || holding.shares <= 0) return;
      const value = holding.shares * livePrice;
      const existing = data.find((item) => item.name === holding.ticker);
      if (existing) {
        existing.value += value;
      } else {
        data.push({ name: holding.ticker, value });
      }
    });
    return data;
  };

  const getFilteredSnapshots = () => {
    if (chartFilter === "all") return snapshots;
    const days = chartFilter === "7d" ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return snapshots.filter((snap) => new Date(snap.timestamp) >= cutoff);
  };

  const pieData = getPieData();
  const filteredSnapshots = getFilteredSnapshots();

  const totalValue = holdings.reduce(
    (acc, holding) => acc + holding.shares * holding.averageCost,
    0
  );

  return (
    <div className="account-card">
      <h3>{account.name}</h3>
      <p>
        <strong>Total Value:</strong> ${totalValue.toFixed(2)}
      </p>

      <button
        onClick={() => onAddHolding(account._id)}
        className="add-holding-btn"
      >
        ➕ Add Holding
      </button>

      {pieData.length > 0 && (
        <div className="account-chart">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {filteredSnapshots.length > 1 && (() => {
        const first = filteredSnapshots[0].value;
        const last = filteredSnapshots[filteredSnapshots.length - 1].value;
        const isGain = last - first >= 0;
        const miniLineColor = isGain ? "#4CAF50" : "#F44336";

        return (
          <div className="account-performance-wrapper">
            <div className="chart-filters">
              <button
                className={chartFilter === "7d" ? "active" : ""}
                onClick={() => setChartFilter("7d")}
              >
                Last 7 Days
              </button>
              <button
                className={chartFilter === "30d" ? "active" : ""}
                onClick={() => setChartFilter("30d")}
              >
                Last 30 Days
              </button>
              <button
                className={chartFilter === "all" ? "active" : ""}
                onClick={() => setChartFilter("all")}
              >
                All Time
              </button>
            </div>

            <div className={`performance-header ${isGain ? "gain-bg" : "loss-bg"}`}>
              <span className="performance-icon">📈</span>
              <strong>{isGain ? "Gain" : "Loss"}:</strong> ${Math.abs(last - first).toLocaleString()}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredSnapshots}>
                <defs>
                  <linearGradient
                    id={`miniGradient-${account._id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={miniLineColor} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={miniLineColor} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(str) => new Date(str).toLocaleDateString()}
                />
                <YAxis
                  tickFormatter={(val) => `$${val.toLocaleString()}`}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  labelFormatter={(str) => `Date: ${new Date(str).toLocaleDateString()}`}
                  formatter={(val) => [`$${val.toLocaleString()}`, "Account Value"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={`url(#miniGradient-${account._id})`}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })()}
    </div>
  );
};

export default InvestmentAccountCard;