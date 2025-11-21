import React from 'react';

function AnswerInput({ userAnswer, handleAnswerChange, handleKeyDown, handleSubmitAnswer, disabled }) {
  return (
    <div className="input-container">
      <input
        type="text"
        value={userAnswer}
        onChange={handleAnswerChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        class="answer-input"
      />
      <button
        className="submit-button"
        onClick={handleSubmitAnswer}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
  );
}

export default AnswerInput;