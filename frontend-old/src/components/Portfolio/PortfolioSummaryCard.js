import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';

const PortfolioSummaryCard = ({ totalValue, totalGainLoss, pieData, pieColors }) => {
  return (
    <div className="card">
      <h3>📊 Portfolio Summary</h3>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'space-between',
        marginTop: '1rem'
      }}>
        {/* Total Value & Gain/Loss Box */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>Total Value</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>Total Gain/Loss</div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: totalGainLoss >= 0 ? '#10b981' : '#ef4444',
                }}
              >
                {totalGainLoss >= 0 ? '+' : '-'}${Math.abs(totalGainLoss).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
        {/* Pie Chart Box */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <defs>
                {pieData.map((entry, index) => (
                  <linearGradient id={`color-${index}`} key={index} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={pieColors[index % pieColors.length]} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={pieColors[index % pieColors.length]} stopOpacity={0.5} />
                  </linearGradient>
                ))}
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
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
                filter="url(#shadow)"
                activeShape={({ cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill }) => {
                  const RADIAN = Math.PI / 180;
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
                  const total = pieData.reduce((sum, item) => sum + item.value, 0);
                  const percent = ((value / total) * 100).toFixed(2);
                  return [`$${value.toFixed(2)}`, `${name} (${percent}%)`];
                }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
