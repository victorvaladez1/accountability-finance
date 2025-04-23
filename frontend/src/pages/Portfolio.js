import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./CommonLayout.css";
import "./Portfolio.css";

function Portfolio() {
    const [accounts, setAccounts] = useState([]);
    const [holdingsMap, setHoldingsMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [livePrices, setLivePrices] = useState({});

    const [showAddModal, setShowAddModal] = useState(false);
    const [newAccountName, setNewAccountName] = useState("");
    const [newAccountBalance, setNewAccountBalance] = useState("");

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

    if (loading) return <div className="page-container"><Navbar /><p>Loading portfolio...</p></div>;

    return (
        <div className="page-container">
            <Navbar />
            <h2>Investment Portfolio</h2>

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
                                    window.location.reload(); // reload to fetch new accounts
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
                            <ul>
                                {holdings.map((holding) => (
                                    <li key={holding._id}>
                                        {holding.ticker} – {holding.shares} shares
                                        <br />
                                        Avg Cost: ${holding.averageCost.toFixed(2)}
                                        <br />
                                        {livePrices[holding.ticker]
                                            ? <>Live Price: ${livePrices[holding.ticker].toFixed(2)}</>
                                            : <em>Fetching live price...</em>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Portfolio;
