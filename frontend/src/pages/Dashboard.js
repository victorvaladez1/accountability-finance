import React, {useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load accounts. Make sure you're logged in.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      {accounts.length === 0 ? (
        <p>You don't have any accounts yet.</p>
      ) : (
        <ul>
          {accounts.map((acc) => (
            <li key={acc._id}>
              <strong>{acc.name}</strong> - ${acc.balance.toFixed(2)} ({acc.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
