import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Sector, Legend } from "recharts";
import { Circles } from "react-loader-spinner";
import { generateCashGraph } from "../utils/generateCashGraph";
import { generatePerAccountCashGraphs } from "../utils/generatePerAccountCashGraphs";
import { generatePerAccountCategoryData } from "../utils/generatePerAccountCategoryData";
import axios from "axios";
import Navbar from "../components/Navbar";
import CreateCashAccountModal from "../components/CreateCashAccountModal";
import ExpensePieChart from "../components/ExpensePieChart";
import "./Dashboard.css";
import "./CommonLayout.css";

const API = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ name: "", type: ""});
  const [editForm, setEditForm] = useState({ name: "", type: "", balance: "" });

  const [expenseData, setExpenseData] = useState([]);
  const [average, setAverage] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [range, setRange] = useState("30d");

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/analytics/monthly-expenses`, {
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
      const res = await axios.get(`${API}/api/accounts`, {
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
      const res = await axios.get(`${API}/api/transactions`, {
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
  const perAccountCashGraphs = generatePerAccountCashGraphs(transactions, accounts);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/api/accounts`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts((prev) => [res.data, ...prev]);
      setForm({ name: "", type: ""});
    } catch (err) {
      alert("Error creating account");
    }
  };

  const filterByRange = (data, range) => {
    if (range === "all") return data;
  
    const now = new Date();
    const cutoff = new Date(
      range === "7d"
        ? now.setDate(now.getDate() - 7)
        : now.setDate(now.getDate() - 30)
    );
  
    return data.filter((item) => new Date(item.date || item.timestamp) >= cutoff);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/accounts/${id}`, {
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
      const res = await axios.put(`${API}/api/accounts/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const filteredCashGraphData = filterByRange(cashGraphData, range);
  const filteredPerAccountCashGraphs = perAccountCashGraphs.map((graph) => ({
    ...graph,
    snapshots: filterByRange(graph.snapshots, range),
  }));

  return (
    <div className="page-container">
      <Navbar />
      <h2>Welcome to your Dashboard</h2>

      <div className="section-card-white">
        <div className="summary-section">
          {/* Account Summary */}
          <div className="summary-box">
            <div className="section-header">
              <h3>Account Summary</h3>
            </div>
            <div className="summary-grid">
            <div>
              <p className="summary-label">Total Balance:</p>
              <p className="summary-value">
                ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
              <div>
                <p className="summary-label">Accounts:</p>
                <p className="summary-value">
                  {cashAccounts.length} ({checkingCount} Checking / {savingsCount} Savings)
                </p>
              </div>
            </div>
            <p className="summary-note">
              Investment accounts are viewable in the <strong><em>Portfolio</em></strong> tab.
            </p>
          </div>

          {/* Expenses by Category */}
          <div className="summary-pie">
            <h3>Expenses by Category</h3>
            {!txLoading && Array.isArray(transactions) && transactions.some(tx => tx.type === "Expense") ? (
              <ExpensePieChart transactions={transactions} />
            ) : (
              <p style={{ textAlign: "center", color: "#666", marginTop: "1rem" }}>
                No expenses to show pie chart.
              </p>
            )}
          </div>
        </div>

        {/* Chart Filters */}
        {/* Cash Flow Chart */}
        <h3>Cash Flow Over Time</h3>
        <div className="chart-filters">
          {["7d", "30d", "All"].map((r) => (
            <button
              key={r}
              className={range === r.toLowerCase() ? "active" : ""}
              onClick={() => setRange(r.toLowerCase())}
            >
              {r}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredCashGraphData}>
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
            <YAxis tickFormatter={(val) => `$${val.toLocaleString()}`} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
              }}
              itemStyle={{ color: "#333", fontWeight: 500 }}
              labelStyle={{ fontWeight: "bold", color: "#555" }}
              labelFormatter={(str) => `Date: ${new Date(str).toLocaleDateString()}`}
              formatter={(val) => [`$${val.toLocaleString()}`, "Total Cash"]}
            />
            <Line
              type="monotone"
              dataKey="totalCash"
              stroke="url(#cashGradient)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
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

      <div className="section-card">
        <h3>Your Accounts</h3>
        {accounts.length === 0 ? (
          <p>No accounts yet.</p>
        ) : (
          <ul className="account-list">
            {accounts
              .filter((acc) => acc.type !== "Investment")
              .map((acc) => {
                const graphData =
                  filteredPerAccountCashGraphs.find((g) => g.accountId === acc._id)?.snapshots || [];

                const categoryData = generatePerAccountCategoryData(transactions, acc._id);

                return (
                  <li key={acc._id} className="account-item">
                    <div className="account-header-row">
                      <div className="account-info-block">
                        <div className="account-name-row">
                          <strong className="account-name">{acc.name}</strong>
                          <span className={`account-type-badge ${acc.type.toLowerCase()}`}>
                            {acc.type}
                          </span>
                        </div>
                        <div className="account-balance-large">
                          ${acc.balance.toLocaleString()}
                        </div>
                      </div>

                      <div className="account-action-buttons">
                        {editingId === acc._id ? (
                          <>
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
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleDelete(acc._id)}>Delete</button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="account-visuals">
                      <div className="account-chart-line">
                        <h4>Cash Flow Over Time</h4>
                        {graphData.length === 0 ? (
                          <p style={{ textAlign: 'center', padding: '2rem 0', color: '#666' }}>
                            No cash flow data available.
                          </p>
                        ) : (
                          <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={graphData}>
                              <defs>
                                <linearGradient id={`gradient-${acc._id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                              <XAxis dataKey="timestamp" tickFormatter={(str) => new Date(str).toLocaleDateString()} />
                              <YAxis tickFormatter={(val) => `$${val.toLocaleString()}`} domain={['auto', 'auto']} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "#ffffff",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
                                  border: "1px solid #e0e0e0",
                                }}
                                itemStyle={{ color: "#333", fontWeight: 500 }}
                                labelStyle={{ fontWeight: "bold", color: "#555" }}
                                labelFormatter={(str) => `Date: ${new Date(str).toLocaleDateString()}`}
                                formatter={(val) => [`$${val.toLocaleString()}`, "Balance"]}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={`url(#gradient-${acc._id})`}
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}

                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      <div style={{ textAlign: "left", margin: "1rem 0" }}>
        <button onClick={() => setIsModalOpen(true)} className="add-account-btn">
          + Add Cash Account
        </button>
      </div>

      <CreateCashAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(e) => {
          handleCreateAccount(e);
          setIsModalOpen(false);
        }}
        form={form}
        handleChange={handleChange}
      />

    </div>
  );
}

export default Dashboard;