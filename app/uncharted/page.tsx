"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

const StartPage: React.FC = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate each word in the title
    animate(".title-word", {
      y: [
        { to: "-2rem", ease: "outExpo", duration: 600 },
        { to: 0, ease: "outBounce", duration: 800 },
      ],
      rotate: { from: "-1turn", delay: 0 },
      delay: (_, i) => i * 200, // Sequential animation for words
      easing: "inOutCirc",
    });

    // Animate button hover effect
    animate(".start-button", {
      scale: [
        { to: 1.05, duration: 300, easing: "easeOutElastic(1, 1)" },
        { to: 1, duration: 300, easing: "easeInElastic(1, 1)" },
      ],
      loop: true,
      loopDelay: 1000,
    });
  }, []);

  return (
    <div
      ref={root}
      className="h-screen bg-black flex flex-col items-center justify-center text-center px-4"
    >
      <h1 className="text-yellow-400 text-4xl md:text-6xl font-bold tracking-wide mb-8 neon-text">
        <span className="title-word">Uncharted:</span>{" "}
        <span className="title-word">Lost</span>{" "}
        <span className="title-word">Voyage</span>
      </h1>
      <p className="text-yellow-200 text-lg md:text-xl max-w-2xl mb-12">
        Dive into a neon-lit adventure. Solve puzzles, uncover secrets, and
        unlock the mysteries hidden in the cyber realm.{" "}
        <span className="text-yellow-300 font-semibold">
          Are you ready to begin the journey?
        </span>
      </p>
      <button
        className="start-button px-6 py-3 bg-yellow-400 text-black font-semibold text-lg rounded-lg shadow-md hover:bg-yellow-500 transition-transform duration-300 neon-border"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartPage;
