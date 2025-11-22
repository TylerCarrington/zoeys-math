import React, { useState, useEffect, useMemo } from "react";
import { animalsImages } from "../../data/animals";
import { baseballImages } from "../../data/baseball";
import { pokemonImages } from "../../data/pokemon";
import ShopItem from "./ShopItem";
import PokemonPackPurchaseOptions from "./PokemonPackPurchaseOptions";

const ANIMAL_THRESHOLD = 25;
const BASEBALL_THRESHOLD = 40;
const POKEMON_THRESHOLD = 20;

const Shop = ({
  coins,
  tickets,
  setCoins,
  setTickets,
  gems,
  persistGems,
  setPage,
  gemHistory,
  showGemHistory,
  toggleGemHistoryModal,
  sessionEndTrigger,
  lockCard,
  unlockCardLock,
  isCardLocked,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [receivedImage, setReceivedImage] = useState("");

  const sessionHighCoins = useMemo(
    () => parseInt(sessionStorage.getItem("highCoins")) || 0,
    [sessionEndTrigger]
  );
  const sessionHighTickets = useMemo(
    () => parseInt(sessionStorage.getItem("highTickets")) || 0,
    [sessionEndTrigger]
  );

  const [ownedItems, setOwnedItems] = useState(
    JSON.parse(localStorage.getItem("ownedItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  }, [ownedItems]);

  const getOwnedPackCount = (packImages) => {
    if (!packImages || packImages.length === 0) return 0;
    return packImages.filter((item) => ownedItems.includes(item)).length;
  };

  const meetsExchangeThreshold = (packImages, packThreshold) => {
    if (!packImages || packImages.length === 0) return false;
    const ownedPackItemsCount = getOwnedPackCount(packImages);
    const effectiveThreshold = Math.min(packThreshold, packImages.length);
    return ownedPackItemsCount >= effectiveThreshold;
  };

  const handleTradeInCollection = (packType, packImages, packThreshold) => {
    const gemReward = 1;

    if (!meetsExchangeThreshold(packImages, packThreshold)) {
      alert(
        `The ${packType} collection must have at least ${packThreshold} items to exchange for a Gem.`
      );
      return;
    }

    const itemsToExchangeCount = getOwnedPackCount(packImages);

    const confirmation = window.confirm(
      `Are you sure you want to trade in ALL ${itemsToExchangeCount} items from your ${packType} collection for ${gemReward} 💎 Gem? This will remove all of these items from your gallery (except locked items).`
    );

    if (confirmation) {
      persistGems(gemReward, packType);

      // Filter out all items that belong to the traded-in pack, but keep locked items
      const newOwnedItems = ownedItems.filter(
        (item) => !packImages.includes(item) || isCardLocked(item)
      );
      setOwnedItems(newOwnedItems);

      const lockedCount = ownedItems.filter(
        (item) => packImages.includes(item) && isCardLocked(item)
      ).length;

      alert(
        `Collection successfully traded in! You exchanged ${itemsToExchangeCount - lockedCount} items and received ${gemReward} 💎 Gem. Your ${packType} collection has been reset (${lockedCount} locked items remained).`
      );
    }
  };

  const handlePurchase = (type, coinsCost, ticketsCost) => {
    let availableImages = [];
    let imageList = [];
    let alertMessage = "";

    if (type === "Animal Pack") {
      imageList = animalsImages;
      alertMessage =
        "Animal Pack images! Consider exchanging 25+ items for a Gem.";
    } else if (type === "Baseball Pack") {
      imageList = baseballImages;
      alertMessage =
        "Baseball Pack images! Consider exchanging 30+ items for a Gem.";
    } else if (type.startsWith("Pokemon")) {
      imageList = pokemonImages;
      alertMessage =
        "Pokemon Stellar Crown images! Consider exchanging 20+ items for a Gem.";
    }

    availableImages = imageList.filter((img) => !ownedItems.includes(img));

    if (availableImages.length === 0) {
      alert("You already own all the " + alertMessage);
      return;
    }

    if (coins >= coinsCost && tickets >= ticketsCost) {
      const randomImage =
        availableImages[Math.floor(Math.random() * availableImages.length)];
      setCoins(-coinsCost);
      setTickets(-ticketsCost);
      setOwnedItems((prev) => [...prev, randomImage]);
      tiggerModal(randomImage);
    } else {
      alert(
        `Not enough ${coinsCost > 0 ? "coins" : ""}${
          coinsCost > 0 && ticketsCost > 0 ? " or " : ""
        }${ticketsCost > 0 ? "tickets" : ""} to purchase the pack.`
      );
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setReceivedImage("");
  };

  const tiggerModal = (img) => {
    setReceivedImage(img);
    setShowModal(true);
  };

  return (
    <div className="container">
      <h1>Shop</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        <ShopItem
          name="Animal Pack"
          imageSrc="./images/packs/animal-pack.png"
          costCoins={25}
          costTickets={25}
          onPurchase={handlePurchase}
          currentCoins={coins}
          currentTickets={tickets}
          currentOwnedCount={getOwnedPackCount(animalsImages)}
          threshold={ANIMAL_THRESHOLD}
          onTradeInCollection={() =>
            handleTradeInCollection("Animal Pack", animalsImages, ANIMAL_THRESHOLD)
          }
          isReadyForTradeIn={meetsExchangeThreshold(animalsImages, ANIMAL_THRESHOLD)}
        />

        <ShopItem
          name="Baseball Pack"
          imageSrc="./images/packs/baseball-pack.png"
          costCoins={25}
          costTickets={0}
          onPurchase={handlePurchase}
          currentCoins={coins}
          currentTickets={tickets}
          currentOwnedCount={getOwnedPackCount(baseballImages)}
          threshold={BASEBALL_THRESHOLD}
          onTradeInCollection={() =>
            handleTradeInCollection("Baseball Pack", baseballImages, BASEBALL_THRESHOLD)
          }
          isReadyForTradeIn={meetsExchangeThreshold(baseballImages, BASEBALL_THRESHOLD)}
        />

        <ShopItem
          name="Pokemon Stellar Crown"
          imageSrc="./images/packs/stellar-crown.jpg"
          // costCoins and costTickets are 0 because it's not a single direct purchase
          costCoins={0}
          costTickets={0}
          onPurchase={handlePurchase} // Still pass for consistency, though not directly used by ShopItem's default button
          currentCoins={coins}
          currentTickets={tickets}
          currentOwnedCount={getOwnedPackCount(pokemonImages)}
          threshold={POKEMON_THRESHOLD}
          onTradeInCollection={() =>
            handleTradeInCollection("Pokemon Pack", pokemonImages, POKEMON_THRESHOLD)
          }
          isReadyForTradeIn={meetsExchangeThreshold(pokemonImages, POKEMON_THRESHOLD)}
        >
          <PokemonPackPurchaseOptions
            coins={coins}
            tickets={tickets}
            handlePurchase={handlePurchase}
            pokemonImages={pokemonImages}
            currentOwnedCount={getOwnedPackCount(pokemonImages)}
            threshold={POKEMON_THRESHOLD}
            onTradeInCollection={() =>
              handleTradeInCollection("Pokemon Pack", pokemonImages, POKEMON_THRESHOLD)
            }
            isReadyForTradeIn={meetsExchangeThreshold(pokemonImages, POKEMON_THRESHOLD)}
          />
        </ShopItem>
      </div>
      <div style={{ marginTop: 20 }}>
        <h2>Your Gallery</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {ownedItems.length > 0 ? (
            ownedItems.map((item, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                }}
              >
                <img
                  src={item}
                  alt="Owned Item"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  onClick={() => tiggerModal(item)}
                />
                {isCardLocked(item) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      fontSize: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    🔒
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>You don't own any items yet.</p>
          )}
        </div>
      </div>

      {showModal && receivedImage && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignContent: "center",
            }}
          >
            <h2>Congratulations!</h2>
            <img
              src={receivedImage}
              alt="Received Item"
              style={{ width: "450px", height: "450px", objectFit: "contain" }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              {isCardLocked(receivedImage) ? (
                <button
                  onClick={() => {
                    unlockCardLock(receivedImage);
                    closeModal();
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#FF9800",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  🔓 Unlock Card (Refund 1 💎)
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (lockCard(receivedImage)) {
                      closeModal();
                    }
                  }}
                  disabled={gems <= 0}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: gems > 0 ? "#2196F3" : "#CCCCCC",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: gems > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  🔒 Lock Card (1 💎)
                </button>
              )}
              <button
                onClick={closeModal}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;