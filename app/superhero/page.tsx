"use client";

import { useEffect, useState } from "react";
import { Orbitron } from 'next/font/google';

// Configure the font
const orbitronFont = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function GridOfSecrets() {
  const [lives, setLives] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);
  const [password, setPassword] = useState("");
  const [gridItems, setGridItems] = useState<string[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);

  const path = [
    "Elon Musk", "Spotify", "Gold", "Heisenburg", "Minecraft", "RCB", 
    "Ned Stark", "Reddit", "UART", "Voldemort", "YouTube", "Thor", 
    "Tinder", "El Chapo","Pepsi", "Math", "Squid Game", "LinkedIn"
  ];
  
  const fragments = [
    "O", "V", "E", "R", "I", "N", "T", "E", "L", "L", 
    "E", "C", "T", "U", "A", "L", "Y"
  ];
  
  const clues = [
    "From PayPal to Mars, he's the guy who made electric cars look cool",
    "The biggest platform that lets you stream millions of audio files",
    "The element that doesn't rust, yet built empires and bank vaults",
    "Say my Name. The iconic line said by a man who built a drug empire from his lab (The Nickname of the character)",
    "A platform which allows players to mine & build in a blocky world",
    "Ee sala cup namde",
    "From a TV show where the game of thrones is deadly, a noble soul was branded a traitor.",
    "A massive forum where people can share news, opinions, and memes in thousands of niche communities, Its upvote system rewards the most popular posts",
    "Universal data transmitter (but flipped 3 times)",
    "He who must not be named. The person who feared his existence in the world of wizard & witches",
    "Platform with the second-largest search engine in the world, with billions of hours of content uploaded every day.",
    "Norse God of Thunder",
    "A modern matchmaking app where you judge potential partners with a single swipe. It's been blamed for hookup culture, modern dating dilemmas, and the occasional awkward coffee shop encounter",
    "A Mexican drug lord who ran one of the most notorious cartels in history. His escape from prison made headlines worldwide",    
    "A soda brand that once aired a controversial ad with Kendall Jenner, being a part of great rivalry between 2 companies",
    "Language of The Universe",
    "A playground turned death trap, a silly game for the rich",
    "A professional networking platform that connects people looking for jobs, business opportunities, and industry insights."
  ];

  const customLabels = [
    "Elon Musk", "Raisin", "Heisenburg", "Peach", "Voldemort", "Harry Potter", "RCB", "Redbull", "Bitcoin", "Kylie Jenner",
    "Thanos", "UART", "AI", "Instagram", "5 Star", "Chocolate", "Captcha", "Romeo", "Sierra", "Terraria",
    "Uniform", "Amazon", "Nvidia", "Avengers", "Bluetooth", "Minecraft", "One", "Tony Stark", "El Chapo", "Donald Trump",
    "Thor", "Ned Stark", "Kira", "Albert Einstein", "Pablo Escobar", "Jonn snow", "Vine", "Banana", "Cherry", "Date",
    "Egg", "Naruto", "Grape", "Honey", "Ice", "Tesla", "Kiwi", "Lemon", "Loki", "Nectar",
    "Zeus", "YouTube", "Quince", "Spotify", "Straw", "Facebook", "Ronnie Coleman", "Vanilla", "Water", "Xigua",
    "Yam", "Zucchini", "Red", "Copper", "Green", "Tinder", "Purple", "Cyan", "Magenta", "Brown",
    "Silver", "Gold", "Blue", "Bronze", "Iron", "Math", "Platinum", "Itunes", "Ruby", "Sapphire",
    "Emerald", "Topaz", "Amethyst", "Pearl", "Reddit", "Squid Game", "LinkedIn", "Sand", "Clay", "Roblox",
    "Brick", "Wood", "Leaf", "Pepsi", "Hunger Games", "Cloud", "Maze Runner", "Snow", "Fog", "Thanos"
  ];

  const createGrid = () => {
    setGridItems([...customLabels]);
  };

  useEffect(() => {
    createGrid();
    
    // Set up keyboard shortcuts prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
      }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
      }
      else if (e.key === 'F12') {
        e.preventDefault();
      }
      else if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Set up grid shuffling
    const shuffleInterval = setInterval(shuffleGrid, 30000);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(shuffleInterval);
    };
  }, []);

  const shuffleGrid = () => {
    setGridItems(prevItems => [...prevItems].sort(() => Math.random() - 0.5));
  };

  const handleClick = (label: string) => {
    if (currentStep >= path.length || lives <= 0) return;

    if (label === path[currentStep]) {
      // Correct choice
      setPassword(prev => prev + fragments[currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      // Wrong choice
      setLives(prev => prev - 1);
      setDisabledButtons(prev => [...prev, label]);
    }
  };

  return (
    <div className={`min-h-screen bg-black text-cyan-400 flex flex-col items-center p-6 ${orbitronFont.className}`}>
      <h1 className="text-4xl font-bold mb-4 text-cyan-400 animate-pulse">
        GRID OF SECRETS
      </h1>
      
      <div className="mb-4 text-xl flex items-center gap-2">
        <span className="text-cyan-300">LIVES:</span>
        <span className="text-red-500 font-bold">{lives}</span>
        <div className="flex ml-2">
          {[...Array(lives)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-red-500 rounded-full mx-1 animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-10 gap-6 mb-8 mt-4">
        {gridItems.map((label, index) => (
          <button
            key={index}
            onClick={() => handleClick(label)}
            disabled={disabledButtons.includes(label) || currentStep >= path.length || lives <= 0}
            className={`
              w-24 h-24 text-sm font-medium
              border border-cyan-400 rounded-md
              bg-gradient-to-br from-gray-900 to-gray-800
              shadow-[0_0_10px_rgba(0,255,234,0.5)]
              transition-all duration-300 overflow-hidden
              relative flex items-center justify-center
              hover:shadow-[0_0_20px_rgba(0,255,234,0.8)] 
              hover:scale-110
              ${disabledButtons.includes(label) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${currentStep >= path.length || lives <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span className="relative z-10">{label}</span>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-30"></div>
            <div className="absolute h-1/3 w-full bottom-0 left-0 bg-gradient-to-t from-cyan-900/30 to-transparent"></div>
          </button>
        ))}
      </div>
      
      {/* Info section */}
      <div className="mt-6 text-center max-w-2xl">
        <div className="bg-gray-900/60 p-6 rounded-lg border border-cyan-900 shadow-[0_0_15px_rgba(0,255,234,0.3)]">
          <div className="mb-4">
            <p className="text-cyan-300 mb-1">CURRENT OBJECTIVE:</p>
            <p className="text-lg text-cyan-100 italic">
              {lives > 0 && currentStep < path.length 
                ? clues[currentStep] 
                : lives <= 0 
                ? "💀 SYSTEM FAILURE - GAME OVER 💀" 
                : "🎉 SYSTEM ACCESS GRANTED - PASSWORD RECOVERED 🎉"}
            </p>
          </div>
          
          <div className="mt-4">
            <p className="text-cyan-300 mb-2">PASSWORD DECRYPTION:</p>
            <div className="flex items-center justify-center space-x-1">
              {fragments.map((fragment, idx) => (
                <span 
                  key={idx}
                  className={`
                    inline-block w-8 h-10 
                    flex items-center justify-center
                    border border-fuchsia-500
                    ${idx < password.length 
                      ? 'bg-fuchsia-900/30 text-fuchsia-400 shadow-[0_0_10px_rgba(255,0,255,0.5)]' 
                      : 'bg-gray-800/30 text-gray-600'}
                    text-lg font-bold rounded
                  `}
                >
                  {idx < password.length ? password[idx] : ""}
                </span>
              ))}
            </div>
            
            {password && (
              <p className="mt-4 text-fuchsia-400 font-bold text-xl tracking-wider animate-pulse">
                {password}
              </p>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-8 flex justify-between w-full max-w-md mx-auto">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-ping delay-75"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-150"></div>
          <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-ping delay-300"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping delay-500"></div>
        </div>
      </div>
    </div>
  );
}