import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameStateContextType {
  litRegions: string[];
  lightUpRegion: (regionId: string) => void;
  lensType: string[];
  unlockUVLens: () => void;
  isGameComplete: boolean;
  allRegionsLit: boolean;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [litRegions, setLitRegions] = useState<string[]>([]);
  const [lensType, setLensType] = useState<string[]>(['default']);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [allRegionsLit, setAllRegionsLit] = useState(false);
  
  // Check if all regions are lit from constants
  useEffect(() => {
    // This will be replaced with actual count from constants
    const totalRegions = 7; 
    
    if (litRegions.length >= totalRegions) {
      setAllRegionsLit(true);
    }
  }, [litRegions]);
  
  const lightUpRegion = (regionId: string) => {
    if (!litRegions.includes(regionId)) {
      // Visual feedback for success - could be enhanced
      const newLitRegions = [...litRegions, regionId];
      setLitRegions(newLitRegions);
      
    
    }
  };
  
  const unlockUVLens = () => {
    if (!lensType.includes('uv')) {
      setLensType([...lensType, 'uv']);
     
    }
  };
  
  const resetGame = () => {
    setLitRegions([]);
    setLensType(['default']);
    setIsGameComplete(false);
    setAllRegionsLit(false);
  };
  
  return (
    <GameStateContext.Provider
      value={{
        litRegions,
        lightUpRegion,
        lensType,
        unlockUVLens,
        isGameComplete,
        allRegionsLit,
        resetGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};