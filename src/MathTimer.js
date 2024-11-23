import { useState, useEffect, useCallback } from "react";

// Function to generate a random math problem
const generateMathProblem = (selectedOperators) => {
  const num1 = Math.floor(Math.random() * 12) + 1;
  const num2 = Math.floor(Math.random() * 12) + 1;
  const operations =
    selectedOperators.length > 0 ? selectedOperators : ["+", "-", "*", "/"];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let problem = "";
  let answer = 0;

  // Generate problems with positive whole number answers
  if (operation === "+") {
    problem = `${num1} + ${num2}`;
    answer = num1 + num2;
  } else if (operation === "-") {
    if (num1 > num2) {
      problem = `${num1} - ${num2}`;
      answer = num1 - num2;
    } else {
      problem = `${num2} - ${num1}`;
      answer = num2 - num1;
    }
  } else if (operation === "x") {
    problem = `${num1} x ${num2}`;
    answer = num1 * num2;
  } else if (operation === "÷") {
    const possibleResults = [];
    for (let i = 1; i <= 12; i++) {
      if (num1 % i === 0) {
        possibleResults.push(i);
      }
    }
    const divNum2 =
      possibleResults[Math.floor(Math.random() * possibleResults.length)];
    problem = `${num1} ÷ ${divNum2}`;
    answer = num1 / divNum2;
  }

  return { problem, answer };
};

const MathTimer = () => {
  const [timer, setTimer] = useState(60);
  const [problem, setProblem] = useState("");
  const [answer, setAnswer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [selectedOperators, setSelectedOperators] = useState([
    "+",
    "-",
    "x",
    "÷",
  ]);
  const [edittingName, setEdittingName] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let interval;

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setFeedback(
        `Time is up! Your score: ${correctCount} correct, ${incorrectCount} incorrect.`
      );
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, correctCount, incorrectCount]);

  const startTimer = useCallback(() => {
    setIsTimerRunning(true);
    setTimer(60);
    const { problem, answer } = generateMathProblem(selectedOperators);
    setProblem(problem);
    setAnswer(answer);
    setUserAnswer("");
    setFeedback("");
    setCorrectCount(0);
    setIncorrectCount(0);
  }, []);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (parseInt(userAnswer) === answer) {
      setFeedback("Correct!");
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`Incorrect! The correct answer was: ${answer}`);
      setIncorrectCount((prev) => prev + 1);
    }

    const { problem: newProblem, answer: newAnswer } =
      generateMathProblem(selectedOperators);
    setProblem(newProblem);
    setAnswer(newAnswer);
    setUserAnswer("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && timer > 0) {
      handleSubmitAnswer();
    }
  };

  const handleOperatorToggle = (operator) => {
    setSelectedOperators((prev) =>
      prev.includes(operator)
        ? prev.filter((op) => op !== operator)
        : [...prev, operator]
    );
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">
          {userName ? `${userName}'s Math Timer` : "Math Timer"}
        </h1>
        {edittingName ? (
          <div>
            <input
              type="text"
              className="name-input"
              placeholder="Enter your name"
              style={{ height: 40 }}
              value={userName}
              onChange={handleNameChange}
            />
            <button
              className="submit-button"
              onClick={() => setEdittingName(false)}
              style={{ marginLeft: 10 }}
              disabled={timer === 0}
            >
              Save
            </button>
          </div>
        ) : (
          <a href="#" onClick={() => setEdittingName(true)}>
            Edit Name
          </a>
        )}
      </div>
      <p className="timer">
        Time left: <span>{timer}s</span>
      </p>
      <div className="operator-selection">
        <h3>Select Operators:</h3>
        {["+", "-", "x", "÷"].map((op) => (
          <label className="toggle-switch" key={op}>
            <input
              type="checkbox"
              checked={selectedOperators.includes(op)}
              onChange={() => handleOperatorToggle(op)}
            />
            <span className="slider"></span>
            <span className="operator-label">{op}</span>
          </label>
        ))}
      </div>
      <button
        className="start-button"
        onClick={startTimer}
        disabled={isTimerRunning}
      >
        {isTimerRunning ? "Running..." : "Start Timer"}
      </button>
      {isTimerRunning && (
        <div className="game-container">
          <p className="problem">
            Problem: <span>{problem}</span>
          </p>
          <div className="input-container">
            <input
              className="answer-input"
              type="number"
              value={userAnswer}
              onChange={handleAnswerChange}
              onKeyDown={handleKeyDown}
              disabled={timer === 0}
            />
            <button
              className="submit-button"
              onClick={handleSubmitAnswer}
              disabled={timer === 0}
            >
              Submit
            </button>
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}
      {!isTimerRunning && timer === 0 && (
        <div className="score-container">
          <h2>Final Score</h2>
          <p className="score correct">Correct: {correctCount}</p>
          <p className="score incorrect">Incorrect: {incorrectCount}</p>
        </div>
      )}
    </div>
  );
};

export default MathTimer;
