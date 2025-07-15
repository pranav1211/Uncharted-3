"use client";

import { useEffect, useState } from "react";
import LiquidChrome from '@/components/LiquidChrome';
import CircularText from '@/components/CircularText';
import DecryptedText from "@/components/DecryptedText";

const StartPage: React.FC = () => {
  const [showSecondText, setShowSecondText] = useState(false);
  const [showThirdText, setShowThirdText] = useState(false);

  useEffect(() => {
    const titleWords = document.querySelectorAll(".title-word");
    titleWords.forEach((word, index) => {
      setTimeout(() => {
        (word as HTMLElement).classList.add("opacity-100", "translate-y-0");
      }, index * 300);
    });

    const button = document.querySelector(".start-button");
    if (button) {
      button.addEventListener("mouseenter", () => {
        (button as HTMLElement).classList.add("scale-105");
      });
      button.addEventListener("mouseleave", () => {
        (button as HTMLElement).classList.remove("scale-105");
      });
    }

    // Cascade text animations
    setTimeout(() => setShowSecondText(true), 2000);
    setTimeout(() => setShowThirdText(true), 4000);
  }, []);

  return (
    <div className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* LiquidChrome Background */}
      <div className="absolute inset-0 w-full h-full">
        <LiquidChrome
          baseColor={[0.4, 0.0, 0.2]}
          speed={0.2}
          amplitude={0.4}
          interactive={false}
        />
      </div>

      {/* Top Left Corner Logo with Circular Text */}
      <div className="absolute top-14 left-14 z-20">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          {/* Circular Text Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CircularText
              text="GRADIENT*CLUB*"
              onHover="speedUp"
              spinDuration={20}
              className="custom-class"
            />
          </div>
          {/* Logo Image */}
          <img 
            src="https://gradient-content-server.vercel.app/content/Logo.png" 
            alt="Logo" 
            className="relative z-10 w-20 h-20 md:w-40 md:h-24 object-contain"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-white text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide mb-12 leading-tight">
        <DecryptedText
          text="Welcome, Chosen One..."
          animateOn="view"
          revealDirection="center"
          speed={200}
          maxIterations={15}
          className="bg-gradient-to-r from-purple-300 via-white to-purple-300 bg-clip-text text-transparent"
        />
      </div>
      
      {showSecondText && (
        <div className="relative z-10 text-gray-200 text-xl md:text-2xl lg:text-3xl max-w-4xl mb-12 font-light leading-relaxed animate-fade-in">
          <DecryptedText
            text="You have been summoned to traverse the labyrinth of digital mysteries, where ancient codes guard forbidden knowledge and only the worthy shall prevail."
            animateOn="view"
            revealDirection="left"
            speed={30}
            maxIterations={15}
            className="text-gray-200"
          />
        </div>
      )}

      <button className="start-button relative z-10 px-12 py-6 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-bold text-xl md:text-2xl rounded-2xl shadow-2xl hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 transition-all duration-500 border-2 border-purple-500 hover:border-purple-400 hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 backdrop-blur-sm" onClick={() => window.location.href = 'https://uncharted3.gradientaiml.tech/scroll'}>
        <span className="relative z-10 tracking-wide">BEGIN YOUR ODYSSEY</span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-2xl blur-sm animate-pulse"></div>
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-delayed {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in-delayed 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StartPage;