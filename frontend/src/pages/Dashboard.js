import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { Circles } from "react-loader-spinner";
import { generateCashGraph } from "../utils/generateCashGraph";
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
      console.log("Bar Chart Data", res.data.months);
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
  
      const txData = Array.isArray(res.data) ? res.data : [];
  
      console.log("Transactions loaded:", txData);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const cashGraphData = generateCashGraph(transactions, accounts);

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

  const cashAccounts = accounts.filter(
    (a) => a.type === "Checking" || a.type === "Savings"
  );
  
  const totalBalance = cashAccounts.reduce((acc, curr) => acc + curr.balance, 0);
  const checkingCount = cashAccounts.filter((a) => a.type === "Checking").length;
  const savingsCount = cashAccounts.filter((a) => a.type === "Savings").length;

  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
      <Navbar />
      <h2>Welcome to your Dashboard</h2>

      <div className="section-card">
        <h3>Account Summary</h3>
        <p><strong>Total Balance:</strong> ${totalBalance.toFixed(2)}</p>
        <p><strong>Accounts:</strong> {cashAccounts.length} ({checkingCount} Checking / {savingsCount} Savings)</p>
        <p style={{ color: "#888", fontStyle: "italic" }}>
          Investment accounts are viewable in the <strong>Portfolio</strong> tab.
        </p>

        <div className="section-card">
          <h3>Cash Flow Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashGraphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="totalCash" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
            {accounts
            .filter((acc) => acc.type !== "Investment")
            .map((acc) => (
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
                    <div className="account-info">
                      <strong>{acc.name}</strong>
                      <span className="account-type-badge">
                        <span className={`account-type ${acc.type.toLowerCase()}`}>
                          {acc.type}
                        </span>
                      </span>
                    </div>
                    <p>${acc.balance.toFixed(2)}</p>
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
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={expenseData} margin={{ top: 15, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" stroke="#1f2937" tick={{ fontSize: 14, fontWeight: 'bold' }} />
              <YAxis stroke="#1f2937" tick={{ fontSize: 14, fontWeight: 'bold' }} />
              <Tooltip
                formatter={(value) => [`$${value.toFixed(2)}`, "Total"]}
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #d1d5db", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)" }}
                labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <Bar
                dataKey="total"
                fill="url(#colorSpending)"
                radius={[10, 10, 0, 0]}
                barSize={50}
              />
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
        {!txLoading && Array.isArray(transactions) && transactions.some(tx => tx.type === "Expense") ? (
          <ExpensePieChart transactions={transactions} />
        ) : (
          <p style={{ textAlign: "center", color: "#666", marginTop: "1rem" }}>
            No expenses to show pie chart.
          </p>
        )}
      </div>

    </div>
  );
}

export default Dashboard;