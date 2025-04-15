import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Circles } from "react-loader-spinner";
import axios from "axios";
import Navbar from "../components/Navbar";
import ExpensePieChart from "../components/ExpensePieChart";
import "./Dashboard.css";
import "./CommonLayout.css";

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: "", type: "", balance: "" });
  const [editForm, setEditForm] = useState({ name: "", type: "", balance: "" });

  const [expenseData, setExpenseData] = useState([]);
  const [average, setAverage] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/analytics/monthly-expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setExpenseData(res.data.months);
      setAverage(res.data.average);
      setCurrentMonth(res.data.currentMonth);
    };
  
    fetchExpenses();
    fetchAccounts();
    fetchTransactions();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      setError("Failed to load accounts. Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setTxLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/accounts", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts((prev) => [res.data, ...prev]);
      setForm({ name: "", type: "", balance: "" });
    } catch (err) {
      alert("Error creating account");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const startEditing = (acc) => {
    setEditingId(acc._id);
    setEditForm({ name: acc.name, type: acc.type, balance: acc.balance });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", type: "", balance: "" });
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      alert("Update failed.");
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const checkingCount = accounts.filter((a) => a.type === "Checking").length;
  const savingsCount = accounts.filter((a) => a.type === "Savings").length;

  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
      <Navbar />
      <h2>Welcome to your Dashboard</h2>

      <div className="section-card">
        <h3>Account Summary</h3>
        <p><strong>Total Balance:</strong> ${totalBalance.toFixed(2)}</p>
        <p><strong>Accounts:</strong> {accounts.length} ({checkingCount} Checking / {savingsCount} Savings)</p>
      </div>

      <div className="section-card">
        <h3>Create a New Account</h3>
        <form className="account-form" onSubmit={handleCreateAccount}>
          <div className="form-row">
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
            </div>
        </form>
      </div>

      <div className="section-card">
        <h3>Your Accounts</h3>
        {accounts.length === 0 ? (
          <p>No accounts yet.</p>
        ) : (
          <ul className="account-list">
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
                  <>
                    <strong>{acc.name}</strong> - ${acc.balance.toFixed(2)} ({acc.type})
                    <div className="actions">
                      <button onClick={() => startEditing(acc)}>Edit</button>
                      <button onClick={() => handleDelete(acc._id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section-card">
        <div className="analytics-section">
          <h3>Monthly Spending (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="total" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>

          <div className="expense-summary-message">
            {currentMonth < average ? (
              <p>🎉 You’ve spent <strong>${(average - currentMonth).toFixed(2)}</strong> less than your average monthly spending.</p>
            ) : (
              <p>⚠️ You’ve spent <strong>${(currentMonth - average).toFixed(2)}</strong> more than your average monthly spending.</p>
            )}
          </div>
        </div>
      </div>

      <div className="chart-section">
        {!txLoading && transactions.length > 0 && (
          <ExpensePieChart transactions={transactions} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
