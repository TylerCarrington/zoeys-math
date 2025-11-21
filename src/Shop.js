import React, { useState, useEffect, useMemo } from "react";
// 1. IMPORT THE GENERATED IMAGE LISTS
import { animalsImages } from "./image-lists/animals";
import { baseballImages } from "./image-lists/baseball";
import { pokemonImages } from "./image-lists/pokemon";
// 2. IMPORT THE NEW STANDALONE MODAL
import GemHistoryModal from "./GemHistoryModal";
import HighScore from "./HighScore";

// Define Threshold Constants
const ANIMAL_THRESHOLD = 25;
const BASEBALL_THRESHOLD = 30;
const POKEMON_THRESHOLD = 20;

// Since HighScore.js manages its own modal, Shop doesn't need to trigger it.
// We will remove toggleHighScoreModal from props.
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
  sessionEndTrigger, // Keeping this if needed later
}) => {
  const [showModal, setShowModal] = useState(false);
  const [receivedImage, setReceivedImage] = useState("");

  // --- Session Storage Read-Only High Scores for Shop Display ---
  // Using a memoized calculation to read session storage for display purposes.
  // These scores reflect the highest single session this time the app was opened.
  const sessionHighCoins = useMemo(
    () => parseInt(sessionStorage.getItem("highCoins")) || 0,
    [sessionEndTrigger]
  );
  const sessionHighTickets = useMemo(
    () => parseInt(sessionStorage.getItem("highTickets")) || 0,
    [sessionEndTrigger]
  );

  // Owned items (fetched from local storage)
  const [ownedItems, setOwnedItems] = useState(
    JSON.parse(localStorage.getItem("ownedItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  }, [ownedItems]);

  // Helper function to get the current count of owned items for a pack
  const getOwnedPackCount = (packImages) => {
    // Ensure the array exists before filtering
    if (!packImages || packImages.length === 0) return 0;
    return packImages.filter((item) => ownedItems.includes(item)).length;
  };

  // Helper function to check if the collection meets the exchange threshold
  const meetsExchangeThreshold = (packImages, packThreshold) => {
    // Ensure the array exists before calculating count
    if (!packImages || packImages.length === 0) return false;
    const ownedPackItemsCount = getOwnedPackCount(packImages);
    const effectiveThreshold = Math.min(packThreshold, packImages.length);
    return ownedPackItemsCount >= effectiveThreshold;
  };

  // Function to handle collection trade-in
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
      `Are you sure you want to trade in ALL ${itemsToExchangeCount} items from your ${packType} collection for ${gemReward} 💎 Gem? This will remove all of these items from your gallery.`
    );

    if (confirmation) {
      persistGems(gemReward, packType);

      // Filter out all items that belong to the traded-in pack (removes ALL)
      const newOwnedItems = ownedItems.filter(
        (item) => !packImages.includes(item)
      );
      setOwnedItems(newOwnedItems);

      alert(
        `Collection successfully traded in! You exchanged ${itemsToExchangeCount} items and received ${gemReward} 💎 Gem. Your ${packType} collection has been reset.`
      );
    }
  };

  const handlePurchase = (type) => {
    let availableImages = [];
    let imageList = [];
    let coinsCost = 0;
    let ticketsCost = 0;
    let alertMessage = "";

    if (type === "Animal Pack") {
      imageList = animalsImages;
      coinsCost = 25;
      ticketsCost = 25;
      alertMessage =
        "Animal Pack images! Consider exchanging 25+ items for a Gem.";
    } else if (type === "Baseball Pack") {
      imageList = baseballImages;
      coinsCost = 25;
      ticketsCost = 0;
      alertMessage =
        "Baseball Pack images! Consider exchanging 30+ items for a Gem.";
    } else if (
      type === "Pokemon Stellar Coin" ||
      type === "Pokemon Stellar Ticket"
    ) {
      imageList = pokemonImages;
      coinsCost = type === "Pokemon Stellar Coin" ? 50 : 0;
      ticketsCost = type === "Pokemon Stellar Ticket" ? 50 : 0;
      alertMessage =
        "Pokemon Stellar Crown images! Consider exchanging 20+ items for a Gem.";
    }

    availableImages = imageList.filter((img) => !ownedItems.includes(img));

    if (availableImages.length === 0) {
      // NOTE: Using custom modal/UI instead of alert for production environment
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
      // NOTE: Using custom modal/UI instead of alert for production environment
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
      {/* High Score Display (Left Side) - Now read from Session Storage for simplicity in the Shop view */}
      <HighScore sessionEndTrigger={sessionEndTrigger} />

      {/* Currency and Navigation Display (Right Side) */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          display: "flex",
          gap: 15,
        }}
      >
        <a href="#" onClick={() => setPage("game")}>
          Back to Game
        </a>
        <span>🪙:{coins}</span>
        <span>🎟️: {tickets}</span>
        {/* Make Gem display clickable to show history (Correct) */}
        <span
          onClick={toggleGemHistoryModal}
          style={{ cursor: "pointer", fontWeight: "bold" }}
        >
          💎: {gems}
        </span>
      </div>

      <h1>Shop</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
        {/* Animal Pack */}
        <div>
          <h2>Animal Pack</h2>
          <img
            src={"./images/packs/animal-pack.png"}
            alt="Owned Item"
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
          <p>Cost: 25 🎟️ and 25🪙</p>
          <button
            onClick={() => handlePurchase("Animal Pack")}
            className="submit-button"
            style={
              coins < 25 || tickets < 25
                ? { backgroundColor: "lightgray", cursor: "readonly" }
                : {}
            }
            disabled={coins < 25 || tickets < 25}
          >
            Buy Animal Pack
          </button>

          {/* Trade-In Button with Progress */}
          {(() => {
            const currentCount = getOwnedPackCount(animalsImages);
            const threshold = ANIMAL_THRESHOLD;
            const isReady = meetsExchangeThreshold(animalsImages, threshold);
            const buttonText = isReady
              ? `Exchange ${currentCount} items for 💎 Gem`
              : `Progress: ${currentCount}/${threshold}`;

            return (
              <button
                onClick={() =>
                  handleTradeInCollection(
                    "Animal Pack",
                    animalsImages,
                    threshold
                  )
                }
                className="submit-button"
                style={{
                  backgroundColor: isReady ? "#20b2aa" : "#808080",
                  marginTop: "10px",
                }}
                disabled={!isReady}
              >
                {buttonText}
              </button>
            );
          })()}
        </div>

        {/* Baseball Pack */}
        <div>
          <h2>Baseball Pack</h2>
          <img
            src={"./images/packs/baseball-pack.png"}
            alt="Owned Item"
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
          <p>Cost: 25 🪙</p>
          <button
            onClick={() => handlePurchase("Baseball Pack")}
            className="submit-button"
            style={
              coins < 25
                ? { backgroundColor: "lightgray", cursor: "readonly" }
                : {}
            }
            disabled={coins < 25}
          >
            Buy Baseball Pack
          </button>

          {/* Trade-In Button with Progress */}
          {(() => {
            const currentCount = getOwnedPackCount(baseballImages);
            const threshold = BASEBALL_THRESHOLD;
            const isReady = meetsExchangeThreshold(baseballImages, threshold);
            const buttonText = isReady
              ? `Exchange ${currentCount} items for 💎 Gem`
              : `Progress: ${currentCount}/${threshold}`;

            return (
              <button
                onClick={() =>
                  handleTradeInCollection(
                    "Baseball Pack",
                    baseballImages,
                    threshold
                  )
                }
                className="submit-button"
                style={{
                  backgroundColor: isReady ? "#20b2aa" : "#808080",
                  marginTop: "10px",
                }}
                disabled={!isReady}
              >
                {buttonText}
              </button>
            );
          })()}
        </div>

        {/* Pokemon Pack */}
        <div>
          <h2>Pokemon Stellar Crown</h2>
          <img
            src={"./images/packs/stellar-crown.jpg"}
            alt="Stellar Crown Item"
            style={{ width: "100px", height: "100px", objectFit: "contain" }}
          />
          <div>
            <div>
              <p>Cost: 50 🪙</p>
              <button
                onClick={() => handlePurchase("Pokemon Stellar Coin")}
                className="submit-button"
                style={
                  coins < 50
                    ? { backgroundColor: "lightgray", cursor: "readonly" }
                    : {}
                }
                disabled={coins < 50}
              >
                Buy Pokemon Pack (Coin)
              </button>
            </div>
            <div>
              <p>Cost: 50 🎟️</p>
              <button
                onClick={() => handlePurchase("Pokemon Stellar Ticket")}
                className="submit-button"
                style={
                  tickets < 50
                    ? { backgroundColor: "lightgray", cursor: "readonly" }
                    : {}
                }
                disabled={tickets < 50}
              >
                Buy Pokemon Pack (Ticket)
              </button>
            </div>
          </div>

          {/* Trade-In Button with Progress */}
          {(() => {
            const currentCount = getOwnedPackCount(pokemonImages);
            const threshold = POKEMON_THRESHOLD;
            const isReady = meetsExchangeThreshold(pokemonImages, threshold);
            const buttonText = isReady
              ? `Exchange ${currentCount} items for 💎 Gem`
              : `Progress: ${currentCount}/${threshold}`;

            return (
              <button
                onClick={() =>
                  handleTradeInCollection(
                    "Pokemon Pack",
                    pokemonImages,
                    threshold
                  )
                }
                className="submit-button"
                style={{
                  backgroundColor: isReady ? "#20b2aa" : "#808080",
                  marginTop: "10px",
                }}
                disabled={!isReady}
              >
                {buttonText}
              </button>
            );
          })()}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <h2>Your Gallery</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {ownedItems.length > 0 ? (
            ownedItems.map((item, index) => (
              <img
                key={index}
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
            ))
          ) : (
            <p>You don't own any items yet.</p>
          )}
        </div>
      </div>

      {/* Item Received Modal (omitted for brevity) */}
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
            <button
              onClick={closeModal}
              style={{
                marginTop: "20px",
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
      )}

      {/* Gem History Modal - Now imported and used */}
      {showGemHistory && (
        <GemHistoryModal history={gemHistory} onClose={toggleGemHistoryModal} />
      )}
    </div>
  );
};

export default Shop;
