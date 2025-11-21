import { useState } from "react";

export function useGameState() {
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 0
  );
  const [tickets, setTickets] = useState(
    parseInt(localStorage.getItem("tickets")) || 0
  );
  const [gems, setGems] = useState(parseInt(localStorage.getItem("gems")) || 0);
  const [gemHistory, setGemHistory] = useState(
    JSON.parse(localStorage.getItem("gemHistory")) || []
  );
  const [showGemHistory, setShowGemHistory] = useState(false);

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

  const toggleGemHistoryModal = () => {
    setShowGemHistory((prev) => !prev);
  };

  return {
    coins,
    tickets,
    gems,
    gemHistory,
    showGemHistory,
    persistGems,
    persistCoins,
    persistTickets,
    toggleGemHistoryModal,
  };
}
