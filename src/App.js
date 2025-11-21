import { useState } from "react";
import MathTimer from "./MathTimer";
import NameEntry from "./NameEntry";
import Shop from "./Shop";
import HighScore from "./HighScore"; // NEW IMPORT

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
  // NEW: State for Gems
  const [gems, setGems] = useState(parseInt(localStorage.getItem("gems")) || 0);
  // NEW: State to trigger HighScore update after game session
  const [sessionEndTrigger, setSessionEndTrigger] = useState(null);

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage("game");
  };

  // Persist total accumulated coins (high score logic removed)
  const persistCoins = (sessionCoins) => {
    const totalCoins =
      parseInt(localStorage.getItem("coins") || "0") + sessionCoins;
    localStorage.setItem("coins", totalCoins);
    setCoins(totalCoins);
  };

  // Persist total accumulated tickets (high score logic removed)
  const persistTickets = (sessionTickets) => {
    const totalTickets =
      parseInt(localStorage.getItem("tickets") || "0") + sessionTickets;
    localStorage.setItem("tickets", totalTickets);
    setTickets(totalTickets);
  };

  // Persist Gems (needed for Shop component)
  const persistGems = (amount) => {
    const totalGems = parseInt(localStorage.getItem("gems") || "0") + amount;
    localStorage.setItem("gems", totalGems);
    setGems(totalGems);
  };

  const handleSessionEnd = (sessionCoins, sessionTickets) => {
    // 1. Update total currency
    persistCoins(sessionCoins);
    persistTickets(sessionTickets);

    // 2. Trigger high score update in HighScore.js
    // We update the state object to trigger the useEffect in HighScore.js
    setSessionEndTrigger({
      coins: sessionCoins,
      tickets: sessionTickets,
      time: Date.now(),
    });
  };

  if (!userName || page === "name") {
    return <NameEntry onNameSubmit={handleNameSubmit} />;
  } else if (page === "shop") {
    return (
      <Shop
        coins={coins}
        tickets={tickets}
        gems={gems} // Pass new gem state
        persistGems={persistGems} // Pass new gem persistence function
        setCoins={persistCoins}
        setTickets={persistTickets}
        setPage={setPage}
      />
    );
  } else {
    return (
      <div style={{ position: "relative" }}>
        {/* NEW: Use HighScore component */}
        <HighScore sessionEndTrigger={sessionEndTrigger} />

        {/* Top Right Corner Display (updated to include Gems) */}
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
          <span>💎 {gems}</span>
        </div>

        <MathTimer
          setPage={setPage}
          userName={userName}
          onSessionEnd={handleSessionEnd}
        />
      </div>
    );
  }
}
