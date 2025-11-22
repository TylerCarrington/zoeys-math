import React from "react";
import Header from "../../components/Header";
import Shop from "./Shop";
import GemHistoryModal from "../../components/GemHistoryModal";

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
  onCodeRedeem,
  lockCard,
  unlockCardLock,
  isCardLocked,
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
          onCodeRedeem={onCodeRedeem}
          lockCard={lockCard}
          unlockCardLock={unlockCardLock}
          isCardLocked={isCardLocked}
        />
      </div>

      {showGemHistory && (
        <GemHistoryModal
          history={gemHistory}
          onClose={toggleGemHistoryModal}
          onCodeRedeem={onCodeRedeem}
        />
      )}
    </div>
  );
}
