import React, {useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div>{error}</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/accounts", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts((prev) => [res.data, ...prev]); // add to the top
      setForm({ name: "", type: "", balance: ""}); // reset form
    } catch (err) {
      alert("Error creating account: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Welcome to your Dashboard</h2>

      <h3>Create a New Account</h3>
      <form onSubmit={handleCreateAccount}>
        <input 
          type="text"
          name="name"
          placeholder="Account Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Checking">Checking</option>
          <option value="Savings">Savings</option>
        </select>

        <input 
          type="number"
          name="balance"
          placeholder="Starting Balance"
          value={form.balance}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Account</button>
      </form>

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
