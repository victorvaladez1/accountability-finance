import React from "react";

function AddHoldingModal({
    show,
    onClose,
    onAdd,
    newTicker,
    setNewTicker,
    newShares,
    setNewShares,
    newAvgCost,
    setNewAvgCost
}) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Add Holding</h3>
                <input
                    type="text"
                    placeholder="Ticker (e.g., AAPL)"
                    value={newTicker}
                    onChange={(e) => setNewTicker(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Shares"
                    value={newShares}
                    onChange={(e) => setNewShares(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Average Cost"
                    value={newAvgCost}
                    onChange={(e) => setNewAvgCost(e.target.value)}
                />
                <small style={{ fontSize: "0.8rem", color: "#666" }}>
                    Leave blank to use current market price
                </small>
                <button onClick={() => {
                    console.log("Add clicked inside modal");
                    onAdd();
                }}>Add</button>

                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default AddHoldingModal;
