import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [transRes, acctRes] = await Promise.all([
        axios.get("http://localhost:5000/api/transactions", {
          headers: {Authorization: `Bearer ${token}`},
        }),
        axios.get("http://localhost:5000/api/accounts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTransactions(transRes.data);
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

  const filteredTransactions = transactions.filter((tx) => 
    accountFilter === "" ? true : tx.account === accountFilter
  );

  return (
    <div>
      <Navbar />
      <h2>Transactions</h2>
      <form onSubmit={handleSubmit}>
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

      <h3>Filter by Account</h3>
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

      <h3>All Transactions</h3>
      <ul>
        {filteredTransactions.map((tx) => (
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
              <>
                <strong>{tx.description}</strong> — ${tx.amount.toFixed(2)} ({tx.category})
                <button onClick={() => handleEditClick(tx)}>Edit</button>
                <button onClick={() => handleDelete(tx._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;

