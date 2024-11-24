import { useState } from "react";
import MathTimer from "./MathTimer";
import NameEntry from "./NameEntry";

function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  const [edittingName, setEdittingName] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 0
  );
  const [tickets, setTickets] = useState(
    parseInt(localStorage.getItem("tickets")) || 0
  );

  const handleNameSubmit = (name) => {
    setUserName(name);
    setEdittingName(false);
  };

  const handleSessionEnd = (sessionCoins, sessionTickets) => {
    const totalCoins =
      parseInt(localStorage.getItem("coins") || "0") + sessionCoins;
    const totalTickets =
      parseInt(localStorage.getItem("tickets") || "0") + sessionTickets;

    localStorage.setItem("coins", totalCoins);
    localStorage.setItem("tickets", totalTickets);
    setCoins((prev) => prev + sessionCoins); // Add session coins to total
    setTickets((prev) => prev + sessionTickets); // Add session tickets to total
  };

  if (!userName || edittingName) {
    return <NameEntry onNameSubmit={handleNameSubmit} />;
  } else {
    return (
      <div>
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 20,
            display: "flex",
            gap: 8,
          }}
        >
          <span>🪙:{coins}</span>
          <span>🎟️: {tickets}</span>
        </div>
        <MathTimer
          setEdittingName={setEdittingName}
          userName={userName}
          onSessionEnd={handleSessionEnd}
        />
      </div>
    );
  }
}
