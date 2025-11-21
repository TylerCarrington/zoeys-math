import React, { useState, useEffect } from "react";

// 1. Define Threshold Constants
const ANIMAL_THRESHOLD = 25;
const BASEBALL_THRESHOLD = 40;
const POKEMON_THRESHOLD = 20;

// UPDATED PROPS: Included props for Gem functionality and history
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
}) => {
  const [showModal, setShowModal] = useState(false);
  const [receivedImage, setReceivedImage] = useState("");

  // Helper function to format the timestamp for display
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Animal Pack and Baseball Pack Images
  const animalImages = [
    "./images/animals/animal1.webp",
    "./images/animals/animal2.webp",
    "./images/animals/animal3.webp",
    "./images/animals/animal4.webp",
    "./images/animals/animal5.webp",
    "./images/animals/animal6.webp",
    "./images/animals/animal7.webp",
    "./images/animals/animal8.webp",
    "./images/animals/animal9.webp",
    "./images/animals/animal10.png",
    "./images/animals/animal10.webp",
    "./images/animals/animal11.webp",
    "./images/animals/animal12.webp",
    "./images/animals/animal13.webp",
    "./images/animals/animal14.webp",
    "./images/animals/animal15.webp",
    "./images/animals/animal16.webp",
    "./images/animals/animal17.webp",
    "./images/animals/animal18.webp",
    "./images/animals/animal19.webp",
    "./images/animals/animal20.webp",
    "./images/animals/animal21.webp",
    "./images/animals/animal22.webp",
    "./images/animals/animal23.webp",
    "./images/animals/animal24.webp",
    "./images/animals/animal25.webp",
    "./images/animals/husky1.png",
    "./images/animals/husky2.png",
    "./images/animals/husky3.png",
    "./images/animals/zoey.png",
  ];
  const baseballImages = [
    "./images/baseball/baseball1.jpeg",
    "./images/baseball/baseball2.jpeg",
    "./images/baseball/baseball3.jpeg",
    "./images/baseball/baseball4.jpeg",
    "./images/baseball/baseball5.jpeg",
    "./images/baseball/baseball6.jpeg",
    "./images/baseball/baseball7.jpeg",
    "./images/baseball/baseball8.jpeg",
    "./images/baseball/baseball9.jpeg",
    "./images/baseball/baseball10.jpeg",
    "./images/baseball/baseball11.jpeg",
    "./images/baseball/baseball12.jpeg",
    "./images/baseball/baseball13.jpeg",
    "./images/baseball/baseball14.jpeg",
    "./images/baseball/baseball15.jpeg",
    "./images/baseball/baseball16.jpeg",
    "./images/baseball/baseball17.jpeg",
    "./images/baseball/baseball18.jpeg",
    "./images/baseball/baseball19.jpeg",
    "./images/baseball/baseball20.jpeg",
    "./images/baseball/baseball21.jpeg",
    "./images/baseball/baseball22.jpeg",
    "./images/baseball/baseball23.jpeg",
    "./images/baseball/baseball24.jpeg",
    "./images/baseball/baseball25.jpeg",
    "./images/baseball/baseball26.webp",
    "./images/baseball/baseball27.jpeg",
    "./images/baseball/baseball28.jpeg",
    "./images/baseball/baseball29.jpeg",
    "./images/baseball/baseball30.jpeg",
    "./images/baseball/baseball31.jpeg",
    "./images/baseball/baseball32.jpeg",
    "./images/baseball/baseball33.jpeg",
    "./images/baseball/baseball34.jpeg",
    "./images/baseball/baseball35.jpeg",
    "./images/baseball/baseball36.jpeg",
    "./images/baseball/baseball37.jpeg",
    "./images/baseball/baseball38.webp",
    "./images/baseball/baseball39.jpeg",
    "./images/baseball/baseball40.jpeg",
    "./images/baseball/baseball41.jpeg",
    "./images/baseball/baseball42.jpeg",
    "./images/baseball/baseball43.jpeg",
    "./images/baseball/baseball44.jpeg",
    "./images/baseball/baseball45.jpeg",
    "./images/baseball/baseball46.jpeg",
    "./images/baseball/baseball47.jpeg",
    "./images/baseball/baseball48.jpeg",
    "./images/baseball/baseball49.jpeg",
    "./images/baseball/baseball50.jpeg",
    "./images/baseball/baseball51.jpeg",
    "./images/baseball/baseball52.jpeg",
    "./images/baseball/owen1.png",
  ];

  const pokemonImages = [
    "./images/pokemon/pokemon01.png",
    "./images/pokemon/pokemon02.jpg",
    "./images/pokemon/pokemon03.jpg",
    "./images/pokemon/pokemon04.jpg",
    "./images/pokemon/pokemon05.jpg",
    "./images/pokemon/pokemon06.jpg",
    "./images/pokemon/pokemon07.jpg",
    "./images/pokemon/pokemon08.jpg",
    "./images/pokemon/pokemon09.jpg",
    "./images/pokemon/pokemon10.jpg",
    "./images/pokemon/pokemon11.jpg",
    "./images/pokemon/pokemon12.jpg",
    "./images/pokemon/pokemon13.jpg",
    "./images/pokemon/pokemon14.jpg",
    "./images/pokemon/pokemon15.jpg",
    "./images/pokemon/pokemon16.jpg",
    "./images/pokemon/pokemon17.jpg",
    "./images/pokemon/pokemon18.jpg",
    "./images/pokemon/pokemon19.jpg",
    "./images/pokemon/pokemon20.jpg",
    "./images/pokemon/pokemon21.jpg",
    "./images/pokemon/pokemon22.jpg",
    "./images/pokemon/pokemon23.jpg",
    "./images/pokemon/pokemon24.jpg",
    "./images/pokemon/pokemon25.jpg",
    "./images/pokemon/pokemon26.jpg",
    "./images/pokemon/pokemon27.jpg",
    "./images/pokemon/pokemon28.jpg",
    "./images/pokemon/pokemon29.jpg",
    "./images/pokemon/pokemon30.jpg",
    "./images/pokemon/pokemon31.jpg",
    "./images/pokemon/pokemon32.jpg",
    "./images/pokemon/pokemon33.jpg",
    "./images/pokemon/pokemon34.jpg",
    "./images/pokemon/pokemon35.jpg",
    "./images/pokemon/pokemon36.jpg",
    "./images/pokemon/pokemon37.jpg",
    "./images/pokemon/pokemon38.jpg",
    "./images/pokemon/pokemon39.jpg",
  ];

  // Owned items (fetched from local storage)
  const [ownedItems, setOwnedItems] = useState(
    JSON.parse(localStorage.getItem("ownedItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  }, [ownedItems]);

  // NEW: Helper function to get the current count of owned items for a pack
  const getOwnedPackCount = (packImages) => {
    return packImages.filter((item) => ownedItems.includes(item)).length;
  };

  // Helper function to check if the collection meets the exchange threshold
  const meetsExchangeThreshold = (packImages, packThreshold) => {
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

    if (type === "Animal Pack") {
      availableImages = animalImages.filter((img) => !ownedItems.includes(img));
      if (availableImages.length === 0) {
        alert(
          "You already own all the Animal Pack images! Consider exchanging 25+ items for a Gem."
        );
        return;
      }

      if (coins >= 25 && tickets >= 25) {
        const randomAnimal =
          availableImages[Math.floor(Math.random() * availableImages.length)];
        setCoins(-25);
        setTickets(-25);
        setOwnedItems((prev) => [...prev, randomAnimal]);
        tiggerModal(randomAnimal);
      } else {
        alert("Not enough coins or tickets to purchase the Animal Pack.");
      }
    } else if (type === "Baseball Pack") {
      availableImages = baseballImages.filter(
        (img) => !ownedItems.includes(img)
      );
      if (availableImages.length === 0) {
        alert(
          "You already own all the Baseball Pack images! Consider exchanging 30+ items for a Gem."
        );
        return;
      }

      if (coins >= 25) {
        const randomBaseball =
          availableImages[Math.floor(Math.random() * availableImages.length)];
        setCoins(-25);
        setOwnedItems((prev) => [...prev, randomBaseball]);
        tiggerModal(randomBaseball);
      } else {
        alert("Not enough coins to purchase the Baseball Pack.");
      }
    } else if (
      type === "Pokemon Stellar Coin" ||
      type === "Pokemon Stellar Ticket"
    ) {
      availableImages = pokemonImages.filter(
        (img) => !ownedItems.includes(img)
      );
      if (availableImages.length === 0) {
        alert(
          "You already own all the Pokemon Stellar Crown images! Consider exchanging 20+ items for a Gem."
        );
        return;
      }

      if (type === "Pokemon Stellar Coin") {
        if (coins >= 50) {
          const randomPokemon =
            availableImages[Math.floor(Math.random() * availableImages.length)];
          setCoins(-50);
          setOwnedItems((prev) => [...prev, randomPokemon]);
          tiggerModal(randomPokemon);
        } else {
          alert("Not enough coins to purchase the Pokemon Pack.");
        }
      } else {
        if (tickets >= 50) {
          const randomPokemon =
            availableImages[Math.floor(Math.random() * availableImages.length)];
          setTickets(-50);
          setOwnedItems((prev) => [...prev, randomPokemon]);
          tiggerModal(randomPokemon);
        } else {
          alert("Not enough tickets to purchase the Pokemon Pack.");
        }
      }
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

  // Component rendering starts here
  return (
    <div className="container">
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 20,
          display: "flex",
          gap: 8,
        }}
      >
        <a href="#" onClick={() => setPage("game")}>
          Back to Game
        </a>
        <span>🪙:{coins}</span>
        <span>🎟️: {tickets}</span>
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

          {/* UPDATED Trade-In Button with Progress */}
          {(() => {
            const currentCount = getOwnedPackCount(animalImages);
            const threshold = ANIMAL_THRESHOLD;
            const isReady = meetsExchangeThreshold(animalImages, threshold);
            const buttonText = isReady
              ? `Exchange ${currentCount} items for 💎 Gem`
              : `Progress: ${currentCount}/${threshold}`;

            return (
              <button
                onClick={() =>
                  handleTradeInCollection(
                    "Animal Pack",
                    animalImages,
                    threshold
                  )
                }
                className="submit-button"
                style={{
                  backgroundColor: isReady ? "#20b2aa" : "#808080", // Highlight green when ready, otherwise gray
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

          {/* UPDATED Trade-In Button with Progress */}
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

          {/* UPDATED Trade-In Button with Progress */}
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

      {/* Existing Item Received Modal (omitted for brevity) */}
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

      {/* Gem History Modal (omitted for brevity) */}
      {showGemHistory && (
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
              width: "80%",
              maxWidth: "500px",
            }}
          >
            <h2>Gem Exchange History ({gems} 💎)</h2>
            {gemHistory.length === 0 ? (
              <p>No Gems have been exchanged yet.</p>
            ) : (
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  textAlign: "left",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {gemHistory
                  .slice()
                  .reverse()
                  .map((record, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "10px",
                        padding: "5px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>+1 💎</span> from{" "}
                      {record.collection} on
                      <br />
                      <span style={{ fontSize: "0.9em" }}>
                        {formatTimestamp(record.date)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
            <button
              onClick={toggleGemHistoryModal}
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
    </div>
  );
};

export default Shop;
