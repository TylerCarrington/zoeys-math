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
  const [highCoins, setHighCoins] = useState(
    parseInt(sessionStorage.getItem("highCoins")) || 0
  );
  const [highTickets, setHighTickets] = useState(
    parseInt(sessionStorage.getItem("highTickets")) || 0
  );

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage("game");
  };

  const persistCoins = (sessionCoins) => {
    const totalCoins =
      parseInt(localStorage.getItem("coins") || "0") + sessionCoins;

    if (sessionCoins > highCoins) {
      setHighCoins(sessionCoins);
      sessionStorage.setItem("highCoins");
    }

    localStorage.setItem("coins", totalCoins);
    setCoins((prev) => prev + sessionCoins);
  };

  const persistTickets = (sessionTickets) => {
    const totalTickets =
      parseInt(localStorage.getItem("tickets") || "0") + sessionTickets;

    if (sessionTickets > highTickets) {
      setHighTickets(sessionTickets);
      sessionStorage.setItem("highTickets");
    }
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
            gap: 8,
          }}
        >
          <span>High Score: </span>
          <span>🪙 {highCoins}</span>
          <span>🎟️ {highTickets}</span>
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
