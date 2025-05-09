import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import EditTransactionModal from "../components/EditTransactionModal";
import AddTransactionModal from "../components/AddTransactionModal";
import "./Transactions.css";
import "./CommonLayout.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    account: "",
    type: "Expense",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [accountFilter, setAccountFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");

  const [viewByMonth, setViewByMonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlyTransactions, setMonthlyTransactions] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
    fetchMonthlyData();
  }, []);

  const fetchData = async (page = currentPage, limit = rowsPerPage) => {
    try {
      const token = localStorage.getItem("token");
      const [transRes, acctRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/transactions?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/accounts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTransactions(transRes.data.transactions);
      setCurrentPage(transRes.data.currentPage);
      setTotalPages(transRes.data.totalPages);
      setAccounts(acctRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/transactions/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMonthlyTransactions(res.data);
    } catch (err) {
      console.error("Error fetching monthly transactions:", err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/transactions", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ account: "", type: "Expense", amount: "", category: "", description: "", date: "" });
      fetchData();
    } catch (err) {
      alert("Failed to create transaction.");
    }
  };

  const handleEditClick = (tx) => {
    setEditingId(tx._id);
    setEditForm({
      account: tx.account,
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: tx.date ? tx.date.slice(0, 10) : "",
    });
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/transactions/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === editingId ? res.data : tx))
      );
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      alert("Error updating transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) {
      alert("Error deleting transaction.");
    }
  };

  const uniqueCategories = [...new Set(transactions.map(tx => tx.category))];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesAccount = !accountFilter || tx.account === accountFilter;
    const matchesCategory = !categoryFilter || tx.category === categoryFilter;
    const matchesType = !typeFilter || tx.type === typeFilter;
    return matchesAccount && matchesCategory && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortOption) {
      case "dateAsc": return new Date(a.date) - new Date(b.date);
      case "dateDesc": return new Date(b.date) - new Date(a.date);
      case "amountAsc": return a.amount - b.amount;
      case "amountDesc": return b.amount - a.amount;
      default: return 0;
    }
  });

  return (
    <div className="page-container">
      <Navbar />
      
      <h2>Transactions</h2>
  
        <button
          className="add-transaction-btn"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Add Transaction
        </button>

      {/* 🔍 Filters */}
      <div className="section-card">
        <h3>Filters</h3>
        <div className="filters">
          <select value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)}>
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>{acc.name}</option>
            ))}
          </select>
  
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
  
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
  
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="dateDesc">Date (Newest)</option>
            <option value="dateAsc">Date (Oldest)</option>
            <option value="amountDesc">Amount (High to Low)</option>
            <option value="amountAsc">Amount (Low to High)</option>
          </select>
  
          {/* 📅 Group by Month Toggle inside Filters */}
          <div className="group-by-month">
            <input
              type="checkbox"
              id="groupByMonthToggle"
              checked={viewByMonth}
              onChange={(e) => setViewByMonth(e.target.checked)}
            />
            <label htmlFor="groupByMonthToggle">Group by Month</label>
  
            {viewByMonth && (
              <select
                className="month-dropdown"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {Object.keys(monthlyTransactions).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
  
      {/* 📄 Transaction List */}
      <div className="section-card">
        <h3>{viewByMonth && selectedMonth ? `Transactions for ${selectedMonth}` : "All Transactions"}</h3>
  
        <ul className="transaction-list">
          {(viewByMonth && selectedMonth ? monthlyTransactions[selectedMonth] || [] : sortedTransactions).map((tx) => (
            <li key={tx._id}>
              <div className={`transaction-item ${tx.type.toLowerCase()}`}>
                <div className="transaction-header">
                  <div className="transaction-left">
                    <div className="transaction-topline">
                      <strong>{tx.description}</strong> — ${tx.amount.toFixed(2)} ({tx.category})
                    </div>
                    <div className="transaction-meta">
                      <div>Date: {new Date(tx.date).toLocaleDateString()}</div>
                      <div>Account: {tx.account?.name || "Unknown"}</div>
                      <div>Balance: ${tx.account?.balance?.toFixed(2) || "N/A"}</div>
                    </div>
                  </div>
  
                  <div className="transaction-actions">
                    <button onClick={() => handleEditClick(tx)}>Edit</button>
                    <button onClick={() => handleDelete(tx._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
  
      {/* 📚 Pagination Controls */}
      {!viewByMonth && (
        <div className="section-card">
          <div className="pagination-footer-inner"s>
            <div className="rows-control">
              <label htmlFor="rowsPerPage" className="rows-label">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  setRowsPerPage(newLimit);
                  fetchData(1, newLimit);
                }}
                className="rows-dropdown"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="pagination-controls">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => fetchData(currentPage - 1, rowsPerPage)}
              >
                Previous
              </button>

              <span className="pagination-page-text">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => fetchData(currentPage + 1, rowsPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ✏️ Edit Modal */}
      <EditTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editForm={editForm}
        handleEditChange={handleEditChange}
        handleUpdate={handleUpdate}
      />
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        form={form}
        handleChange={handleChange}
        handleSubmit={(e) => {
          handleSubmit(e);
          setShowAddModal(false);
        }}
        accounts={accounts}
      />
    </div>
  );
}

export default Transactions;
