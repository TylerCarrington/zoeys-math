import { useState } from "react";
import NameEntry from "./components/NameEntry";
import GamePage from "./features/game/GamePage";
import ShopPage from "./features/shop/ShopPage";
import { useGameState } from "./hooks/useGameState";

export default function App() {
  const [page, setPage] = useState("game");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [sessionEndTrigger, setSessionEndTrigger] = useState(null);

  const gameState = useGameState();

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage("game");
  };

  const handleSessionEnd = (sessionCoins, sessionTickets) => {
    gameState.persistCoins(sessionCoins);
    gameState.persistTickets(sessionTickets);
    setSessionEndTrigger({
      coins: sessionCoins,
      tickets: sessionTickets,
      time: Date.now(),
    });
  };

  const handleCodeRedeem = (code, type, amount, message) => {
    if (type === "coins") {
      gameState.persistCoins(amount);
    } else if (type === "tickets") {
      gameState.persistTickets(amount);
    } else if (type === "gems") {
      gameState.persistGems(amount, `Coupon: ${code}`);
    }
    // Optionally, you could show a global notification here based on the message
    console.log(`Coupon ${code} redeemed: ${message}`);
  };

  if (!userName || page === "name") {
    return <NameEntry onNameSubmit={handleNameSubmit} />;
  } else if (page === "shop") {
    return (
      <ShopPage
        page={page}
        setPage={setPage}
        coins={gameState.coins}
        tickets={gameState.tickets}
        gems={gameState.gems}
        gemHistory={gameState.gemHistory}
        showGemHistory={gameState.showGemHistory}
        toggleGemHistoryModal={gameState.toggleGemHistoryModal}
        persistCoins={gameState.persistCoins}
        persistTickets={gameState.persistTickets}
        persistGems={gameState.persistGems}
        sessionEndTrigger={sessionEndTrigger}
        onCodeRedeem={handleCodeRedeem}
      />
    );
  } else {
    return (
      <GamePage
        page={page}
        setPage={setPage}
        coins={gameState.coins}
        tickets={gameState.tickets}
        gems={gameState.gems}
        gemHistory={gameState.gemHistory}
        showGemHistory={gameState.showGemHistory}
        toggleGemHistoryModal={gameState.toggleGemHistoryModal}
        persistCoins={gameState.persistCoins}
        persistTickets={gameState.persistTickets}
        userName={userName}
        sessionEndTrigger={sessionEndTrigger}
        onSessionEnd={handleSessionEnd}
        onCodeRedeem={handleCodeRedeem}
      />
    );
  }
}
