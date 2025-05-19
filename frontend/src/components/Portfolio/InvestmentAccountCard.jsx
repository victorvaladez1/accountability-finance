import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Sector } from 'recharts';
import HoldingPreview from './HoldingPreview';

const API = import.meta.env.VITE_API_URL;

const InvestmentAccountCard = ({ account, holdings, livePrices, pieColors, onAddHolding, onDeleteAccount, onDeleteHolding, snapshots }) => {
  const [expanded, setExpanded] = useState(false);

  const getPieData = () => {
    const data = [];
    holdings.forEach((holding) => {
      const livePrice = livePrices[holding.ticker];
      if (livePrice) {
        const existing = data.find(d => d.name === holding.ticker);
        if (existing) {
          existing.value += holding.shares * livePrice;
        } else {
          data.push({ name: holding.ticker, value: holding.shares * livePrice });
        }
      }
    });
    return data;
  };

  const pieData = getPieData();
  const totalValue = pieData.reduce((sum, d) => sum + d.value, 0);
  const costBasis = holdings.reduce((sum, h) => sum + h.shares * h.averageCost, 0);
  const change = totalValue - costBasis;

  const first = snapshots && snapshots.length > 0 ? snapshots[0].value : 0;
  const last = snapshots && snapshots.length > 0 ? snapshots[snapshots.length - 1].value : 0;
  const isGain = last - first >= 0;
  const miniLineColor = isGain ? "#4CAF50" : "#F44336";

  return (
    <div className="card">
      {/* Account Title and Delete */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>{account.name}</h3>
        <button onClick={() => onDeleteAccount(account._id)} className="delete-account-btn">Delete Account</button>
      </div>

      {/* Total Value and Gain/Loss */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          background: '#f9fafb',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
        }}
      >
        <div style={{ fontSize: '1.1rem', fontWeight: 500, color: '#374151' }}>
          <strong>Total Value:</strong>{" "}
          <span style={{ color: '#111827' }}>
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div
          style={{
            fontSize: '1.05rem',
            fontWeight: 500,
            color: isGain ? '#16a34a' : '#dc2626',
          }}
        >
          <strong>Total Gain/Loss:</strong>{" "}
          {isGain ? "+" : "-"}$
          {Math.abs(change).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>


      {/* Flex Row for Charts + Holdings */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'space-between',
      }}>
        
        {/* Pie Chart Box */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}>
          {pieData.length === 0 ? (
          <p style={{ color: "#6b7280", fontStyle: "italic", textAlign: "center", padding: "2rem" }}>
             No holdings to display. Add stocks or ETFs to visualize your portfolio allocation.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <defs>
                  {pieData.map((entry, index) => (
                    <linearGradient id={`account-color-${account._id}-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={pieColors[index % pieColors.length]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={pieColors[index % pieColors.length]} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                  <filter id={`shadow-${account._id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
                  </filter>
                </defs>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  stroke="none"
                  fillOpacity={0.9}
                  filter={`url(#shadow-${account._id})`}
                  activeShape={({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill }) => {
                    return (
                      <g>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius + 6}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                        />
                      </g>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#account-color-${account._id}-${index})`} />
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
                    const total = pieData.reduce((sum, item) => sum + item.value, 0);
                    const percent = ((value / total) * 100).toFixed(2);
                    return [`$${value.toFixed(2)}`, `${name} (${percent}%)`];
                  }}
                />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Holdings Box */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}>
          
          {holdings.length === 0 ? (
            <p style={{ color: "#6b7280", fontStyle: "italic", textAlign: "center", padding: "2rem" }}>
              No holdings yet. Add a stock or ETF to start building your portfolio.
            </p>
          ) : (
            <HoldingPreview 
              holdings={holdings} 
              expanded={expanded} 
              setExpanded={setExpanded} 
              livePrices={livePrices}
              onDeleteHolding={onDeleteHolding}
            />
          )}
        </div>
        
        {/* Mini Line Chart Box */}
        {/* Mini Line Chart Box OR Fallback Message */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#6b7280',
          fontSize: '0.95rem',
          textAlign: 'center',
        }}>
          {snapshots && snapshots.length > 1 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={snapshots}>
                <defs>
                  <linearGradient id={`miniGradient-${account._id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={miniLineColor} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={miniLineColor} stopOpacity={0.2} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                <YAxis tickFormatter={(val) => `$${val.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e0e0e0",
                  }}
                  itemStyle={{ color: "#333", fontWeight: 500 }}
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
          ) : (
            <p style={{
              color: "#6b7280", 
              fontStyle: "italic", 
              textAlign: "center", 
              padding: "2rem"
            }}>
              No snapshot data yet. Add holdings and save a snapshot to track performance over time.
            </p>            
          )}
        </div>
      </div>

      {/* Add Holding Button */}
      <button onClick={() => onAddHolding(account._id)} className="add-account-btn" style={{ marginTop: '1.5rem' }}>
        ➕ Add Holding
      </button>
    </div>
  );
};

export default InvestmentAccountCard;
