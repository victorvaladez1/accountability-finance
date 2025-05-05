import React from "react";
import "./Modal.css"; // If you're reusing the same modal styles

function CreateCashAccountModal({ isOpen, onClose, onSubmit, form, handleChange }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
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
          <div className="modal-actions">
            <button type="submit">Add Account</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCashAccountModal;
