'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import HoverZone from '../../components/HoverZone';
import DragLens from '../../components/DragLens';
import RiddleZone from '../../components/RiddleZone';
import TextChallenge from '../../components/TextChallenge';
import ResetButton from '../../components/ResetButton';
import { GameStateProvider, useGameState } from '../../utils/gameState';
import { REGIONS, HOVER_ZONES, RIDDLE_ZONES, LENS_ZONES } from '../../utils/constants';
import '../../styles/globals.css';
import styles from '../../styles/Home.module.css';

// Helper functions for session storage
const getDiscoveredPlanets = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(sessionStorage.getItem('discoveredPlanets') || '[]');
  } catch (error) {
    console.error('Error parsing discoveredPlanets:', error);
    return [];
  }
};

export default function ChronoScapePage() {
  return (
    <>
      <Head>
        <title>Chronoscape Lite</title>
        <meta name="description" content="A space-time exploration puzzle" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameStateProvider>
        <GameContent />
      </GameStateProvider>
    </>
  );
}

function GameContent() {
  const { litRegions, lightUpRegion, isGameComplete, lensType, unlockUVLens, allRegionsLit } = useGameState();
  const [showTextChallenge, setShowTextChallenge] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [finalMessage, setFinalMessage] = useState('');
  const [discoveredPlanets, setDiscoveredPlanets] = useState([]);
  const [solvedRiddles, setSolvedRiddles] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showInstructions, setShowInstructions] = useState(false); // State for instructions visibility

  // Initialize session storage if needed
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!sessionStorage.getItem('hoveredSequence')) {
      sessionStorage.setItem('hoveredSequence', JSON.stringify([]));
    }
    if (!sessionStorage.getItem('discoveredPlanets')) {
      sessionStorage.setItem('discoveredPlanets', JSON.stringify([]));
    }
    if (!sessionStorage.getItem('solvedRiddles')) {
      sessionStorage.setItem('solvedRiddles', JSON.stringify([]));
    }
  }, []);

  // Monitor discovered planets from session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const interval = setInterval(() => {
      const planets = getDiscoveredPlanets();
      setDiscoveredPlanets(planets);

      try {
        const riddles = JSON.parse(sessionStorage.getItem('solvedRiddles') || '[]');
        setSolvedRiddles(riddles);
      } catch (error) {
        console.error('Error parsing solvedRiddles:', error);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check for stage progress
  useEffect(() => {
    if ((solvedRiddles.length >= 3 || litRegions.length >= 7) && !showTextChallenge) {
      setShowTextChallenge(true);
    }
  }, [discoveredPlanets, lensType, unlockUVLens, litRegions, showTextChallenge, solvedRiddles]);

  const handleChallengeComplete = () => {
    setFinalMessage("You've unlocked the secrets of the Chronoscape. The cosmic threads of time are now visible to you. The password is : stars");
  };

  const handleRiddleSolved = (regionId: string, riddleId: string) => {
    lightUpRegion(regionId);

    const updatedSolvedRiddles = [...solvedRiddles, riddleId];
    setSolvedRiddles(updatedSolvedRiddles);

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('solvedRiddles', JSON.stringify(updatedSolvedRiddles));
    }

    if (updatedSolvedRiddles.length >= RIDDLE_ZONES.length && !showTextChallenge) {
      setShowTextChallenge(true);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.gameArea}
        style={{
          background: allRegionsLit ? 'url(/starfield-bg.jpg)' : 'black',
          transition: 'background 2s ease-in-out',
        }}
      >
        {/* Reset Button */}
        <ResetButton className={styles.resetButtonPosition} />

        {/* Instructions Toggle Button */}
        <button
          className={styles.instructionsButton}
          onClick={() => setShowInstructions(!showInstructions)}
        >
          {showInstructions ? "Hide Instructions" : "Show Instructions"}
        </button>

        {/* Instructions Panel */}
        {showInstructions && (
          <div className={styles.instructionsPanel}>
            <p>Find the planets in order. If you go over something out of order, click Reset to start over. even if you hover over the wrong one, start again.</p>
          </div>
        )}

        {/* Debug info - remove in production */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            zIndex: 1000,
          }}
        >
          Discovered Planets: {discoveredPlanets.length}
          <br />
          Planets: {discoveredPlanets.join(', ')}
          <br />
          Solved Riddles: {solvedRiddles.length}
        </div>

        {/* Render all regions */}
        {REGIONS.map((region) => (
          <div
            key={region.id}
            className={`${styles.region} ${litRegions.includes(region.id) ? styles.litRegion : ''}`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`,
            }}
          />
        ))}

        {/* Render hover zones */}
        {HOVER_ZONES.map((zone) => (
          <HoverZone
            key={zone.id}
            id={zone.id}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            tooltip={zone.tooltip}
            sequence={zone.sequence}
            region={zone.region}
            onComplete={(regionId) => lightUpRegion(regionId)}
          />
        ))}

        {/* Render riddle zones */}
        {RIDDLE_ZONES.map((zone) => (
          <RiddleZone
            key={zone.id}
            id={zone.id}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            riddle={zone.riddle}
            answer={zone.answer}
            region={zone.region}
            requiredPlanets={zone.requiredPlanets}
            onComplete={(regionId) => handleRiddleSolved(regionId, zone.id)}
          />
        ))}

        {/* Draggable Lens Component */}
        <DragLens
          x={mousePos.x}
          y={mousePos.y}
          lensType={lensType}
          onUncover={(regionId) => lightUpRegion(regionId)}
        />

        {/* Text challenge */}
        {showTextChallenge && (
          <TextChallenge
            onComplete={handleChallengeComplete}
            className={styles.textChallenge}
          />
        )}

        {/* Final message and next button */}
        {finalMessage && (
          <div className={styles.finalMessage}>
            <p>{finalMessage}</p>
            {showNextButton && (
              <button className={styles.nextButton}>
                Continue the Journey
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}