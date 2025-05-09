'use client';

// app/page.tsx
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function Home() {
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);
  const [stars, setStars] = useState<Array<{
    left: string;
    top: string;
    size: string;
    animationDuration: string;
    opacity: number;
  }>>([]);

  // Generate stars only once on component mount using useCallback
  // Define star type for TypeScript
  type Star = {
    left: string;
    top: string;
    size: string;
    animationDuration: string;
    opacity: number;
  };

  const generateStars = useCallback(() => {
    const newStars: Star[] = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${0.2 + Math.random() * 0.3}rem`,
      animationDuration: `${3 + Math.random() * 7}s`,
      opacity: Math.random() * 0.8 + 0.2
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    generateStars();
  }, [generateStars]);

  // Portal component to avoid repetition
  const Portal = ({ 
    color, 
    href, 
    isHovered, 
    onHoverChange 
  }: { 
    color: 'blue' | 'orange'; 
    href: string; 
    isHovered: boolean; 
    onHoverChange: (isHovered: boolean) => void;
  }) => {
    // Typed color configuration
    const colors: Record<'blue' | 'orange', {
      glow: string;
      outerRing: string;
      midRing: string;
      innerRing: string;
      gradient: string;
      center: string;
    }> = {
      blue: {
        glow: 'bg-blue-500',
        outerRing: 'border-blue-600',
        midRing: 'border-blue-400',
        innerRing: 'border-blue-300',
        gradient: 'from-blue-400 to-purple-600',
        center: 'from-blue-200 to-blue-400'
      },
      orange: {
        glow: 'bg-orange-500',
        outerRing: 'border-orange-600',
        midRing: 'border-orange-400',
        innerRing: 'border-orange-300',
        gradient: 'from-orange-400 to-red-600',
        center: 'from-orange-200 to-orange-400'
      }
    };

    const theme = colors[color];

    return (
      <Link 
        href={href} 
        className="w-1/2 max-w-md group"
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-1000 ${isHovered ? 'opacity-70' : 'opacity-20'} ${theme.glow}`}></div>
          
          <div className={`relative aspect-square rounded-full flex items-center justify-center transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}>
            {/* Portal rings */}
            <div className={`absolute w-full h-full rounded-full border-8 ${theme.outerRing} opacity-30 animate-pulse`}></div>
            <div className={`absolute w-5/6 h-5/6 rounded-full border-4 ${theme.midRing} opacity-40`} 
                 style={{ animation: 'spin 20s linear infinite' }}></div>
            <div className={`absolute w-2/3 h-2/3 rounded-full border-2 ${theme.innerRing} opacity-60`} 
                 style={{ animation: 'spin 15s linear infinite' }}></div>
            
            {/* Portal center */}
            <div className={`w-1/2 h-1/2 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-700`}>
              <div className={`w-3/4 h-3/4 rounded-full bg-gradient-to-b ${theme.center} opacity-80 flex items-center justify-center overflow-hidden`}>
                <div className="w-full h-full bg-gradient-to-t from-transparent to-white opacity-30 animate-pulse"></div>
                {isHovered && (
                  <div className="absolute text-white text-2xl font-light tracking-widest animate-pulse">ENTER</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  };
  
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
            opacity: star.opacity
          }}
        ></div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-5xl font-bold mb-16 text-center text-white tracking-wider">
          Choose Your Path
        </h1>
        
        <div className="flex flex-col md:flex-row w-full max-w-6xl gap-12 px-8 justify-center">
          {/* Left Portal */}
          <Portal 
            color="blue" 
            href="https://gradientaiml.tech/branchone"
            isHovered={hoverLeft}
            onHoverChange={setHoverLeft}
          />
          
          {/* Right Portal */}
          <Portal 
            color="orange" 
            href="https://gradientaiml.tech/branchtwo"
            isHovered={hoverRight}
            onHoverChange={setHoverRight}
          />
        </div>
      </div>

      {/* Custom keyframes for animations not available in Tailwind 4 */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}