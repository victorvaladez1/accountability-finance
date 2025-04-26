import React from "react";
import "./EditTransactionModal.css";
function EditTransactionModal({ isOpen, onClose, editForm, handleEditChange, handleUpdate }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit Transaction</h3>
        <form onSubmit={handleUpdate}>
          <input name="description" placeholder="Description" value={editForm.description} onChange={handleEditChange} required />
          <input name="amount" type="number" placeholder="Amount" value={editForm.amount} onChange={handleEditChange} required />
          <input name="category" placeholder="Category" value={editForm.category} onChange={handleEditChange} />
          <input name="date" type="date" value={editForm.date} onChange={handleEditChange} required />
          <select name="type" value={editForm.type} onChange={handleEditChange}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransactionModal;
