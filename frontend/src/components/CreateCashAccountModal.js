import React from "react";

import "../pages/CommonLayout.css";
import "../pages/Dashboard.css";

function CreateCashAccountModal({ isOpen, onClose, onSubmit, form, handleChange }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create a New Cash Account</h3>
        <form onSubmit={onSubmit}>
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
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
            <button type="submit">Add Account</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCashAccountModal;
