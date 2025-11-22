import React, { useState } from "react";
import { couponCodes } from "../data/couponCodes";

/**
 * Component to display the Gem transaction history in a modal
 * and allow users to enter coupon codes.
 */
const GemHistoryModal = ({ history, onClose, onCodeRedeem }) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState("");

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCodeSubmit = () => {
    const code = couponCode.toUpperCase().trim();
    setCouponCode(""); // Clear the input field

    // Retrieve used codes from local storage
    const usedCodes = JSON.parse(localStorage.getItem("usedCouponCodes")) || [];

    if (usedCodes.includes(code)) {
      setCouponFeedback("Code already used!");
      return;
    }

    const codeData = couponCodes[code];

    if (codeData) {
      onCodeRedeem(code, codeData.type, codeData.amount || codeData.card, codeData.message, codeData.card);
      setCouponFeedback(`Coupon redeemed! You received ${codeData.message}`);

      // Add code to used codes and store in local storage
      const newUsedCodes = [...usedCodes, code];
      localStorage.setItem("usedCouponCodes", JSON.stringify(newUsedCodes));
    } else {
      setCouponFeedback("Invalid coupon code.");
    }
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

        {/* Coupon Code Section */}
        <div style={{ marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <h3>Have a Coupon Code?</h3>
          <input
            type="text"
            placeholder="Enter code here"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="name-input"
            style={{ width: "calc(100% - 100px)", marginRight: "10px" }}
          />
          <button onClick={handleCodeSubmit} className="submit-button">
            Redeem
          </button>
          {couponFeedback && <p style={{ marginTop: "10px", color: couponFeedback.includes("Error") || couponFeedback.includes("Invalid") || couponFeedback.includes("used") ? "red" : "#4CAF50" }}>{couponFeedback}</p>}
        </div>

        <button onClick={onClose} className="submit-button" style={{ marginTop: "20px" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default GemHistoryModal;