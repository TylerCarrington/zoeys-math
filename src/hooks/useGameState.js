import { useState } from "react";

export function useGameState() {
  const [coins, setCoins] = useState(
    parseInt(localStorage.getItem("coins")) || 0
  );
  const [tickets, setTickets] = useState(
    parseInt(localStorage.getItem("tickets")) || 0
  );
  const [moneyBags, setMoneyBags] = useState(
    parseInt(localStorage.getItem("moneyBags")) || 0
  );
  const [gems, setGems] = useState(parseInt(localStorage.getItem("gems")) || 0);
  const [gemHistory, setGemHistory] = useState(
    JSON.parse(localStorage.getItem("gemHistory")) || []
  );
  const [showGemHistory, setShowGemHistory] = useState(false);
  const [ownedItems, setOwnedItems] = useState(
    JSON.parse(localStorage.getItem("ownedItems")) || []
  );
  const [lockedItems, setLockedItems] = useState(
    JSON.parse(localStorage.getItem("lockedItems")) || {}
  );
  const [ownedWallpaperColors, setOwnedWallpaperColors] = useState(
    JSON.parse(localStorage.getItem("ownedWallpaperColors")) || []
  );
  const [activeWallpaperColor, setActiveWallpaperColor] = useState(
    localStorage.getItem("activeWallpaperColor") || null
  );

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

  const persistMoneyBags = (sessionMoneyBags) => {
    const totalMoneyBags =
      parseInt(localStorage.getItem("moneyBags") || "0") + sessionMoneyBags;
    localStorage.setItem("moneyBags", totalMoneyBags);
    setMoneyBags((prev) => prev + sessionMoneyBags);
  };

  const toggleGemHistoryModal = () => {
    setShowGemHistory((prev) => !prev);
  };

  const unlockCard = (cardPath) => {
    setOwnedItems((prevItems) => {
      // Check if card is already owned
      if (prevItems.includes(cardPath)) {
        return prevItems;
      }
      const newItems = [...prevItems, cardPath];
      localStorage.setItem("ownedItems", JSON.stringify(newItems));
      return newItems;
    });
  };

  const lockCard = (cardPath) => {
    if (gems <= 0) return false;

    setLockedItems((prevLocked) => {
      const newLocked = { ...prevLocked };
      newLocked[cardPath] = {
        lockedAt: Date.now(),
        gemSpent: 1,
      };
      localStorage.setItem("lockedItems", JSON.stringify(newLocked));
      return newLocked;
    });

    // Deduct gem
    persistGems(-1, `Card Lock: ${cardPath}`);
    return true;
  };

  const unlockCardLock = (cardPath) => {
    setLockedItems((prevLocked) => {
      const newLocked = { ...prevLocked };
      delete newLocked[cardPath];
      localStorage.setItem("lockedItems", JSON.stringify(newLocked));
      return newLocked;
    });

    // Refund gem
    persistGems(1, `Card Unlock: ${cardPath}`);
  };

  const isCardLocked = (cardPath) => {
    return lockedItems.hasOwnProperty(cardPath);
  };

  const addWallpaperColor = (color) => {
    setOwnedWallpaperColors((prevColors) => {
      if (prevColors.includes(color)) {
        return prevColors;
      }
      const newColors = [...prevColors, color];
      localStorage.setItem("ownedWallpaperColors", JSON.stringify(newColors));
      return newColors;
    });
  };

  const setWallpaperColor = (color) => {
    localStorage.setItem("activeWallpaperColor", color);
    setActiveWallpaperColor(color);
  };

  return {
    coins,
    tickets,
    moneyBags,
    gems,
    gemHistory,
    showGemHistory,
    ownedItems,
    lockedItems,
    ownedWallpaperColors,
    activeWallpaperColor,
    persistGems,
    persistCoins,
    persistTickets,
    persistMoneyBags,
    toggleGemHistoryModal,
    unlockCard,
    lockCard,
    unlockCardLock,
    isCardLocked,
    addWallpaperColor,
    setWallpaperColor,
  };
}
