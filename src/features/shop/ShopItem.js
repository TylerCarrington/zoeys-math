import React from 'react';

function ShopItem({
  name,
  imageSrc,
  costCoins,
  costTickets,
  onPurchase,
  currentCoins,
  currentTickets,
  currentOwnedCount,
  threshold,
  onTradeInCollection,
  isReadyForTradeIn,
  children, // Add children prop
}) {
  const canAfford = currentCoins >= costCoins && currentTickets >= costTickets;

  // Construct the cost display string
  const costElements = [];
  if (costCoins > 0) {
    costElements.push(`${costCoins} 🪙`);
  }
  if (costTickets > 0) {
    costElements.push(`${costTickets} 🎟️`);
  }

  const costDisplay = costElements.join(' and ');

  return (
    <div className="shop-item">
      <h2>{name}</h2>
      <img
        src={imageSrc}
        alt={name}
        className="shop-item-image"
      />
      {/* Conditionally render cost and purchase button if children are not present */}
      {!children && (
        <>
          {costDisplay && <p>Cost: {costDisplay}</p>}
          <button
            onClick={() => onPurchase(name, costCoins, costTickets)}
            className="submit-button"
            disabled={!canAfford}
            style={!canAfford ? { backgroundColor: "lightgray", cursor: "not-allowed" } : {}}
          >
            Buy {name}
          </button>
        </>
      )}

      {children} {/* Render children here */}

      {threshold && onTradeInCollection && !children && ( // Only show trade-in button if no children provided (i.e. for Animal and Baseball packs) to avoid duplication
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
      )}
    </div>
  );
}

export default ShopItem;