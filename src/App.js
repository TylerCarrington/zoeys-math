import { useState } from "react";
import MathTimer from "./MathTimer";
import NameEntry from "./NameEntry";
import Shop from "./Shop";

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
  // State for Gems
  const [gems, setGems] = useState(parseInt(localStorage.getItem("gems")) || 0);
  // State for Gem History
  const [gemHistory, setGemHistory] = useState(
    JSON.parse(localStorage.getItem("gemHistory")) || []
  );
  // State to control the visibility of the Gem history modal
  const [showGemHistory, setShowGemHistory] = useState(false);

  // --- RE-ADDED: States for Persistent High Scores (Day, Week, All-Time) ---

  // All Time
  const [highCoinsAllTime, setHighCoinsAllTime] = useState(
    parseInt(localStorage.getItem("highCoinsAllTime")) || 0
  );
  const [highTicketsAllTime, setHighTicketsAllTime] = useState(
    parseInt(localStorage.getItem("highTicketsAllTime")) || 0
  );

  // Daily
  const [highCoinsDay, setHighCoinsDay] = useState(
    parseInt(localStorage.getItem("highCoinsDay")) || 0
  );
  const [highTicketsDay, setHighTicketsDay] = useState(
    parseInt(localStorage.getItem("highTicketsDay")) || 0
  );
  const [lastDayReset, setLastDayReset] = useState(
    parseInt(localStorage.getItem("lastDayReset")) || Date.now()
  );

  // Weekly
  const [highCoinsWeek, setHighCoinsWeek] = useState(
    parseInt(localStorage.getItem("highCoinsWeek")) || 0
  );
  const [highTicketsWeek, setHighTicketsWeek] = useState(
    parseInt(localStorage.getItem("highTicketsWeek")) || 0
  );
  const [lastWeekReset, setLastWeekReset] = useState(
    parseInt(localStorage.getItem("lastWeekReset")) || Date.now()
  );

  // --- END RE-ADDED States ---

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage("game");
  };

  const persistCoins = (sessionCoins) => {
    const totalCoins =
      parseInt(localStorage.getItem("coins") || "0") + sessionCoins;

    const now = Date.now();

    // All-Time High Score Check
    if (sessionCoins > highCoinsAllTime) {
      setHighCoinsAllTime(sessionCoins);
      localStorage.setItem("highCoinsAllTime", sessionCoins);
    }

    // Daily High Score Check (resets at midnight)
    const lastDay = new Date(lastDayReset);
    const today = new Date();
    let currentDayHigh = highCoinsDay;

    // Check if it's a new day (year, month, or date change)
    if (
      today.getFullYear() > lastDay.getFullYear() ||
      today.getMonth() > lastDay.getMonth() ||
      today.getDate() > lastDay.getDate()
    ) {
      // New day, reset the high score
      currentDayHigh = 0;
      localStorage.setItem("lastDayReset", now);
      setLastDayReset(now);
    }

    // Check if sessionCoins beats the current (or reset) day high
    if (sessionCoins > currentDayHigh) {
      setHighCoinsDay(sessionCoins);
      localStorage.setItem("highCoinsDay", sessionCoins);
    }

    // Weekly High Score Check (resets after 7 full days)
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    let currentWeekHigh = highCoinsWeek;

    // Check if a week (7 days) has passed since the last reset
    if (now - lastWeekReset > oneWeek) {
      // New week, reset the high score
      currentWeekHigh = 0;
      localStorage.setItem("lastWeekReset", now);
      setLastWeekReset(now);
    }

    // Check if sessionCoins beats the current (or reset) week high
    if (sessionCoins > currentWeekHigh) {
      setHighCoinsWeek(sessionCoins);
      localStorage.setItem("highCoinsWeek", sessionCoins);
    }

    // Persist total coins
    localStorage.setItem("coins", totalCoins);
    setCoins((prev) => prev + sessionCoins);
  };

  const persistTickets = (sessionTickets) => {
    const totalTickets =
      parseInt(localStorage.getItem("tickets") || "0") + sessionTickets;

    const now = Date.now();

    // All-Time High Score Check
    if (sessionTickets > highTicketsAllTime) {
      setHighTicketsAllTime(sessionTickets);
      localStorage.setItem("highTicketsAllTime", sessionTickets);
    }

    // Daily High Score Check (resets at midnight)
    const lastDay = new Date(lastDayReset);
    const today = new Date();
    let currentDayHigh = highTicketsDay;

    // Check if it's a new day
    if (
      today.getFullYear() > lastDay.getFullYear() ||
      today.getMonth() > lastDay.getMonth() ||
      today.getDate() > lastDay.getDate()
    ) {
      // New day, reset the high score
      currentDayHigh = 0;
    }

    // Check if sessionTickets beats the current (or reset) day high
    if (sessionTickets > currentDayHigh) {
      setHighTicketsDay(sessionTickets);
      localStorage.setItem("highTicketsDay", sessionTickets);
    }

    // Weekly High Score Check (resets after 7 full days)
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    let currentWeekHigh = highTicketsWeek;

    if (now - lastWeekReset > oneWeek) {
      currentWeekHigh = 0;
    }

    if (sessionTickets > currentWeekHigh) {
      setHighTicketsWeek(sessionTickets);
      localStorage.setItem("highTicketsWeek", sessionTickets);
    }

    // Persist total tickets
    localStorage.setItem("tickets", totalTickets);
    setTickets((prev) => prev + sessionTickets);
  };

  // UPDATED: persistGems now logs history
  const persistGems = (sessionGems, collectionType) => {
    // 1. Update total Gems count
    const totalGems =
      parseInt(localStorage.getItem("gems") || "0") + sessionGems;
    localStorage.setItem("gems", totalGems);
    setGems((prev) => prev + sessionGems);

    // 2. Log history only if a new gem was earned
    if (sessionGems > 0) {
      const newRecord = {
        date: Date.now(),
        collection: collectionType,
      };

      // Get existing history from local storage and append the new record
      const currentHistory =
        JSON.parse(localStorage.getItem("gemHistory")) || [];
      const newHistory = [...currentHistory, newRecord];

      localStorage.setItem("gemHistory", JSON.stringify(newHistory));
      setGemHistory(newHistory);
    }
  };

  const toggleGemHistoryModal = () => setShowGemHistory((prev) => !prev);

  const handleSessionEnd = (sessionCoins, sessionTickets) => {
    persistCoins(sessionCoins);
    persistTickets(sessionTickets);
  };

  if (!userName || page === "name") {
    return <NameEntry onNameSubmit={handleNameSubmit} />;
  } else if (page === "shop") {
    return (
      <Shop
        coins={coins}
        tickets={tickets}
        gems={gems}
        persistGems={persistGems}
        setCoins={persistCoins}
        setTickets={persistTickets}
        setPage={setPage}
        // NEW PROPS FOR GEM HISTORY
        gemHistory={gemHistory}
        showGemHistory={showGemHistory}
        toggleGemHistoryModal={toggleGemHistoryModal}
      />
    );
  } else {
    return (
      <div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 20,
            display: "flex",
            gap: 8,
          }}
        >
          <a href="#" onClick={() => setPage("shop")}>
            Shop
          </a>
          <span>🪙 {coins}</span>
          <span>🎟️ {tickets}</span>
          <span>💎 {gems}</span>
        </div>
        {/* ADDED CLASS FOR CSS FIX */}
        <div
          className="high-score-container"
          style={{
            position: "absolute",
            top: 10,
            left: 20,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            textAlign: "left",
          }}
        >
          <div>
            <span>High Score (All Time): </span>
            <span>🪙 {highCoinsAllTime}</span>
            <span>🎟️ {highTicketsAllTime}</span>
          </div>
          <div>
            <span>High Score (Weekly): </span>
            <span>🪙 {highCoinsWeek}</span>
            <span>🎟️ {highTicketsWeek}</span>
          </div>
          <div>
            <span>High Score (Daily): </span>
            <span>🪙 {highCoinsDay}</span>
            <span>🎟️ {highTicketsDay}</span>
          </div>
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
