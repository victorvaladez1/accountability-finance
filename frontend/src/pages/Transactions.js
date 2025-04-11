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

      <h3>All Transactions</h3>
      <ul>
        {transactions.map((tx) => (
          <li key={tx._id}>
            {tx.type === "Expense" ? "🟥" : "🟩"} {tx.description || "(No desc)"} — ${tx.amount} on {new Date(tx.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Transactions;

