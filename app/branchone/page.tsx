"use client";

import { useState } from "react";

export default function HackerTreasureHunt() {
  const [gameState, setGameState] = useState("intro");
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const startGame = () => {
    setGameState("q1");
  };

  const resetGame = () => {
    setGameState("intro");
    setAnswer("");
    setErrorMessage("");
  };

  const checkAnswer = (questionNumber: number, correctAnswer: string) => {
    if (answer.toLowerCase().trim() === correctAnswer) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (questionNumber < 3) {
          setGameState(`q${questionNumber + 1}`);
        } else {
          setGameState("complete");
        }
        setAnswer("");
      }, 1000);
    } else {
      setErrorMessage("Incorrect answer. Try again.");
      setTimeout(() => setErrorMessage(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a001f] text-[#e0e0ff] flex justify-center py-8">
      <div className="max-w-4xl w-full px-6 text-center">

        {/* Intro Screen */}
        {gameState === "intro" && (
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold mb-8 text-[#cc00ff] drop-shadow-[0_0_8px_#ff00ff]">
              🧠 Hacker Treasure Hunt
            </h1>
            <p className="text-lg mb-6">
              Welcome, Agent. You&apos;ve been selected to breach a fortified digital stronghold. 
              Three security layers lie ahead — each harder than the last. 
              Your wits, logic, and eyes will be tested. Decode, deduce, and uncover 
              the secrets hidden in the shadows.
            </p>
            <p className="text-xl font-bold mb-8">
              Are you ready to infiltrate?
            </p>
            <button 
              onClick={startGame}
              className="bg-[#cc00ff] px-8 py-3 rounded font-bold text-white shadow-[0_0_8px_#ff00ff] hover:bg-[#dd00ff] transition-colors"
            >
              Start
            </button>
          </div>
        )}

        {/* Question 1 */}
        {gameState === "q1" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-[#ff33cc]">
            Checkpoint 1: The Mosaic Cipher
            </h2>
            <div className="text-3xl font-bold my-6 text-white drop-shadow-[0_0_8px_#00ffff]">
            #T%h^i!s&1i#s*a2L(o)n-g3C!i^p#h(e)r4w%a^t#c@h5o!u^t6f#o*r7c$l*u#e^s
            </div>
            <p className="text-xl text-[#99ccff] mb-6">
            Instructions: Remove all non-alphabetical characters. 
            Then reorder the pieces to form a meaningful sentence.
            </p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-4/5 md:w-3/5 p-3 mt-4 bg-[#300040] text-white border-2 border-[#cc00ff] rounded-lg focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[#ff00ff]"
            />
            <div className="mt-2 h-6 text-red-400">{errorMessage}</div>
            <button
              onClick={() => checkAnswer(1, "this is a long cipher watch out for clues")}
              className="bg-[#cc00ff] px-6 py-3 mt-4 rounded font-bold text-white shadow-[0_0_8px_#ff00ff] hover:bg-[#dd00ff] transition-colors"
            >
              Submit
            </button>
          </div>
        )}

        {/* Question 2 */}
        {gameState === "q2" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-[#ff33cc]">
              Checkpoint 2: The Compass Grid
            </h2>
            <div className="text-2xl font-mono my-6 text-white drop-shadow-[0_0_8px_#00ffff] flex justify-center">
              <pre className="text-left">
                S   C   Q   L   S{"\n"}
                E   S   A   O   M{"\n"}
                D   E   C   V   B{"\n"}
                X   I   E   C   T{"\n"}
                H   U   G   S   W
              </pre>
            </div>
            <p className="text-xl text-[#99ccff] mb-2">
              Movement Pattern: Start at S (Row 2, Col 2)
            </p>
            <p className="text-xl text-[#99ccff] mb-6">
              Follow: Right → Down → Left → Up → Up
            </p>
            <p className="text-xl text-[#99ccff] mb-6">
            Collect the letters as you go through the grid and rearrange the collected letters to find the hidden passphrase.
            </p>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-4/5 md:w-3/5 p-3 mt-4 bg-[#300040] text-white border-2 border-[#cc00ff] rounded-lg focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[#ff00ff]"
            />
            <div className="mt-2 h-6 text-red-400">{errorMessage}</div>
            <button
              onClick={() => checkAnswer(2, "access")}
              className="bg-[#cc00ff] px-6 py-3 mt-4 rounded font-bold text-white shadow-[0_0_8px_#ff00ff] hover:bg-[#dd00ff] transition-colors"
            >
              Submit
            </button>
          </div>
        )}

        {/* Question 3 */}
        {gameState === "q3" && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-[#ff33cc]">
              Checkpoint 3: The Mirror of Truth
            </h2>
            <p className="text-xl text-[#99ccff] mb-4">
            &quot;I speak twice but only one is true. Flip me and the lie becomes the path. Look for the contratdiction as contradiction is the key.&quot;
            </p>
            <div className="text-3xl font-bold my-6 text-white drop-shadow-[0_0_8px_#00ffff]">
              THE GATE HIDES THE SIGN<br />
              NGIS EHT SEDIH LATROP EHT
            </div>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-4/5 md:w-3/5 p-3 mt-4 bg-[#300040] text-white border-2 border-[#cc00ff] rounded-lg focus:outline-none focus:border-[#ff00ff] focus:ring-2 focus:ring-[#ff00ff]"
            />
            <div className="mt-2 h-6 text-red-400">{errorMessage}</div>
            <button
              onClick={() => checkAnswer(3, "portal")}
              className="bg-[#cc00ff] px-6 py-3 mt-4 rounded font-bold text-white shadow-[0_0_8px_#ff00ff] hover:bg-[#dd00ff] transition-colors"
            >
              Finish
            </button>
          </div>
        )}



        {/* Complete */}
        {gameState === "complete" && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-6 text-green-400">
              Mission Complete!
            </h2>
            <p className="text-2xl mb-4">
              You&apos;ve successfully breached the system!
            </p>
            <p className="text-xl mb-8">
            Here is the key to the final puzzle : portal
            </p>
          </div>
        )}

        {/* Success Notification */}
        {showSuccess && (
          <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-8 py-4 rounded-lg shadow-lg animate-bounce">
            Correct Answer!
          </div>
        )}
      </div>
    </div>
  );
}