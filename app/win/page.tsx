'use client';

import { useState, useEffect } from 'react';

export default function Congratulations() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded state after component mounts
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* VIDEO BACKGROUND - ensuring it's the first element */}
      <div className="fixed inset-0 z-0">
        <video 
          autoPlay
          muted
          loop
          playsInline
          className="absolute h-full w-full object-cover"
        >
          <source src="https://beyondmebtw.com/assets/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>
      
      {/* CONTENT - positioned above the video */}
      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center px-4 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Decorative emblem */}
        <div className="mb-12 relative mx-auto w-40 h-40">
          <div className="absolute inset-0 rounded-full border-4 border-amber-300 animate-spin" style={{ animationDuration: '30s' }}></div>
          <div className="absolute inset-4 rounded-full border-2 border-amber-300 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-8 rounded-full border border-amber-300 animate-pulse"></div>
          <div className="absolute inset-12 bg-amber-300 bg-opacity-20 rounded-full"></div>
        </div>
        
        {/* Main title with shimmer effect */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200 animate-shimmer tracking-wide text-center">
          CONGRATULATIONS
        </h1>
        
        {/* Message */}
        <p className="font-serif text-xl md:text-4xl font-medium mb-10 text-yellow-100 max-w-3xl mx-auto leading-relaxed text-center">
          <span className="text-amber-300 font-bold">"You are the legend who turned mystery into mastery."</span>
        </p>
        
        <h2 className="font-serif text-3xl md:text-5xl font-bold mt-8 mb-6 text-white tracking-widest text-center">
          You have won
        </h2>
        
        <h3 className="font-serif text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 animate-pulse mb-16 tracking-wider text-center">
          Uncharted Lost Voyage
        </h3>
      </div>
      
      {/* Custom styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        .font-serif {
          font-family: 'Cinzel', serif;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}