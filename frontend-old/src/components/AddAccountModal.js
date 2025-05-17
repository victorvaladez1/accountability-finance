import React from "react";

function AddAccountModal({ show, onClose, onCreate, newAccountName, setNewAccountName, newAccountBalance, setNewAccountBalance }) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>New Investment Account</h3>
                <input
                    type="text"
                    placeholder="Account Name"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Initial Balance"
                    value={newAccountBalance}
                    onChange={(e) => setNewAccountBalance(e.target.value)}
                />
                <button onClick={onCreate}>Create</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default AddAccountModal;
