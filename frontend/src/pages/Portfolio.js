import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./CommonLayout.css";
import "./Portfolio.css";

function Portfolio() {
    const [accounts, setAccounts] = useState([]);
    const [holdingsMap, setHoldingsMap] = useState({});
    const [loading, setLoading] = useState(true);
    
    // Fetch accounts on load
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

                // Fetch holdings for each investment account
                const holdingsData = {};
                for (const acc of investmentAccounts) {
                    const res = await fetch(`/api/holdings/${acc._id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    const data = await res.json();
                    holdingsData[acc._id] = data;
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
            {accounts.length === 0 ? (
                <p>No investment accounts found</p>
            ) : (
                accounts.map((account) => (
                    <div key={account._id} className="account-card">
                        <h3>{account.name}</h3>
                        <ul>
                            {(holdingsMap[account._id] || []).map((holding) => (
                                    <li key={holding._id}>
                                        {holding.ticker} – {holding.shares} shares @ ${holding.averageCost.toFixed(2)}
                                    </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
}

export default Portfolio;