import React from "react";
import HighScore from "./HighScore";

export default function Header({
  page,
  setPage,
  coins,
  tickets,
  moneyBags,
  gems,
  toggleGemHistoryModal,
  sessionEndTrigger,
}) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{position: "relative" }}>
        <HighScore sessionEndTrigger={sessionEndTrigger} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          display: "flex",
          gap: 8,
          zIndex: 10,
        }}
      >
        {page !== "shop" ? (
          <a href="#" onClick={(e) => { e.preventDefault(); setPage("shop"); }}>
            Shop
          </a>
        ) : (
          <a href="#" onClick={(e) => { e.preventDefault(); setPage("game"); }}>
            Back to Game
          </a>
        )}

        <span>🪙 {coins}</span>
        <span>🎟️ {tickets}</span>
        <span>💰 {moneyBags}</span>
        <span
          onClick={toggleGemHistoryModal}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          💎 {gems}
        </span>
      </div>
    </div>
  );
}
