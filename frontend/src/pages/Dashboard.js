import React, {useEffect, useState } from "react";
import { Circles } from 'react-loader-spinner';
import axios from "axios";
import Navbar from "../components/Navbar";
import ExpensePieChart from "../components/ExpensePieChart";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [txLoading, setTxLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    type: "",
    balance: "",
  });

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    balance: "",
  });

  const [transactions, setTransactions] = useState([]);

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

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setTxLoading(false);
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

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this account?");
    if (!confirm) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete account.");
      console.error(err);
    }
  };

  const startEditing = (account) => {
    setEditingId(account._id);
    setEditForm({
      name: account.name,
      type: account.type,
      balance: account.balance,
    });
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", type: "", balance: "" });
  };
  
  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/accounts/${editingId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAccounts((prev) =>
        prev.map((acc) => (acc._id === editingId ? res.data : acc))
      );
      cancelEdit();
    } catch (err) {
      alert("Failed to update account.");
      console.error(err);
    }
  };
  

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const checkingCount = accounts.filter((acc) => acc.type === "Checking").length;
  const savingsCount = accounts.filter((acc) => acc.type === "Savings").length;

  return (
    <div>
      <Navbar />
      <h2>Welcome to your Dashboard</h2>

      <div style={{ margin: "20px 0" }}>
      <h3>Account Summary</h3>
      <p><strong>Total Balance:</strong> ${totalBalance.toFixed(2)}</p>
      <p><strong>Accounts:</strong> {accounts.length} ({checkingCount} Checking / {savingsCount} Savings)</p>
      </div>

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
            {editingId === acc._id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                />
                <select
                  name="type"
                  value={editForm.type}
                  onChange={handleEditChange}
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                </select>
                <input
                  type="number"
                  name="balance"
                  value={editForm.balance}
                  onChange={handleEditChange}
                />
                <button onClick={handleSave}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{acc.name}</strong> - ${acc.balance.toFixed(2)} ({acc.type})
                <button onClick={() => startEditing(acc)} style={{ marginLeft: "10px" }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(acc._id)}
                  style={{ marginLeft: "10px", background: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
          ))}
        </ul>
      )}

      {txLoading ? (
        <Circles height="60" width="60" color="#4fa94d" ariaLabel="loading" />
      ) : (
        <ExpensePieChart transactions={transactions} />
      )}

    </div>
  );
}

export default Dashboard;
