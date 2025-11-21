import React, { useState, useEffect, useCallback } from "react";

// --- Date/Time Utility Functions ---

/**
 * Generates a time-based key for high score storage.
 */
const getPeriodKey = (type) => {
  const now = new Date();
  if (type === "daily") return now.toDateString();
  if (type === "weekly") {
    // Start of the week (Sunday) - use a a new Date to avoid mutation
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return weekStart.toDateString();
  }
  if (type === "monthly") return `${now.getFullYear()}-${now.getMonth()}`;
  return "allTime"; // Should not be called for 'allTime' in this context, but as a fallback
};

/**
 * Loads high scores from localStorage based on current time periods
 * in a single streamlined entry.
 */
const loadHighScores = () => {
  const storedData = JSON.parse(localStorage.getItem("allHighScoresData")) || {};

  const now = Date.now();

  // Initialize default structure for each period if not present or needs reset
  const initializePeriodScore = (currentScore, periodType) => {
    const periodKey = getPeriodKey(periodType);
    const defaultScore = {
      coins: 0,
      coinTimestamp: null,
      tickets: 0,
      ticketTimestamp: null,
      dateKey: periodKey, // Store the date key to check for resets
    };

    if (
      !currentScore ||
      (periodType !== "allTime" && currentScore.dateKey !== periodKey)
    ) {
      // Reset if no score or period key has changed (new day/week/month)
      return defaultScore;
    }
    // If period key matches or it's allTime, keep existing score but update dateKey if needed (for allTime it won't matter)
    return { ...currentScore, dateKey: periodKey };
  };

  const daily = initializePeriodScore(storedData.daily, "daily");
  const weekly = initializePeriodScore(storedData.weekly, "weekly");
  const monthly = initializePeriodScore(storedData.monthly, "monthly");
  const allTime = initializePeriodScore(storedData.allTime, "allTime"); // allTime doesn't reset by dateKey

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
    const updatedScores = { ...highScores }; // Start with current scores

    const periods = [
      { type: "daily", key: getPeriodKey("daily") },
      { type: "weekly", key: getPeriodKey("weekly") },
      { type: "monthly", key: getPeriodKey("monthly") },
      { type: "allTime", key: "allTime" },
    ];

    let changed = false;

    periods.forEach(({ type, key }) => {
      let currentHigh = updatedScores[type];

      // Reset period scores if the dateKey doesn't match the current period
      if (type !== "allTime" && currentHigh.dateKey !== key) {
        currentHigh = {
          coins: 0,
          coinTimestamp: null,
          tickets: 0,
          ticketTimestamp: null,
          dateKey: key,
        };
        changed = true;
      }

      // Update coins high score if the new session score is strictly better
      if (sessionCoins > currentHigh.coins) {
        currentHigh = {
          ...currentHigh,
          coins: sessionCoins,
          coinTimestamp: now,
        };
        changed = true;
      }

      // Update tickets high score if the new session score is strictly better
      if (sessionTickets > currentHigh.tickets) {
        currentHigh = {
          ...currentHigh,
          tickets: sessionTickets,
          ticketTimestamp: now,
        };
        changed = true;
      }
      updatedScores[type] = currentHigh;
    });

    if (changed) {
      setHighScores(updatedScores);
      localStorage.setItem("allHighScoresData", JSON.stringify(updatedScores));
    }
  }, [highScores]); // Depend on highScores to ensure we get the latest state

  // Effect to run the high score update logic after a game session ends
  useEffect(() => {
    if (sessionEndTrigger && sessionEndTrigger.time) {
      updateHighScores(sessionEndTrigger.coins, sessionEndTrigger.tickets);
    }
  }, [sessionEndTrigger, updateHighScores]);

  // On mount, load scores and clean up old local storage entries
  useEffect(() => {
    setHighScores(loadHighScores());

    // Clean up old local storage entries
    const oldKeys = [
      "highScore_allTime",
      // Add other patterns for old daily/weekly/monthly keys if you know them
      // For example, if they were consistently named like "highScore_Sun Nov 16 2025"
      // it's hard to remove them without iterating through all local storage keys.
      // For now, we'll remove the main one, and others will naturally stop being used.
    ];
    oldKeys.forEach((key) => localStorage.removeItem(key));

    // Attempt to remove common date-based old keys if they exist
    const now = new Date();
    for (let i = 0; i < 365; i++) { // Check for a year's worth of daily/weekly keys
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        localStorage.removeItem(`highScore_${d.toDateString()}`);
        
        const weekStart = new Date(d);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        localStorage.removeItem(`highScore_${weekStart.toDateString()}`);
        
        localStorage.removeItem(`highScore_${d.getFullYear()}-${d.getMonth()}`);
    }

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
