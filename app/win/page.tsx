'use client';

import { useState, useEffect } from 'react';

export default function Congratulations() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded state after component mounts
    setLoaded(true);
    
    // Apply Cinzel font to the page
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Custom shimmer animation styles
  const shimmerStyle = {
    backgroundImage: 'linear-gradient(to right, #fef3c7 10%, #fcd34d 20%, #fef3c7 30%)',
    backgroundSize: '200% auto',
    animation: 'shimmer 3s linear infinite',
  };
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* VIDEO BACKGROUND */}
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
          <div className="absolute inset-0 rounded-full border-4 border-amber-300" 
               style={{ animation: 'spin 30s linear infinite' }}></div>
          <div className="absolute inset-4 rounded-full border-2 border-amber-300" 
               style={{ animation: 'spin 20s linear infinite reverse' }}></div>
          <div className="absolute inset-8 rounded-full border border-amber-300 animate-pulse"></div>
          <div className="absolute inset-12 bg-amber-300 bg-opacity-20 rounded-full"></div>
        </div>
        
        {/* Main title with shimmer effect */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-10 text-transparent bg-clip-text tracking-wide text-center"
            style={shimmerStyle}>
          CONGRATULATIONS
        </h1>
        
        {/* Message */}
        <p className="font-serif text-xl md:text-4xl font-medium mb-10 text-yellow-100 max-w-3xl mx-auto leading-relaxed text-center">
          <span className="text-amber-300 font-bold">"You are the legend who turned mystery into mastery."</span>
        </p>
        
        <h2 className="font-serif text-3xl md:text-5xl font-bold mt-8 mb-6 text-white tracking-widest text-center">
          You have won
        </h2>
        
        <h3 className="font-serif text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text animate-pulse mb-16 tracking-wider text-center"
            style={{
              backgroundImage: 'linear-gradient(to right, #fcd34d, #fef3c7, #fcd34d)',
              backgroundSize: '200% auto',
            }}>
          Uncharted Lost Voyage
        </h3>
      </div>
      
      {/* Custom keyframes for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}