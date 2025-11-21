import React from "react";

/**
 * Component to display the Gem transaction history in a modal.
 */
const GemHistoryModal = ({ history, onClose }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <h2>💎 Gem Transaction History</h2>
        {history.length === 0 ? (
          <p>No Gem history found.</p>
        ) : (
          <table className="high-score-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Source</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history
                .slice()
                .reverse()
                .map(
                  (
                    entry,
                    index // Show newest first
                  ) => (
                    <tr key={index}>
                      <td
                        style={{ color: entry.amount > 0 ? "#4CAF50" : "red" }}
                      >
                        {entry.amount > 0 ? `+${entry.amount}` : entry.amount}{" "}
                        💎
                      </td>
                      <td>{entry.source}</td>
                      <td>{formatTimestamp(entry.timestamp)}</td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        )}
        <button onClick={onClose} className="submit-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default GemHistoryModal;
