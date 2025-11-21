import { useState } from "react";
import MathTimer from "./MathTimer";
import NameEntry from "./NameEntry";
import Shop from "./Shop";
import GemHistoryModal from "./GemHistoryModal";
import HighScore from "./HighScore"; // <-- NEW IMPORT: The component you provided

function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  const [page, setPage] = useState("game");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 0
  );
  const [tickets, setTickets] = useState(
    parseInt(localStorage.getItem("tickets")) || 0
  );

  // State for session end trigger to pass to HighScore.js
  // This will contain {coins, tickets, time} when a session finishes.
  const [sessionEndTrigger, setSessionEndTrigger] = useState(null);

  // States for Gems and history
  const [gems, setGems] = useState(parseInt(localStorage.getItem("gems")) || 0);
  const [gemHistory, setGemHistory] = useState(
    JSON.parse(localStorage.getItem("gemHistory")) || []
  );
  const [showGemHistory, setShowGemHistory] = useState(false);

  // HighScoreModal state is now managed inside HighScore.js,
  // so we remove showHighScoreModal and toggleHighScoreModal from App.js.

  const persistGems = (amount, source) => {
    setGems((prevGems) => {
      const newGems = prevGems + amount;
      localStorage.setItem("gems", newGems);
      return newGems;
    });

    setGemHistory((prevHistory) => {
      const newEntry = {
        amount: amount,
        source: source,
        timestamp: Date.now(),
      };
      const newHistory = [...prevHistory, newEntry];
      localStorage.setItem("gemHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const toggleGemHistoryModal = () => {
    setShowGemHistory((prev) => !prev);
  };

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage("game");
  };

  const persistCoins = (sessionCoins) => {
    const totalCoins =
      parseInt(localStorage.getItem("coins") || "0") + sessionCoins;
    localStorage.setItem("coins", totalCoins);
    setCoins((prev) => prev + sessionCoins);
  };

  const persistTickets = (sessionTickets) => {
    const totalTickets =
      parseInt(localStorage.getItem("tickets") || "0") + sessionTickets;
    localStorage.setItem("tickets", totalTickets);
    setTickets((prev) => prev + sessionTickets);
  };

  // NEW: Pass session results to the HighScore component and update total coins/tickets
  const handleSessionEnd = (sessionCoins, sessionTickets) => {
    persistCoins(sessionCoins);
    persistTickets(sessionTickets);
    setSessionEndTrigger({
      coins: sessionCoins,
      tickets: sessionTickets,
      time: Date.now(),
    });
  };

  if (!userName || page === "name") {
    return <NameEntry onNameSubmit={handleNameSubmit} />;
  } else if (page === "shop") {
    // Note: Shop will need a way to display the high score if the user wants it.
    // We will pass the sessionEndTrigger so it can optionally pass it to a hidden HighScore component.
    return (
      <Shop
        coins={coins}
        tickets={tickets}
        gems={gems}
        setCoins={persistCoins}
        setTickets={persistTickets}
        persistGems={persistGems}
        gemHistory={gemHistory}
        showGemHistory={showGemHistory}
        toggleGemHistoryModal={toggleGemHistoryModal}
        sessionEndTrigger={sessionEndTrigger} // Pass this down
        setPage={setPage}
      />
    );
  } else {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: -30,
            right: 20,
            display: "flex",
            gap: 8,
            zIndex: 10,
          }}
        >
          <a href="#" onClick={() => setPage("shop")}>
            Shop
          </a>
          <span>🪙 {coins}</span>
          <span>🎟️ {tickets}</span>
          <span
            onClick={toggleGemHistoryModal}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            💎 {gems}
          </span>
        </div>

        <div style={{ top: -40, position: "relative" }}>
          <HighScore sessionEndTrigger={sessionEndTrigger} />
        </div>

        <MathTimer
          setPage={setPage}
          userName={userName}
          onSessionEnd={handleSessionEnd}
        />

        {showGemHistory && (
          <GemHistoryModal
            history={gemHistory}
            onClose={toggleGemHistoryModal}
          />
        )}

        {/* HighScoreModal is now handled internally by HighScore.js */}
      </div>
    );
  }
}
