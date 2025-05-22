import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PortfolioSummaryCard from '../components/Portfolio/PortfolioSummaryCard';
import PortfolioPerformanceCard from '../components/Portfolio/PortfolioPerformanceCard';
import InvestmentAccountCard from '../components/Portfolio/InvestmentAccountCard';

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
    Sector,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

function Portfolio() {
    const [accounts, setAccounts] = useState([]);
    const [holdingsMap, setHoldingsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [livePrices, setLivePrices] = useState({});

    const [showAddModal, setShowAddModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState("");

    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [newTicker, setNewTicker] = useState("");
    const [newShares, setNewShares] = useState("");
    const [newAvgCost, setNewAvgCost] = useState("");

    const [editHolding, setEditHolding] = useState(null);
    const [editShares, setEditShares] = useState("");
    const [editAvgCost, setEditAvgCost] = useState("");

    const [snapshots, setSnapshots] = useState([]);

    const [chartFilter, setChartFilter] = useState("all");

    const [accountSnapshots, setAccountSnapshots] = useState({});

    const [openAccountId, setOpenAccountId] = useState(null);
    const [holdingPage, setHoldingPage] = useState({});
    const [holdingsPerPage, setHoldingsPerPage] = useState({});

    const [showNewAccountModal, setShowNewAccountModal] = useState(false);


    const paginatedHoldings = (accountId) => {
        const allHoldings = holdingsMap[accountId] || [];
        const page = holdingPage[accountId] || 1;
        const perPage = holdingsPerPage[accountId] || 5;
        const start = (page - 1) * perPage;
        return allHoldings.slice(start, start + perPage);
    };

    const deleteHolding = async (holdingId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this holding?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API}/api/holdings/${holdingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                const updatedHoldingsMap = { ...holdingsMap };
                for (const accountId in updatedHoldingsMap) {
                    updatedHoldingsMap[accountId] = updatedHoldingsMap[accountId].filter((h) => h._id !== holdingId);
                }
                setHoldingsMap(updatedHoldingsMap);

                console.log("✅ Holding deleted!");
            } else {
                const err = await res.json();
                console.error("Delete failed:", err.message);
                alert("Failed to delete holding.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting holding.");
        }
    };
      
      
    const saveAllSnapshots = async () => {
        try {
            const res = await fetch(`${API}/api/snapshots`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ value: totalPortfolioValue }),
            });

            if (!res.ok) throw new Error("Failed to save portfolio snapshot");

            for (const account of accounts) {
                const holdings = holdingsMap[account._id] || [];
                const value = holdings.reduce((acc, h) => {
                    const livePrice = livePrices[h.ticker];
                    return acc + (livePrice ? h.shares * livePrice : 0);
                }, 0);

                const accountRes = await fetch(`${API}/api/account-snapshots`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        accountId: account._id,
                        value,
                    }),
                });

                if (!accountRes.ok) {
                    console.error(`❌ Failed to save snapshot for ${account.name}`);
                } else {
                    console.log(`✅ Snapshot saved for ${account.name}`);
                }
            }

            alert("📸 All snapshots saved!");
        } catch (err) {
            console.error("Snapshot save error:", err);
            alert("❌ Failed to save one or more snapshots.");
        }
    };


    const getFilteredSnapshots = () => {
        if (chartFilter === "all") return snapshots;
      
        const days = chartFilter === "7d" ? 7 : 30;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
      
        return snapshots.filter((snap) => new Date(snap.timestamp) >= cutoff);
      };

    const getFilteredAccountSnapshots = (accountId) => {
        const snaps = accountSnapshots[accountId] || [];
        if (chartFilter === "all") return snaps;
      
        const days = chartFilter === "7d" ? 7 : 30;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        return snaps.filter((snap) => new Date(snap.timestamp) >= cutoff);
      };
      

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch(`${API}/api/accounts`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await res.json();
                const investmentAccounts = data.filter((acc) => acc.type === "Investment");
                setAccounts(investmentAccounts);

                const holdingsData = {};
                for (const acc of investmentAccounts) {
                    const res = await fetch(`${API}/api/holdings/${acc._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    const accountHoldings = await res.json();
                    holdingsData[acc._id] = accountHoldings;

                    for (const holding of accountHoldings) {
                        if (!livePrices[holding.ticker]) {
                            try {
                                const priceRes = await fetch(`${API}/api/market/${holding.ticker}`);
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
    }, [livePrices]);

    useEffect(() => {
        const fetchSnapshots = async () => {
            try {
                const res = await fetch(`${API}/api/snapshots`, {
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

      useEffect(() => {
        const fetchAccountSnapshots = async () => {
            try {
                const snapshotMap = {};
                for (const acc of accounts) {
                    const res = await fetch(`${API}/api/account-snapshots/${acc._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (!res.ok) throw new Error(`Failed to fetch snapshot for ${acc.name}`);
                    const data = await res.json();

                    const formattedData = data.map((snap) => ({
                        ...snap,
                        timestamp: new Date(snap.timestamp),
                    }));

                    snapshotMap[acc._id] = formattedData;
                }

                setAccountSnapshots(snapshotMap);
            } catch (err) {
                console.error("❌ Error fetching account snapshots:", err);
            }
        };

        if (accounts.length > 0) {
            fetchAccountSnapshots();
        }
    }, [accounts]);

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
        const res = await fetch(`${API}/api/snapshots`, {
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
    
    if (loading) {
      return (
        <div className="page-container">
          <Navbar />
          <div className="loading-container">
            <div className="spinner" />
            <p>Fetching your investment data...</p>
          </div>
        </div>
      );
    }
    
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

      const renderMiniChartForAccount = (account) => {
        const snapshots = getFilteredAccountSnapshots(account._id);
        if (!snapshots || snapshots.length < 2) return null;
      
        const first = snapshots[0].value;
        const last = snapshots[snapshots.length - 1].value;
        const isGain = last - first >= 0;
        const miniLineColor = isGain ? "#4CAF50" : "#F44336";
      
        return (
      
            <div className="account-performance-wrapper">

                <div className="account-performance-mini-chart">
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
                    <LineChart data={snapshots}>
                        <defs>
                            <linearGradient id={`miniGradient-${account._id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={miniLineColor} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={miniLineColor} stopOpacity={0.2} />
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
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                border: "1px solid #e0e0e0",
                            }}
                            itemStyle={{
                                color: "#333",
                                fontWeight: 500,
                            }}
                            labelStyle={{
                                fontWeight: "bold",
                                color: "#555",
                            }}
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
            
          </div>
        );
      };
      
      const deleteAccount = async (accountId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this investment account?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API}/api/accounts/${accountId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                setAccounts((prev) => prev.filter((acc) => acc._id !== accountId));
                const newHoldingsMap = { ...holdingsMap };
                delete newHoldingsMap[accountId];
                setHoldingsMap(newHoldingsMap);
            } else {
                const err = await res.json();
                console.error("Delete failed:", err.message);
                alert("Failed to delete account.");
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert("Error deleting account.");
        }
    };

      const costBasis = (accountId) => {
        const holdings = holdingsMap[accountId] || [];
        return holdings.reduce((sum, h) => sum + h.shares * h.averageCost, 0);
    };
      
    return (
        <div className="page-container">
            <Navbar />
            <h2>Investment Portfolio</h2>

            {/* Top Portfolio Summary Card */}
            <PortfolioSummaryCard 
            totalValue={totalPortfolioValue} 
            totalGainLoss={totalPortfolioValue - totalPortfolioCost} 
            pieData={pieData} 
            pieColors={pieColors}
            />

            {/* Portfolio Performance Chart */}
            <PortfolioPerformanceCard
                snapshots={getFilteredSnapshots()}
                chartFilter={chartFilter}
                setChartFilter={setChartFilter}
                totalValue={totalPortfolioValue}
                saveAllSnapshots={saveAllSnapshots}
            />

            {/* Loop over Investment Accounts */}
            {accounts.length === 0 ? (
            <p>No investment accounts found.</p>
            ) : (
            accounts.map((account) => (
                <InvestmentAccountCard
                    key={account._id}
                    account={account}
                    holdings={holdingsMap[account._id] || []}
                    livePrices={livePrices}
                    pieColors={pieColors}
                    onAddHolding={(accountId) => setSelectedAccountId(accountId)}
                    onDeleteAccount={deleteAccount}
                    onDeleteHolding={deleteHolding}
                    snapshots={getFilteredAccountSnapshots(account._id)}
                />
            ))
            )}

            {/* Add New Account Button */}
            <button onClick={() => setShowNewAccountModal(true)} className="add-account-btn">
                ➕ Add Investment Account
            </button>


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
                                    const priceRes = await fetch(`${API}/api/market/${newTicker.toUpperCase()}`);
                                    const priceData = await priceRes.json();
                                    if (!priceData.fallback && priceData.price) {
                                        finalAvgCost = priceData.price;
                                    } else {
                                        alert("Could not fetch live price. Please enter average cost manually.");
                                        return;
                                    }
                                }

                                const res = await fetch(`${API}/api/holdings`, {
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

            {showNewAccountModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                <h3>New Investment Account</h3>
                <input
                    type="text"
                    placeholder="Account Name (e.g., Vanguard Brokerage)"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                />
                <button onClick={async () => {
                    try {
                    const res = await fetch(`${API}/api/accounts`, {
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({
                        name: newAccountName,
                        type: "Investment",
                        balance: 0,
                        }),
                    });
                    if (res.ok) {
                        setShowNewAccountModal(false);
                        setNewAccountName("");
                        window.location.reload();
                    } else {
                        console.error("Error creating account");
                    }
                    } catch (err) {
                    console.error("Account creation error:", err);
                    }
                }}>
                    Create Account
                </button>
                <button onClick={() => setShowNewAccountModal(false)}>Cancel</button>
                </div>
            </div>
            )}
    </div>
    );
}

export default Portfolio;
