import React, { useState, useEffect, useMemo } from "react";
import { animalsImages } from "../../data/animals";
import { baseballImages } from "../../data/baseball";
import { pokemonImages } from "../../data/pokemon";
import { wallpaperColors, getRandomWallpaperColor } from "../../data/wallpaperColors";
import ShopItem from "./ShopItem";
import PokemonPackPurchaseOptions from "./PokemonPackPurchaseOptions";

const ANIMAL_THRESHOLD = 25;
const BASEBALL_THRESHOLD = 40;
const POKEMON_THRESHOLD = 20;

const Shop = ({
  coins,
  tickets,
  moneyBags,
  setCoins,
  setTickets,
  setMoneyBags,
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
  ownedWallpaperColors,
  activeWallpaperColor,
  addWallpaperColor,
  setWallpaperColor,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [receivedImage, setReceivedImage] = useState("");
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [newWallpaperColor, setNewWallpaperColor] = useState("");

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

  const handlePurchaseWallpaperColor = () => {
    if (moneyBags >= 50) { // Changed from coins to moneyBags
      const randomColor = getRandomWallpaperColor();
      setMoneyBags(-50); // Changed from setCoins to setMoneyBags
      addWallpaperColor(randomColor);
      setNewWallpaperColor(randomColor);
      setShowWallpaperModal(true);
    } else {
      alert("Not enough money bags (50 required) to purchase a wallpaper color."); // Updated alert message
    }
  };

  const closeWallpaperModal = () => {
    setShowWallpaperModal(false);
    setNewWallpaperColor("");
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

        {/* Wallpaper Color Item */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
            minWidth: "150px",
          }}
        >
          <h3>Wallpaper Color</h3>
          <div
            style={{
              width: "100px",
              height: "100px",
              backgroundColor: "#E8E8E8",
              border: "2px solid #999",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🎨
          </div>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            Cost: 💰 50
          </p>
          <button
            onClick={handlePurchaseWallpaperColor}
            disabled={moneyBags < 50} // Changed from coins to moneyBags
            style={
              moneyBags < 50
                ? { backgroundColor: "lightgray", cursor: "not-allowed" }
                : {
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }
            }
          >
            {moneyBags < 50 ? "Can't Afford" : "Purchase"}
          </button>
        </div>
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

      {showWallpaperModal && newWallpaperColor && (
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
            <h2>New Wallpaper Color!</h2>
            <div
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: newWallpaperColor,
                borderRadius: "8px",
                border: "2px solid #ccc",
                margin: "0 auto",
              }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setWallpaperColor(newWallpaperColor);
                  closeWallpaperModal();
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Apply Color
              </button>
              <button
                onClick={closeWallpaperModal}
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

      <div style={{ marginTop: 40 }}>
        <h2>Wallpaper Colors</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {ownedWallpaperColors.length > 0 ? (
            ownedWallpaperColors.map((color, index) => (
              <div
                key={index}
                style={{
                  width: "80px",
                  height: "80px",
                  backgroundColor: color,
                  border: activeWallpaperColor === color ? "4px solid #FFD700" : "2px solid #ccc",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow:
                    activeWallpaperColor === color
                      ? "0 0 10px rgba(255, 215, 0, 0.5)"
                      : "0 2px 5px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setWallpaperColor(color)}
                title={`Click to apply ${color}`}
              >
                {activeWallpaperColor === color && (
                  <span style={{ fontSize: "30px" }}>✓</span>
                )}
              </div>
            ))
          ) : (
            <p>You don't own any wallpaper colors yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;