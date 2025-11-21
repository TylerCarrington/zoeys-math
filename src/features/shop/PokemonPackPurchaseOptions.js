import React from 'react';

function PokemonPackPurchaseOptions({
  coins,
  tickets,
  handlePurchase,
  pokemonImages,
  currentOwnedCount,
  threshold,
  onTradeInCollection,
  isReadyForTradeIn,
}) {
  return (
    <div className="pokemon-pack-purchase-options">
      <p>Cost: 50 🪙</p>
      <button
        onClick={() => handlePurchase("Pokemon Stellar Coin", 50, 0)}
        className="submit-button"
        disabled={coins < 50}
        style={coins < 50 ? { backgroundColor: "lightgray", cursor: "not-allowed" } : {}}
      >
        Buy Pokemon Pack (Coin)
      </button>

      <p>Cost: 50 🎟️</p>
      <button
        onClick={() => handlePurchase("Pokemon Stellar Ticket", 0, 50)}
        className="submit-button"
        disabled={tickets < 50}
        style={tickets < 50 ? { backgroundColor: "lightgray", cursor: "not-allowed" } : {}}
      >
        Buy Pokemon Pack (Ticket)
      </button>

      <button
        onClick={onTradeInCollection}
        className="submit-button"
        style={{
          backgroundColor: isReadyForTradeIn ? "#20b2aa" : "#808080",
          marginTop: "10px",
        }}
        disabled={!isReadyForTradeIn}
      >
        {isReadyForTradeIn
          ? `Exchange ${currentOwnedCount} items for 💎 Gem`
          : `Progress: ${currentOwnedCount}/${threshold}`}
      </button>
    </div>
  );
}

export default PokemonPackPurchaseOptions;