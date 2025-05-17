import React from "react";
import Modal from "react-modal";
import "./EditTransactionModal.css";

const AddTransactionModal = ({
    isOpen,
    onClose,
    form,
    handleChange,
    handleSubmit,
    accounts,
  }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Add Transaction"
        className="modal"
        overlayClassName="overlay"
        ariaHideApp={false}
      >
        <h2>Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          <select name="account" value={form.account} onChange={handleChange} required>
            <option value="">Select Account</option>
            {accounts.map((acc) => (
              <option key={acc._id} value={acc._id}>
                {acc.name} (${acc.balance.toFixed(2)})
              </option>
            ))}
          </select>
  
          <select name="type" value={form.type} onChange={handleChange} required>
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
  
          <div className="modal-buttons">
            <button type="submit" className="primary-btn">Add</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </Modal>
    );
  };
  
  export default AddTransactionModal;