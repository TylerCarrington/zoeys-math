import React from 'react';

function ScoreDisplay({ feedback, correctCount, incorrectCount }) {
  return (
    <div className="score-container">
      <h2>Final Score</h2>
      {feedback && <p className="feedback">{feedback}</p>}
      <p className="score correct">Correct: {correctCount}</p>
      <p className="score incorrect">Incorrect: {incorrectCount}</p>
    </div>
  );
}

export default ScoreDisplay;