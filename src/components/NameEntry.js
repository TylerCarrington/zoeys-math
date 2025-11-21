import React, { useState, useEffect } from "react";

const NameEntry = ({ onNameSubmit }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    // Check if a name is already saved in local storage
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setName(savedName); // Populate the input field with the saved name
    }
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name.trim()); // Save to local storage
      onNameSubmit(name.trim()); // Pass the name back to the parent component
    }
  };

  return (
    <div className="name-entry-container">
      <h1>Welcome to Math Timer!</h1>
      <form onSubmit={handleSubmit} className="name-form">
        <label htmlFor="name-input">Enter your name:</label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Your name"
          className="name-input"
        />
        <button type="submit" className="submit-button">
          Save Name
        </button>
      </form>
    </div>
  );
};

export default NameEntry;
