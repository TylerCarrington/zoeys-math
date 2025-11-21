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

  // --- New States for Persistent High Scores ---

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

  // --- END New States ---

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage("game");
  };

  const persistCoins = (sessionCoins) => {
    const totalCoins =
      parseInt(localStorage.getItem("coins") || "0") + sessionCoins;

    const now = Date.now();

    // --- All-Time High Score Check ---
    if (sessionCoins > highCoinsAllTime) {
      setHighCoinsAllTime(sessionCoins);
      localStorage.setItem("highCoinsAllTime", sessionCoins);
    }

    // --- Daily High Score Check (resets at midnight) ---
    const lastDay = new Date(lastDayReset);
    const today = new Date();
    let currentDayHigh = highCoinsDay;

    // Check if it's a new day
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

    // --- Weekly High Score Check (resets after 7 full days) ---
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    let currentWeekHigh = highCoinsWeek;

    // Check if a week has passed since the last reset
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

    // --- All-Time High Score Check ---
    if (sessionTickets > highTicketsAllTime) {
      setHighTicketsAllTime(sessionTickets);
      localStorage.setItem("highTicketsAllTime", sessionTickets);
    }

    // --- Daily High Score Check (resets at midnight) ---
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
      // lastDayReset is already updated by persistCoins if it ran first
    }

    // Check if sessionTickets beats the current (or reset) day high
    if (sessionTickets > currentDayHigh) {
      setHighTicketsDay(sessionTickets);
      localStorage.setItem("highTicketsDay", sessionTickets);
    }

    // --- Weekly High Score Check (resets after 7 full days) ---
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    let currentWeekHigh = highTicketsWeek;

    // Check if a week has passed since the last reset
    if (now - lastWeekReset > oneWeek) {
      // New week, reset the high score
      currentWeekHigh = 0;
      // lastWeekReset is already updated by persistCoins if it ran first
    }

    // Check if sessionTickets beats the current (or reset) week high
    if (sessionTickets > currentWeekHigh) {
      setHighTicketsWeek(sessionTickets);
      localStorage.setItem("highTicketsWeek", sessionTickets);
    }

    // Persist total tickets
    localStorage.setItem("tickets", totalTickets);
    setTickets((prev) => prev + sessionTickets);
  };

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
        setCoins={persistCoins}
        setTickets={persistTickets}
        setPage={setPage}
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
        </div>
        <div
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
          {/* Updated High Score Display */}
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
