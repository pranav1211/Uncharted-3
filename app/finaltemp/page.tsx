"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FinalChallenge() {
  const [answer, setAnswer] = useState('');
  const [input1, setInput1] = useState('');

  const checkAnswer = () => {
    const correctAnswer = "dialga"; // Same as original
    const userAnswer = answer.trim().toLowerCase();
    if (userAnswer === correctAnswer) {
      window.location.href = "./win";
    } else {
      alert("Incorrect answer. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-5 px-5 text-center text-gray-200 bg-[#0e0e0e] bg-[radial-gradient(ellipse_at_top,#1a1a1a,#0e0e0e_80%)]">
      <h1 className="text-[#00fff7] text-shadow-glow mb-2">Solve this...</h1>
      <p className="my-2 leading-relaxed max-w-2xl">
        You are given a DNA sequence. Decode it into its complementary sequence.<br />
        Then you convert it into morse code using...<br />
        <Image 
          src="/atcg.png" 
          alt="Reference Image" 
          width={300} 
          height={200} 
          className="max-w-xs my-5 border-2 border-[#00fff7] rounded-lg shadow-[0_0_10px_#00fff7]"
        />
      </p>
      <p className="my-2">Now decode this morse code to get a set of numbers</p>
      <br />
      <h2 className="text-[#00fff7] text-shadow-glow mb-2">Sequence to decode :</h2>
      <ol className="text-left max-w-lg bg-[#1a1a1a] p-5 rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.2)]">
        <li className="mb-2">AAT GAGT GCC</li>
        <li className="mb-2">GTCT ATC ATTT</li>
        <li className="mb-2">ACG CTA TCA AGC</li>
        <li className="mb-2">GCC CCT GGTTT AAT ACT</li>
        <li className="mb-2">CCCCC CCTTT CTTTT</li>
        <li className="mb-2">ACA GTA TACC CATT</li>
      </ol>

      <h2 className="text-[#00fff7] text-shadow-glow mb-2 mt-4">Morse code reference</h2>
      <Image 
        src="/morse.png" 
        alt="Problem Image" 
        width={300} 
        height={200} 
        className="max-w-xs my-5 border-2 border-[#00fff7] rounded-lg shadow-[0_0_10px_#00fff7]"
      />
      <br />

      <p className="my-2">Solution is a set of 3 to 4 digit numbers</p>
      <input 
        type="text" 
        placeholder="Set of numbers is..."
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        className="p-3 my-2 w-4/5 max-w-md rounded border border-gray-600 bg-[#1e1e1e] text-[#00fff7] text-base text-center shadow-[inset_0_0_5px_#00fff7]"
      />

      <p className="my-2">
        To decipher the next part go to <br />
        GitHub repo:
        <Link href="https://github.com/varshavkumar98765/miniature-octo-lamp" target="_blank" className="text-[#ff00ff] font-bold hover:underline">
          {" https://github.com/varshavkumar98765/miniature-octo-lamp"}
        </Link>
      </p>

      <br /><br />
      <h2 className="text-[#00fff7] text-shadow-glow mb-2">Final Answer</h2>
      <input 
        type="text" 
        placeholder="Enter final answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="p-3 my-2 w-4/5 max-w-md rounded border border-gray-600 bg-[#1e1e1e] text-[#00fff7] text-base text-center shadow-[inset_0_0_5px_#00fff7]"
      />
      <br />
      <button 
        onClick={checkAnswer}
        className="py-2 px-6 bg-transparent text-[#00fff7] border-2 border-[#00fff7] rounded font-bold cursor-pointer transition-all duration-300 hover:bg-[#00fff7] hover:text-[#0e0e0e] hover:scale-105"
      >
        Submit
      </button>
    </div>
  );
}