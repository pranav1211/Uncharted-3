'use client';

import { useState, useEffect } from "react";

export default function UnchartedLostVoyage() {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    // Create subtle glitch effect intermittently
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 5000);

    return () => {
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-fixed flex flex-col justify-between items-center text-white font-sans"
      style={{
        backgroundImage: "url('/ULVFS.png')",
        backgroundRepeat: "repeat-y"
      }}
    >
      {/* Simple dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-start space-y-8">
        {/* Titles Section - Stacked vertically */}
        <div className="flex flex-col justify-center items-center space-y-4 mb-12">
          <img
            src="/unc.png"
            alt="Uncharted"
            className={`w-182 md:w-196 ${glitchEffect ? 'translate-x-px' : ''}`}
          />
          <img
            src="/lv.png"
            alt="Lost Voyage"
            className={`w-182 md:w-196 ${glitchEffect ? '-translate-x-px' : ''}`}
          />
        </div>

        {/* Desktop Experience Disclaimer */}
        <div className="text-yellow-300 text-center mb-2 text-base md:text-lg">
          <p>⚠️ For the best experience, please play this game on a desktop/laptop as it was designed for larger screens.</p>
        </div>

        {/* Jump into Action CTA - Top Priority */}
        <button
          className="px-12 py-5 cursor-pointer rounded-md text-white font-bold transition-all duration-300 text-xl md:text-2xl animate-pulse"
          style={{
            background: 'linear-gradient(45deg, #8b5cf6, #6366f1)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.8)',
          }}
          onClick={() => setRulesOpen(true)}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 0 35px rgba(139, 92, 246, 1)';
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.07)';
            e.currentTarget.classList.remove('animate-pulse');
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.8)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.classList.add('animate-pulse');
          }}
        >
          Jump into the Action!
        </button>

        {/* Main Info Section - Now vertical */}
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Welcome & Description */}
          <div className="p-6 rounded-md bg-black bg-opacity-70 backdrop-blur-sm border border-purple-500"
            style={{
              boxShadow: '0 0 20px rgba(128, 0, 255, 0.3)',
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
              About Uncharted Lost Voyage
            </h2>
            <p className="mb-4 text-base md:text-lg text-blue-100">
              <strong>Uncharted Lost Voyage</strong> was a digital treasure hunt hosted during Utsav Ananta 2025, where participants solved various puzzles and challenges, racing against time and each other to claim victory.
            </p>
            <p className="text-base md:text-lg mb-4 text-purple-200">
              <i>Missed the event? No worries! You can still experience the excitement. Click the <strong>"Jump into the Action!"</strong> button above to start the adventure!</i>
            </p>
          </div>

          {/* Credits Section */}
          <div className="p-6 rounded-md bg-black bg-opacity-70 backdrop-blur-sm border border-purple-500 flex flex-col"
            style={{
              boxShadow: '0 0 20px rgba(128, 0, 255, 0.3)',
            }}
          >
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
              Credits
            </h2>
            <div className="text-base text-blue-300">
              <p className="mb-3">
                <span className="text-purple-300 font-semibold">Event Coordinators:</span> Pranav Veeraghanta and Siddarth
              </p>
              <p className="mb-3">
                <span className="text-purple-300 font-semibold">Integration, Management, and Testing:</span> Pranav Veeraghanta
              </p>

              <p className="text-purple-300 font-semibold mb-2">Volunteers/Puzzle Creators:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 mt-1 text-blue-100">
                <li>Fasi Owaiz Ahmed</li>
                <li>Varsha V Kumar</li>
                <li>Shriyans Nayak</li>
                <li>Suniksha Priya</li>
                <li>Sahana BK</li>
                <li>Ahas Kaushik</li>
                <li>Anirudh Kuppam</li>
                <li>Navit Mathur</li>
                <li>Shashank Bhat</li>
                <li>Channabasavanna</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="w-full max-w-4xl p-6 rounded-md bg-black bg-opacity-70 backdrop-blur-sm border border-purple-500 text-center"
          style={{
            boxShadow: '0 0 20px rgba(128, 0, 255, 0.3)',
          }}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-200">
            Once you've solved it, tag us on social media and share your experience:
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <a
              href="https://instagram.com/gradient.aiml"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md transition-all duration-300 text-white hover:shadow-lg hover:shadow-purple-500/20 text-base md:text-lg"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Tag @gradient.aiml on Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/gradient-club"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md transition-all duration-300 text-white hover:shadow-lg hover:shadow-blue-500/20 text-base md:text-lg"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Tag Gradient Club on LinkedIn
            </a>
            <a
              href="https://twitter.com/Pranavisda1"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-md transition-all duration-300 text-white hover:shadow-lg hover:shadow-blue-500/20 text-base md:text-lg"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              Tag @Pranvisda1 on Twitter
            </a>
          </div>
        </div>

        {/* View Answers Button */}
        <a
          href="https://docs.google.com/spreadsheets/d/1kqMGGnIZ9MjnrBB9Xw2lE4Tc5S4-_jcsCcb_KHgPh2w/edit?usp=sharing"
          className="px-8 py-3 rounded-md text-white font-bold transition-all duration-300 text-lg"
          target="_blank"
          style={{
            background: 'linear-gradient(45deg, #6d28d9, #8b5cf6)',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.8)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.5)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          View Answers
        </a>
      </div>

      {/* Rules Modal */}
      {rulesOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="relative mx-4 p-6 rounded-lg max-w-md w-full bg-black bg-opacity-90 border border-purple-500"
            style={{
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

            <h3 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
              Game Rules
            </h3>

            <ul className="list-none text-left space-y-3 mb-6">
              {["You can use Google Search, but avoid AI tools for a more fun experience.",
                "Use decoding and encoding tools as needed."].map((rule, index) => (
                  <li key={index} className="flex items-start text-blue-100">
                    <span className="inline-block mr-2 mt-1 text-purple-400">◆</span>
                    <span>{rule}</span>
                  </li>
                ))}
            </ul>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                className="px-5 py-2 cursor-pointer rounded-md text-white font-bold transition-all duration-300"
                style={{
                  background: 'linear-gradient(45deg, #059669, #10b981)',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
                }}
                onClick={() => {
                  setRulesOpen(false);
                  window.open('https://uncharted3.gradientaiml.tech/scroll');
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                Start Game
              </button>

              <button
                className="px-5 py-2 rounded-md text-white font-bold transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(45deg, #dc2626, #ef4444)',
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
                }}
                onClick={() => setRulesOpen(false)}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.8)';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.5)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}