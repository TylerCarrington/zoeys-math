import React, { useState, useEffect } from "react";

// Updated component signature to accept gems and persistGems
const Shop = ({
  coins,
  tickets,
  setCoins,
  setTickets,
  setPage,
  gems,
  persistGems,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [receivedImage, setReceivedImage] = useState("");

  // Animal Pack and Baseball Pack Images (Content omitted for brevity)
  const animalImages = [
    "./images/animals/animal1.webp",
    // ...
  ];
  const baseballImages = [
    "./images/baseball/baseball1.jpeg",
    // ...
  ];

  const pokemonImages = [
    "./images/pokemon/pokemon01.png",
    // ...
  ];

  // Owned items (fetched from local storage)
  const [ownedItems, setOwnedItems] = useState(
    JSON.parse(localStorage.getItem("ownedItems")) || []
  );

  useEffect(() => {
    localStorage.setItem("ownedItems", JSON.stringify(ownedItems));
  }, [ownedItems]);

  const handlePurchase = (type) => {
    let availableImages = [];

    if (type === "Animal Pack") {
      availableImages = animalImages.filter((img) => !ownedItems.includes(img));
      if (availableImages.length === 0) {
        alert("You already own all the Animal Pack images!");
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
        alert("You already own all the Baseball Pack images!");
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
        alert("You already own all the Pokemon Stellar Crown images!");
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
        <span>💎: {gems}</span> {/* NEW: Display Gems */}
      </div>
      <h1>Shop</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
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
            className="submit-button" // CORRECTED: class changed to className
            style={
              coins < 25 || tickets < 25
                ? { backgroundColor: "lightgray", cursor: "readonly" }
                : {}
            }
            disabled={coins < 25 || tickets < 25}
          >
            Buy Animal Pack
          </button>
        </div>
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
            className="submit-button" // CORRECTED: class changed to className
            style={
              coins < 25
                ? { backgroundColor: "lightgray", cursor: "readonly" }
                : {}
            }
            disabled={coins < 25}
          >
            Buy Baseball Pack
          </button>
        </div>
        <div>
          <h2>Pokemon Stellar Crown</h2> {/* CORRECTED: Title for clarity */}
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
                className="submit-button" // CORRECTED: class changed to className
                style={
                  coins < 50
                    ? { backgroundColor: "lightgray", cursor: "readonly" }
                    : {}
                }
                disabled={coins < 50}
              >
                Buy Pokemon Pack (Coin) {/* CLARIFIED: Button text */}
              </button>
            </div>
            <div>
              <p>Cost: 50 🎟️</p>
              <button
                onClick={() => handlePurchase("Pokemon Stellar Ticket")}
                className="submit-button" // CORRECTED: class changed to className
                style={
                  tickets < 50
                    ? { backgroundColor: "lightgray", cursor: "readonly" }
                    : {}
                }
                disabled={tickets < 50}
              >
                Buy Pokemon Pack (Ticket) {/* CLARIFIED: Button text */}
              </button>
            </div>
          </div>
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
    </div>
  );
};

export default Shop;
