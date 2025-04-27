import React from 'react';

const HoldingPreview = ({ holdings, expanded, setExpanded, livePrices }) => {
  const previewHoldings = expanded ? holdings : holdings.slice(0, 3);

  return (
    <div style={{ flexGrow: 1 }}>
      <h4>Holdings</h4>
      {previewHoldings.map((holding) => {
        const livePrice = livePrices[holding.ticker];
        const gainLoss = livePrice ? (livePrice - holding.averageCost) * holding.shares : 0;

        return (
          <div key={holding._id} style={{ marginBottom: '8px' }}>
            <strong>{holding.ticker}</strong> ({holding.shares} shares)
            <br />
            <span style={{ fontSize: '0.85rem', color: gainLoss >= 0 ? 'green' : 'red' }}>
              {gainLoss >= 0 ? "+" : "-"}${Math.abs(gainLoss).toFixed(2)}
            </span>
          </div>
        );
      })}
      {holdings.length > 3 && (
        <button onClick={() => setExpanded(!expanded)} style={{ marginTop: '0.5rem' }}>
          {expanded ? "Hide Holdings ▲" : "View More ▼"}
        </button>
      )}
    </div>
  );
};

export default HoldingPreview;
