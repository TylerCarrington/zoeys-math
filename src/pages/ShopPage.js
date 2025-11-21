import React from "react";
import Header from "../Header";
import Shop from "../Shop";
import GemHistoryModal from "../GemHistoryModal";

export default function ShopPage({
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
  persistGems,
  sessionEndTrigger,
}) {
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
        <Shop
          coins={coins}
          tickets={tickets}
          gems={gems}
          setCoins={persistCoins}
          setTickets={persistTickets}
          persistGems={persistGems}
          gemHistory={gemHistory}
          showGemHistory={showGemHistory}
          toggleGemHistoryModal={toggleGemHistoryModal}
          sessionEndTrigger={sessionEndTrigger}
          setPage={setPage}
        />
      </div>

      {showGemHistory && (
        <GemHistoryModal history={gemHistory} onClose={toggleGemHistoryModal} />
      )}
    </div>
  );
}
