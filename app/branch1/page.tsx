'use client';

// app/page.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [starsGenerated, setStarsGenerated] = useState(false);
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    if (!starsGenerated) {
      const newStars = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${0.2 + Math.random() * 0.3}rem`,
          animationDuration: `${3 + Math.random() * 7}s`
        });
      }
      setStars(newStars);
      setStarsGenerated(true);
    }
  }, [starsGenerated]);
  
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      {/* Mystical background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 to-black opacity-70"></div>
      
      {/* Stars */}
      {stars.map((star, index) => (
        <div 
          key={index}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            opacity: Math.random() * 0.8 + 0.2
          }}
        ></div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-5xl font-bold mb-16 text-center text-white tracking-wider">
          Choose Your Path
        </h1>
        
        <div className="flex flex-row w-full max-w-6xl gap-12 px-8 justify-center">
          {/* Left Portal */}
          <Link 
            href="https://example.com/portal-a" 
            className="w-1/2 max-w-md group"
            onMouseEnter={() => setHoverLeft(true)}
            onMouseLeave={() => setHoverLeft(false)}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-1000 ${hoverLeft ? 'opacity-70' : 'opacity-20'} bg-blue-500`}></div>
              
              <div className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-700 ${hoverLeft ? 'scale-105' : 'scale-100'}`}>
                {/* Portal rings */}
                <div className="absolute w-full h-full rounded-full border-8 border-blue-600 opacity-30 animate-pulse"></div>
                <div className="absolute w-5/6 h-5/6 rounded-full border-4 border-blue-400 opacity-40 animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute w-2/3 h-2/3 rounded-full border-2 border-blue-300 opacity-60 animate-spin" style={{ animationDuration: '15s' }}></div>
                
                {/* Portal center */}
                <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-b from-blue-200 to-blue-400 opacity-80 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-t from-transparent to-white opacity-30 animate-pulse"></div>
                    {hoverLeft && (
                      <div className="absolute text-white text-2xl font-light tracking-widest animate-pulse">ENTER</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Right Portal */}
          <Link 
            href="https://example.com/portal-b" 
            className="w-1/2 max-w-md group"
            onMouseEnter={() => setHoverRight(true)}
            onMouseLeave={() => setHoverRight(false)}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-1000 ${hoverRight ? 'opacity-70' : 'opacity-20'} bg-orange-500`}></div>
              
              <div className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-700 ${hoverRight ? 'scale-105' : 'scale-100'}`}>
                {/* Portal rings */}
                <div className="absolute w-full h-full rounded-full border-8 border-orange-600 opacity-30 animate-pulse"></div>
                <div className="absolute w-5/6 h-5/6 rounded-full border-4 border-orange-400 opacity-40 animate-spin" style={{ animationDuration: '20s' }}></div>
                <div className="absolute w-2/3 h-2/3 rounded-full border-2 border-orange-300 opacity-60 animate-spin" style={{ animationDuration: '15s' }}></div>
                
                {/* Portal center */}
                <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                  <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-b from-orange-200 to-orange-400 opacity-80 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-t from-transparent to-white opacity-30 animate-pulse"></div>
                    {hoverRight && (
                      <div className="absolute text-white text-2xl font-light tracking-widest animate-pulse">ENTER</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}