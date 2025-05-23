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
        <div className="flex justify-center">
          <Image 
            src="/atcg.png" 
            alt="Reference Image" 
            width={300} 
            height={200} 
            className="max-w-xs my-5 border-2 border-[#00fff7] rounded-lg shadow-[0_0_10px_#00fff7]"
          />
        </div>
      </p>
      <p className="my-2">Now decode this morse code to get a set of numbers</p>
      <br />
      <h2 className="text-[#00fff7] text-shadow-glow mb-2">Sequence to decode :</h2>
      <ol className="text-left max-w-lg bg-[#1a1a1a] p-5 rounded-lg shadow-[0_0_10px_rgba(0,255,255,0.2)]">
        <li className="mb-2">1_AvengersEndGame : AAT GAGT GCC</li>
        <li className="mb-2">2_LoremIpsum : GTCT ATC ATTT</li>
        <li className="mb-2">3_AttentionIsAllYouNeed : AGC CTA TCA space AGC</li>
        <li className="mb-2">4_Orion : GCC CCT GGTTT AAT ACT</li>
        <li className="mb-2">5_TheForceAwakens : GGGA GGTTT GCTT</li>
        <li className="mb-2">6_MerchantOfVenice: AGA TCGG TAGG GAC</li>
      </ol>

      <h2 className="text-[#00fff7] text-shadow-glow mb-2 mt-4">Morse code reference</h2>
      <div className="flex justify-center">
        <Image 
          src="/morse.png" 
          alt="Problem Image" 
          width={300} 
          height={200} 
          className="max-w-xs my-5 border-2 border-[#00fff7] rounded-lg shadow-[0_0_10px_#00fff7]"
        />
      </div>
      <br />

      <p className="my-2">
        To decipher the next part go to <br />
        <span className="block mt-2 mb-2">to know what do with these numbers, click the link below. there is another set of instructions which will tell you how to extract letters, combine those letters to form a word and submit it below to be the winner</span>
        GitHub repo:
        <Link href="https://github.com/pranav1211/Final-Round-UNC3" target="_blank" className="text-[#ff00ff] font-bold hover:underline">
          {"https://github.com/pranav1211/Final-Round-UNC3"}
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