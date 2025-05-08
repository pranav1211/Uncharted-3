// app/page.js
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cinzel } from 'next/font/google';

// Initialize the Cinzel font
const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

// Define TypeScript interface for particle
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function UnchartedLandingPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate random particles for the animated background
  useEffect(() => {
    const particleCount = 50;
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    
    setParticles(newParticles);
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          y: (particle.y + particle.speed) % 100,
          x: particle.x + (Math.random() - 0.5) * 0.2,
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsValid(value.toLowerCase() === 'start');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {      
      router.push('/scroll');
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-slate-900 overflow-hidden">
      {/* Animated background particles */}
      {particles.map((particle) => (
        <div 
          key={particle.id}
          className="absolute rounded-full bg-yellow-300"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px rgba(250, 204, 21, 0.6)`,
          }}
        />
      ))}
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="animate-fade-in-down px-4">
          <p className="text-2xl font-light mb-4 text-yellow-100 tracking-widest uppercase">Welcome to</p>
          <h1 className={`${cinzel.className} text-7xl font-extrabold mb-2 text-yellow-300 tracking-tight`} 
              style={{ textShadow: '0 0 15px rgba(250, 204, 21, 0.5)' }}>
            UNCHARTED
          </h1>
          <h2 className={`${cinzel.className} text-6xl font-semibold mb-16 text-slate-200 italic tracking-wider`}
              style={{ textShadow: '0 0 10px rgba(226, 232, 240, 0.3)' }}>
            LOST VOYAGE
          </h2>
          
          <div className="w-32 h-1 bg-yellow-500 mx-auto mb-16 rounded-full"></div>

          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter the secret word to begin..."
                className="w-full max-w-md mx-auto px-6 py-4 bg-transparent border-b-2 border-yellow-400/40 text-xl text-slate-200 focus:outline-none focus:border-yellow-500 transition-all duration-300 placeholder-slate-400/50"
              />
              <button 
                onClick={handleSubmit} 
                className={`mt-8 px-10 py-4 rounded-lg text-xl font-bold tracking-wider transition-all duration-500 ${
                  isValid 
                    ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-lg shadow-yellow-500/30' 
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/70 backdrop-blur-sm'
                }`}
              >
                EMBARK
              </button>
            </div>
            
            {showError && (
              <p className="text-red-400 mt-4 text-lg animate-pulse">
                {/* That's not the correct word. Try "start" to begin your journey. */}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-900 to-transparent"></div>
    </div>
  );
}