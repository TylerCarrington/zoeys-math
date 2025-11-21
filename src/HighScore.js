import React, { useState, useEffect, useCallback } from "react";

// --- Date/Time Utility Functions ---

/**
 * Generates a time-based key for high score storage.
 */
const getPeriodKey = (type) => {
  const now = new Date();
  if (type === "daily") return now.toDateString();
  if (type === "weekly") {
    // Start of the week (Sunday) - use a new Date to avoid mutation
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return weekStart.toDateString();
  }
  if (type === "monthly") return `${now.getFullYear()}-${now.getMonth()}`;
  return "allTime";
};

/**
 * Loads high scores from localStorage based on current time periods.
 */
const loadHighScores = () => {
  const allTime = JSON.parse(localStorage.getItem("highScore_allTime")) || {
    coins: 0,
    coinTimestamp: null,
    tickets: 0,
    ticketTimestamp: null,
  };

  // Get keys for current period
  const dailyKey = getPeriodKey("daily");
  const weeklyKey = getPeriodKey("weekly");
  const monthlyKey = getPeriodKey("monthly");

  // Load scores for current periods
  const daily = JSON.parse(localStorage.getItem(`highScore_${dailyKey}`)) || {
    coins: 0,
    coinTimestamp: null,
    tickets: 0,
    ticketTimestamp: null,
  };
  const weekly = JSON.parse(localStorage.getItem(`highScore_${weeklyKey}`)) || {
    coins: 0,
    coinTimestamp: null,
    tickets: 0,
    ticketTimestamp: null,
  };
  const monthly = JSON.parse(
    localStorage.getItem(`highScore_${monthlyKey}`)
  ) || {
    coins: 0,
    coinTimestamp: null,
    tickets: 0,
    ticketTimestamp: null,
  };

  return { daily, weekly, monthly, allTime };
};

// --- High Score Modal Component (Internal) ---

const HighScoreModal = ({ highScoreData, onClose }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const scoreCategories = [
    { key: "daily", label: "Today" },
    { key: "weekly", label: "This Week" },
    { key: "monthly", label: "This Month" },
    { key: "allTime", label: "All Time" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>🏆 High Scores Breakdown</h2>
        <table className="high-score-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Coins 🪙</th>
              <th>Achieved On</th>
              <th>Tickets 🎟️</th>
              <th>Achieved On</th>
            </tr>
          </thead>
          <tbody>
            {scoreCategories.map((category) => (
              <tr key={category.key}>
                <td>{category.label}</td>
                <td>{highScoreData[category.key]?.coins || 0}</td>
                <td>{formatTimestamp(highScoreData[category.key]?.coinTimestamp)}</td>
                <td>{highScoreData[category.key]?.tickets || 0}</td>
                <td>{formatTimestamp(highScoreData[category.key]?.ticketTimestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose} className="submit-button">
          Close
        </button>
      </div>
    </div>
  );
};

// --- Main HighScore Component ---

const HighScore = ({ sessionEndTrigger }) => {
  const [highScores, setHighScores] = useState(loadHighScores);
  const [showModal, setShowModal] = useState(false);

  // Logic to update high scores across all time periods
  const updateHighScores = useCallback((sessionCoins, sessionTickets) => {
    if (sessionCoins === 0 && sessionTickets === 0) return;

    const now = Date.now();
    const periods = [
      { type: "daily", key: getPeriodKey("daily") },
      { type: "weekly", key: getPeriodKey("weekly") },
      { type: "monthly", key: getPeriodKey("monthly") },
      { type: "allTime", key: "allTime" },
    ];

    let updated = false;
    const newScores = {};

    periods.forEach(({ type, key }) => {
      const storageKey = `highScore_${key}`;
      // Retrieve current high score from storage
      const currentHigh = JSON.parse(localStorage.getItem(storageKey)) || {
        coins: 0,
        coinTimestamp: null,
        tickets: 0,
        ticketTimestamp: null,
      };

      let updatedScore = currentHigh;

      // Update coins high score if the new session score is strictly better
      if (sessionCoins > currentHigh.coins) {
        updatedScore = {
          ...updatedScore,
          coins: sessionCoins,
          coinTimestamp: now,
        };
        updated = true;
      }

      // Update tickets high score if the new session score is strictly better
      if (sessionTickets > currentHigh.tickets) {
        updatedScore = {
          ...updatedScore,
          tickets: sessionTickets,
          ticketTimestamp: now,
        };
        updated = true;
      }

      newScores[type] = updatedScore;
      localStorage.setItem(storageKey, JSON.stringify(updatedScore));
    });

    // Only update state if a new high score was achieved, otherwise just reload to refresh keys
    if (updated) {
      setHighScores(newScores);
    } else {
      setHighScores(loadHighScores());
    }
  }, []);

  // Effect to run the high score update logic after a game session ends
  useEffect(() => {
    if (sessionEndTrigger && sessionEndTrigger.time) {
      updateHighScores(sessionEndTrigger.coins, sessionEndTrigger.tickets);
    }
  }, [sessionEndTrigger, updateHighScores]);

  // Ensure current period scores are loaded on mount
  useEffect(() => {
    setHighScores(loadHighScores());
  }, []);

  const todaysHigh = highScores.daily;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          display: "flex",
          gap: 8,
          cursor: "pointer",
          zIndex: 10,
        }}
        onClick={() => setShowModal(true)} // Open modal on click
      >
        <span>⭐ High Score Today: </span>
        <span>🪙 {todaysHigh.coins}</span>
        <span>🎟️ {todaysHigh.tickets}</span>
      </div>

      {showModal && (
        <HighScoreModal
          highScoreData={highScores}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default HighScore;
