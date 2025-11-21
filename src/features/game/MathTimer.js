import { useState, useEffect, useCallback, useRef } from "react";
import AnswerInput from "../../components/AnswerInput";
import ScoreDisplay from "../../components/ScoreDisplay";

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
    const largerNum = num1 * num2;
    problem = `${largerNum} ÷ ${num1}`;
    answer = num2;
  }

  return { problem, answer };
};

const MathTimer = ({ userName, onSessionEnd, setPage }) => {
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
  const [sessionCoins, setSessionCoins] = useState(0);
  const [sessionTickets, setSessionTickets] = useState(0);
  
  // Use ref to track if we've already called onSessionEnd for this session
  const sessionEndedRef = useRef(false);

  useEffect(() => {
    let interval;

    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isTimerRunning && !sessionEndedRef.current) {
      setFeedback(
        `Time's up! Coins (🪙) earned: ${sessionCoins}, Tickets (🎟️) earned: ${sessionTickets}`
      );

      onSessionEnd(sessionCoins, sessionTickets);
      sessionEndedRef.current = true;
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timer, sessionCoins, sessionTickets, onSessionEnd]);

  const startTimer = useCallback(() => {
    sessionEndedRef.current = false; // Reset the ref for new session
    setIsTimerRunning(true);
    setTimer(60);
    // The component will correctly use the latest selectedOperators when this function is called
    const { problem, answer } = generateMathProblem(selectedOperators);
    setProblem(problem);
    setAnswer(answer);
    setUserAnswer("");
    setFeedback("");
    setCorrectCount(0);
    setIncorrectCount(0);
    setSessionCoins(0);
    setSessionTickets(0);
  }, [selectedOperators]);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (parseInt(userAnswer) === answer) {
      setFeedback("Correct!");
      setCorrectCount((prev) => prev + 1);
      if (problem.includes("+") || problem.includes("-")) {
        setSessionCoins((prev) => prev + 1);
      } else if (problem.includes("x") || problem.includes("÷")) {
        setSessionTickets((prev) => prev + 1);
      }
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

  const handleOperatorToggle = (operators) => {
    setSelectedOperators((prev) =>
      prev.includes(operators[0])
        ? prev.filter((op) => !operators.includes(op))
        : [...prev, ...operators]
    );
  };

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            {userName ? `${userName}'s Math Timer` : "Math Timer"}
            <a
              href="#"
              onClick={() => setPage("name")}
              style={{
                textDecoration: "none",
                color: "#9eb3ff",
                fontSize: 24,
                marginLeft: 5,
                marginTop: 5,
                transform: "scaleX(-1)",
              }}
              title="Edit Name"
            >
              ✏️
            </a>
          </div>
        </h1>
      </div>
      <p className="timer">
        Time left: <span>{timer}s</span>
      </p>
      <div className="operator-selection">
        <h3>Select Operators:</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {/* Addition Toggle */}
          <div className="operator-group">
            {"🪙"}
            <div>+</div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={selectedOperators.includes("+")}
                onChange={() => handleOperatorToggle("+")}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Subtraction Toggle */}
          <div className="operator-group">
            {"🪙"}
            <div>-</div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={selectedOperators.includes("-")}
                onChange={() => handleOperatorToggle("-")}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Multiplication Toggle */}
          <div className="operator-group">
            {"🎟️"}
            <div>x</div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={selectedOperators.includes("x")}
                onChange={() => handleOperatorToggle("x")}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Division Toggle */}
          <div className="operator-group">
            {"🎟️"}
            <div>÷</div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={selectedOperators.includes("÷")}
                onChange={() => handleOperatorToggle("÷")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
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
          <AnswerInput
            userAnswer={userAnswer}
            handleAnswerChange={handleAnswerChange}
            handleKeyDown={handleKeyDown}
            handleSubmitAnswer={handleSubmitAnswer}
            disabled={timer === 0}
          />
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}
      {!isTimerRunning && timer === 0 && (
        <ScoreDisplay
          feedback={feedback}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
        />
      )}
    </div>
  );
};

export default MathTimer;
