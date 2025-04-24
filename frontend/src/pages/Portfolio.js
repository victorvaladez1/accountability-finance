import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./CommonLayout.css";
import "./Portfolio.css";

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
    CartesianGrid,
} from "recharts";

function Portfolio() {
    const [accounts, setAccounts] = useState([]);
    const [holdingsMap, setHoldingsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [livePrices, setLivePrices] = useState({});

    const [showAddModal, setShowAddModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState("");
    const [newAccountBalance, setNewAccountBalance] = useState("");

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [newTicker, setNewTicker] = useState("");
    const [newShares, setNewShares] = useState("");
    const [newAvgCost, setNewAvgCost] = useState("");

    const [editHolding, setEditHolding] = useState(null);
    const [editShares, setEditShares] = useState("");
    const [editAvgCost, setEditAvgCost] = useState("");

    const [snapshots, setSnapshots] = useState([]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch("/api/accounts", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await res.json();
                const investmentAccounts = data.filter((acc) => acc.type === "Investment");
                setAccounts(investmentAccounts);

                const holdingsData = {};
                for (const acc of investmentAccounts) {
                    const res = await fetch(`/api/holdings/${acc._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    const accountHoldings = await res.json();
                    holdingsData[acc._id] = accountHoldings;

                    // ✅ Fetch live prices for each holding
                    for (const holding of accountHoldings) {
                        if (!livePrices[holding.ticker]) {
                            try {
                                const priceRes = await fetch(`/api/market/${holding.ticker}`);
                                const priceData = await priceRes.json();
                                if (!priceData.fallback && priceData.price) {
                                    setLivePrices(prev => ({
                                        ...prev,
                                        [holding.ticker]: priceData.price
                                    }));
                                }
                            } catch (err) {
                                console.error(`Error fetching price for ${holding.ticker}:`, err);
                            }
                        }
                    }
                }

                setHoldingsMap(holdingsData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching portfolio: ", err);
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    useEffect(() => {
        const fetchSnapshots = async () => {
          try {
            const res = await fetch("/api/snapshots", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            const data = await res.json();
            setSnapshots(data);
          } catch (err) {
            console.error("Error fetching snapshots:", err);
          }
        };
      
        fetchSnapshots();
      }, []);

    let totalPortfolioValue = 0;
    let totalPortfolioCost = 0;

    accounts.forEach((account) => {
    const holdings = holdingsMap[account._id] || [];
    holdings.forEach((holding) => {
        const livePrice = livePrices[holding.ticker];
        const cost = holding.shares * holding.averageCost;
        const currentValue = livePrice ? holding.shares * livePrice : 0;

        totalPortfolioCost += cost;
        totalPortfolioValue += currentValue;
    });
    });

    useEffect(() => {
    const takeSnapshotOnce = async () => {
        const alreadySnapshotted = localStorage.getItem("portfolioSnapshotTaken");
        if (alreadySnapshotted) return;
        if (totalPortfolioValue <= 0) return;

        try {
        const res = await fetch("/api/snapshots", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ value: totalPortfolioValue }),
        });

        if (res.ok) {
            localStorage.setItem("portfolioSnapshotTaken", "true");
            console.log("✅ Snapshot taken");
        } else {
            console.warn("⚠️ Failed to snapshot");
        }
        } catch (err) {
        console.error("Snapshot error:", err);
        }
    };

    takeSnapshotOnce();
    }, [loading, totalPortfolioValue]);
    
    if (loading) return <div className="page-container"><Navbar /><p>Loading portfolio...</p></div>;

    const totalGainLoss = totalPortfolioValue - totalPortfolioCost;

    const pieData = [];

    accounts.forEach((account) => {
    const holdings = holdingsMap[account._id] || [];
    holdings.forEach((holding) => {
        const livePrice = livePrices[holding.ticker];
        const shares = holding.shares;

        if (!livePrice || shares <= 0) return;

        const currentValue = shares * livePrice;
        const existing = pieData.find((item) => item.name === holding.ticker);

        if (existing) {
        existing.value += currentValue;
        } else {
        pieData.push({ name: holding.ticker, value: currentValue });
        }
    });
    });


    const pieColors = [
          "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF", "#FF4081",
          "#FF5722", "#4CAF50", "#607D8B", "#795548"
    ];

    const getPieDataForAccount = (accountId) => {
        const holdings = holdingsMap[accountId] || [];
        const data = [];
      
        holdings.forEach((holding) => {
          const livePrice = livePrices[holding.ticker];
          const shares = holding.shares;
          if (!livePrice || shares <= 0) return;
      
          const value = shares * livePrice;
          const existing = data.find((item) => item.name === holding.ticker);
          if (existing) {
            existing.value += value;
          } else {
            data.push({ name: holding.ticker, value });
          }
        });
      
        return data;
      };

      console.log("📈 Snapshots for performance chart:", snapshots);

    return (
        <div className="page-container">
            <Navbar />
            <h2>Investment Portfolio</h2>

            <div className="portfolio-summary-card">
                <h4>📊 Portfolio Summary</h4>
                <p><strong>Total Value:</strong> ${totalPortfolioValue.toFixed(2)}</p>
                <p><strong>Total Gain/Loss:</strong> 
                    <span className={totalGainLoss >= 0 ? "gain" : "loss"}>
                    {totalGainLoss >= 0 ? "+" : "-"}${Math.abs(totalGainLoss).toFixed(2)}
                    </span>
                </p>
            </div>

            <div className="portfolio-chart-container">
                <h4>📊 Asset Allocation</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {snapshots.length > 1 && (
            <div className="chart-card">
                <h4>📈 Portfolio Performance</h4>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={snapshots}>
                    <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#007bff" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#007bff" stopOpacity={0.2} />
                    </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                    dataKey="timestamp"
                    tickFormatter={(str) => new Date(str).toLocaleDateString()}
                    />
                    <YAxis
                    tickFormatter={(val) => `$${val.toLocaleString()}`}
                    domain={["auto", "auto"]}
                    />
                    <Tooltip
                    labelFormatter={(str) =>
                        `Date: ${new Date(str).toLocaleDateString()}`
                    }
                    formatter={(value) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
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
            )}

            <button
            onClick={async () => {
                const res = await fetch("/api/snapshots", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ value: totalPortfolioValue }),
                });

                if (res.ok) {
                alert("✅ Snapshot saved");
                window.location.reload();
                } else {
                alert("❌ Failed to save snapshot");
                }
            }}
            >
            📸 Save Snapshot Now
            </button>

            <button onClick={() => setShowAddModal(true)} className="add-account-btn">
            ➕ Add Investment Account
            </button>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>New Investment Account</h3>
                        <input
                            type="text"
                            placeholder="Account Name"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Initial Balance"
                            value={newAccountBalance}
                            onChange={(e) => setNewAccountBalance(e.target.value)}
                        />
                        <button onClick={async () => {
                            try {
                                const res = await fetch("/api/accounts", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                    body: JSON.stringify({
                                        name: newAccountName,
                                        type: "Investment",
                                        balance: parseFloat(newAccountBalance),
                                    }),
                                });
                                if (res.ok) {
                                    setShowAddModal(false);
                                    setNewAccountName("");
                                    setNewAccountBalance("");
                                    window.location.reload();
                                } else {
                                    console.error("Error creating account");
                                }
                            } catch (err) {
                                console.error("Account creation error:", err);
                            }
                        }}>Create</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {selectedAccountId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Holding</h3>
                        <input
                            type="text"
                            placeholder="Ticker (e.g., AAPL)"
                            value={newTicker}
                            onChange={(e) => setNewTicker(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Shares"
                            value={newShares}
                            onChange={(e) => setNewShares(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Average Cost"
                            value={newAvgCost}
                            onChange={(e) => setNewAvgCost(e.target.value)}
                        />

                        <small style={{ fontSize: "0.8rem", color: "#666" }}>
                            Leave blank to use current market price
                        </small>
                        
                        <button onClick={async () => {
                            try {
                                let finalAvgCost = parseFloat(newAvgCost);
                                if (!newAvgCost) {
                                    const priceRes = await fetch(`/api/market/${newTicker.toUpperCase()}`);
                                    const priceData = await priceRes.json();
                                    if (!priceData.fallback && priceData.price) {
                                        finalAvgCost = priceData.price;
                                    } else {
                                        alert("Could not fetch live price. Please enter average cost manually.");
                                        return;
                                    }
                                }

                                const res = await fetch("/api/holdings", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                    body: JSON.stringify({
                                        accountId: selectedAccountId,
                                        ticker: newTicker.toUpperCase(),
                                        shares: parseFloat(newShares),
                                        averageCost: finalAvgCost,
                                    }),
                                });

                                if (res.ok) {
                                    setSelectedAccountId(null);
                                    setNewTicker("");
                                    setNewShares("");
                                    setNewAvgCost("");
                                    window.location.reload();
                                } else {
                                    console.error("Error creating holding");
                                }
                            } catch (err) {
                                console.error("Holding creation error:", err);
                            }
                        }}>
                            Add
                        </button>

                        <button onClick={() => setSelectedAccountId(null)}>Cancel</button>
                    </div>
                </div>
            )}

            {editHolding && (
            <div className="modal-overlay">
                <div className="modal-content">
                <h3>Edit {editHolding.ticker}</h3>
                <input
                    type="number"
                    placeholder="Shares"
                    value={editShares}
                    onChange={(e) => setEditShares(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Average Cost"
                    value={editAvgCost}
                    onChange={(e) => setEditAvgCost(e.target.value)}
                />
                <button onClick={async () => {
                    try {
                    const res = await fetch(`/api/holdings/${editHolding._id}`, {
                        method: "PUT",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                        shares: parseFloat(editShares),
                        averageCost: parseFloat(editAvgCost),
                        }),
                    });

                    if (res.ok) {
                        setEditHolding(null);
                        setEditShares("");
                        setEditAvgCost("");
                        window.location.reload();
                    } else {
                        console.error("Failed to update holding");
                    }
                    } catch (err) {
                    console.error("Update error:", err);
                    }
                }}>Save</button>
                <button onClick={() => setEditHolding(null)}>Cancel</button>
                </div>
            </div>
            )}


            {accounts.length === 0 ? (
                <p>No investment accounts found</p>
            ) : (
                accounts.map((account) => {
                    const holdings = holdingsMap[account._id] || [];
                    const totalValue = holdings.reduce((acc, holding) => {
                        return acc + holding.shares * holding.averageCost;
                    }, 0);

                    return (
                        <div key={account._id} className="account-card">
                            <h3>{account.name}</h3>
                            <p><strong>Total Value:</strong> ${totalValue.toFixed(2)}</p>
                            
                            <div>
                                <button onClick={() => setSelectedAccountId(account._id)} className="add-holding-btn">
                                    ➕ Add Holding
                                </button>

                                {getPieDataForAccount(account._id).length > 0 && (
                                            <div className="account-chart">
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                <Pie
                                                    data={getPieDataForAccount(account._id)}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    label
                                                >
                                                    {getPieDataForAccount(account._id).map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            </div>
                                        )}

                                {holdings.map((holding) => {
                                    const livePrice = livePrices[holding.ticker];
                                    const gainLoss = livePrice ? (livePrice - holding.averageCost) * holding.shares : 0;

                                    return (
                                        <div className="holding-card" key={holding._id}>
                                            <div className="holding-header">
                                                <span className="ticker">{holding.ticker}</span>
                                                {livePrice && (
                                                    <span className={`gain-loss ${gainLoss >= 0 ? "gain" : "loss"}`}>
                                                        {gainLoss >= 0 ? "+" : "-"}${Math.abs(gainLoss).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="holding-details">
                                                <span>{holding.shares} shares</span>
                                                <span>Avg: ${holding.averageCost.toFixed(2)}</span>
                                                <span>
                                                    {livePrice
                                                        ? `Live: $${livePrice.toFixed(2)}`
                                                        : "Fetching..."}
                                                </span>
                                            </div>

                                            <button
                                            className="edit-holding-btn"
                                            onClick={() => {
                                                setEditHolding(holding);
                                                setEditShares(holding.shares.toString());
                                                setEditAvgCost(holding.averageCost.toString());
                                            }}
                                            >
                                            ✏️ Edit
                                            </button>

                                            <button
                                                className="delete-holding-btn"
                                                onClick={async () => {
                                                    const confirmDelete = window.confirm(`Delete ${holding.ticker}?`);
                                                    if (!confirmDelete) return;

                                                    try {
                                                    const res = await fetch(`/api/holdings/${holding._id}`, {
                                                        method: "DELETE",
                                                        headers: {
                                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                        },
                                                    });

                                                    if (res.ok) {
                                                        window.location.reload();
                                                    } else {
                                                        const err = await res.json();
                                                        console.error("Delete failed:", err.message);
                                                        alert("Failed to delete holding.");
                                                    }
                                                    } catch (err) {
                                                    console.error("Delete error:", err);
                                                    alert("Error deleting holding.");
                                                    }
                                                }}
                                                >
                                                🗑️ Delete
                                            </button>

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Portfolio;
