import React from 'react';

const HoldingPreview = ({ holdings, expanded, setExpanded, livePrices, onDeleteHolding }) => {
  const previewHoldings = expanded ? holdings : holdings.slice(0, 3);

  return (
    <div style={{ flexGrow: 1 }}>
      <h4>Holdings</h4>
      {previewHoldings.map((holding) => {
        const livePrice = livePrices[holding.ticker];
        const gainLoss = livePrice ? (livePrice - holding.averageCost) * holding.shares : 0;

        return (
          <div key={holding._id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{holding.ticker}</strong> ({holding.shares} shares)
              <br />
              <span style={{ fontSize: '0.85rem', color: gainLoss >= 0 ? 'green' : 'red' }}>
                {gainLoss >= 0 ? "+" : "-"}${Math.abs(gainLoss).toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => onDeleteHolding(holding._id)}
              style={{
                backgroundColor: "#f44336",
                border: "none",
                color: "white",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                marginLeft: "12px",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"}
            >
              Delete
            </button>
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
