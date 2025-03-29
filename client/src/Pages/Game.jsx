import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import wordsData from "../assests/data";
import { useAuth } from "../context/AuthContext";
import { sendScore } from "../Apis/game";
import Spinner from "../utils/Spinner"; // Import Spinner component

const Game = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([...wordsData]);
  const [currentWord, setCurrentWord] = useState(null);
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [inputStatus, setInputStatus] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading only for score submission

  const { user } = useAuth();

  const shuffleWord = (word) => {
    return word.split("").sort(() => Math.random() - 0.5).join("  ");
  };
  
  const getNewWord = () => {
    if (attempts >= 10) {
      setGameOver(true);
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];
  
    setCurrentWord(selectedWord);
    setScrambledWord(shuffleWord(selectedWord.answer)); // Shuffle dynamically
    setWords(words.filter((_, index) => index !== randomIndex));
    setUserInput("");
    setTimeLeft(10);
    setInputStatus(null);
    setAttempts((prev) => prev + 1);
  };

  useEffect(() => {
    if (gameStarted) {
      navigate("/game");
      getNewWord();
    }
  }, [gameStarted]);

  useEffect(() => {
    if (gameOver && user) {
      setLoading(true);
      sendScore({ email: user.email, score }).finally(() => setLoading(false));
      console.log("Score submitted:", user.email, score);
    }
  }, [gameOver, user, score]);

  const checkAnswer = () => {
    if (userInput.trim().toUpperCase() === currentWord.answer.toUpperCase()) {
      setScore(score + 1);
      setInputStatus("correct");
      setTimeout(() => {
        setInputStatus(null);
        getNewWord();
      }, 300);
    } else {
      setInputStatus("wrong");
      setUserInput("");
      setTimeout(() => {
        setInputStatus(null);
      }, 300);
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1500);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0) {
      if (attempts <= 10) {
        getNewWord();
      } else {
        setGameOver(true);
      }
    }
  }, [timeLeft, gameStarted, gameOver, attempts]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4 pt-10">
      {!gameStarted ? (
        <div className="bg-white p-8 md:p-10 rounded-lg shadow-md text-center max-w-lg md:max-w-xl transition-all w-full">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Word Scramble Game</h2>
          <p className="text-lg text-gray-700 mb-4">Unscramble the word before time runs out!</p>
          <button 
            onClick={() => setGameStarted(true)} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Start Game
          </button>
        </div>
      ) : gameOver ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md relative">
            <h2 className="text-3xl font-bold text-red-500">Game Over!</h2>
            <p className="text-xl font-semibold text-gray-700 mb-4">Final Score: {score}</p>
            {loading ? <Spinner /> : (
              <>
                <button 
                  onClick={() => { 
                    setGameOver(false); 
                    setScore(0); 
                    setAttempts(0); 
                    setWords([...wordsData]); 
                    setTimeout(getNewWord, 0);
                  }} 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2 transition-all"
                >
                  Play Again
                </button>
                <button 
                  onClick={() => navigate("/leaderboard")} 
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded m-2 transition-all"
                >
                  Leaderboard
                </button>
              </>
            )}
          </div>
        </div>
      ) : currentWord ? (
        <div className="bg-white p-8 md:p-10 rounded-lg shadow-md text-center max-w-lg md:max-w-xl transition-all w-full">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Word Scramble Game</h2>
          <p className="text-2xl font-semibold text-gray-800 tracking-widest">{scrambledWord}</p>
          <p className="text-lg text-gray-700 mb-4">Hint: {currentWord.hint}</p>
          <input 
            type="text" 
            className={`border p-3 rounded-lg text-lg w-full transition-all ${inputStatus === "correct" ? "bg-green-200 border-green-500" : ""} ${inputStatus === "wrong" ? "bg-red-200 border-red-500" : ""}`} 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            placeholder="Enter your answer" 
          />
          <button 
            onClick={checkAnswer} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg mt-4 transition-all"
          >
            Submit
          </button>
          <p className="text-red-600 font-semibold">Time Left: {timeLeft}s</p>
          <p className="text-blue-600 font-semibold"> Score: {score}</p>
          <p className="text-gray-600 font-semibold">Attempts: {attempts}/10</p>
        </div>
      ) : null}
    </div>
  );
};

export default Game;
