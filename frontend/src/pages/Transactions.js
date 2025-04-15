import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Transactions.css";

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
  const [editForm, setEditForm] = useState({
    account: "",
    type: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [accountFilter, setAccountFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  
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
  };

  const [sortOption, setSortOption] = useState("dateDesc"); // default: newest first

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = currentPage, limit = rowsPerPage) => {
    const token = localStorage.getItem("token");
    try {
      const [transRes, acctRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/transactions?page=${page}&limit=${limit}`, {
          headers: {Authorization: `Bearer ${token}`},
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
      console.error("error loading data:", err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5000/api/transactions", form, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setForm({
        account: "",
        type: "Expense",
        amount: "",
        category: "",
        description: "",
        date: "",
      });
      fetchData();
    } catch (err) {
      alert("Failed to create transaction");
    }
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/transactions/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update in-place
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? res.data : tx))
      );
      setEditingId(null);
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

  const uniqueCategories = Array.isArray(transactions)
  ? [...new Set(transactions.map(tx => tx.category))]
  : [];


  const filteredTransactions = transactions.filter((tx) => {
    const matchesAccount = accountFilter === "" || tx.account === accountFilter;
    const matchesCategory = categoryFilter === "" || tx.category === categoryFilter;
    const matchesType = typeFilter === "" || tx.type === typeFilter;
    return matchesAccount && matchesCategory && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch(sortOption) {
      case "dateAsc":
        return new Date(a.date) - new Date(b.date);
      case "dateDesc":
        return new Date(b.date) - new Date(a.date);
      case "amountAsc":
        return a.amount - b.amount;
      case "amountDesc":
        return b.amount - a.amount;
      default:
        return 0;
    }
  });

  return (
    <div className="transactions-container">
      <Navbar />
      <h2>Transactions</h2>

      <div className="transaction-form-card">
        <form onSubmit={handleSubmit} className="transaction-form">
          <select
            name="account"
            value={form.account}
            onChange={handleChange}
            required
          >
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name} (${acc.balance.toFixed(2)})
              </option>
            ))}
          </select>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <button type="submit">Add Transaction</button>
        </form>
      </div>

      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filters">
          <select 
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
          >
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name}
              </option>
            ))}
          </select>

          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          
          <label></label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="dateDesc">Date (Newest)</option>
            <option value="dateAsc">Date (Oldest)</option>
            <option value="amountDesc">Amount (High to Low)</option>
            <option value="amountAsc">Amount (Low to High)</option>
          </select>
        </div>
      </div>

      <div className="transaction-list-section">
        <h3>All Transactions</h3>
        <ul className="transaction-list">
          {sortedTransactions.map((tx) => (
            <li key={tx._id}>
              {editingId === tx._id ? (
                <form onSubmit={(e) => handleUpdate(e, tx._id)}>
                  <input name="description" value={editForm.description} onChange={handleEditChange} />
                  <input name="amount" type="number" value={editForm.amount} onChange={handleEditChange} />
                  <input name="category" value={editForm.category} onChange={handleEditChange} />
                  <input name="date" type="date" value={editForm.date} onChange={handleEditChange} />
                  <select name="type" value={editForm.type} onChange={handleEditChange}>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                  <button type="submit">Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </form>
              ) : (
                <div className={`transaction-item ${tx.type.toLowerCase()}`}>
                  <div>
                    <strong>{tx.description}</strong> — ${tx.amount.toFixed(2)} ({tx.category})
                  </div>
                  <div className="actions">
                  <button onClick={() => handleEditClick(tx)}>Edit</button>
                  <button onClick={() => handleDelete(tx._id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="rows-per-page">
      <label>Rows per page: </label>
      <select
        value={rowsPerPage}
        onChange={(e) => {
          const newLimit = parseInt(e.target.value);
          setRowsPerPage(newLimit);
          fetchData(1, newLimit);
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>

          <div className="pagination-controls">
            <button 
              disabled={currentPage === 1}
              onClick={() => fetchData(currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchData(currentPage + 1)}
            >
              Next
            </button>
          </div>
    </div>
  );
}

export default Transactions;