import React from "react";
import Header from "../Header";
import MathTimer from "../MathTimer";
import GemHistoryModal from "../GemHistoryModal";

export default function GamePage({
  page,
  setPage,
  coins,
  tickets,
  gems,
  gemHistory,
  showGemHistory,
  toggleGemHistoryModal,
  persistCoins,
  persistTickets,
  userName,
  sessionEndTrigger,
  onSessionEnd,
}) {
  const handleSessionEnd = (sessionCoins, sessionTickets) => {
    persistCoins(sessionCoins);
    persistTickets(sessionTickets);
    onSessionEnd(sessionCoins, sessionTickets);
  };

  return (
    <div className="">
      <Header
        page={page}
        setPage={setPage}
        coins={coins}
        tickets={tickets}
        gems={gems}
        toggleGemHistoryModal={toggleGemHistoryModal}
        sessionEndTrigger={sessionEndTrigger}
      />

      <div style={{ paddingTop: 40 }}>
        <MathTimer
          setPage={setPage}
          userName={userName}
          onSessionEnd={handleSessionEnd}
        />
      </div>

      {showGemHistory && (
        <GemHistoryModal history={gemHistory} onClose={toggleGemHistoryModal} />
      )}
    </div>
  );
}
