import { useState, useEffect } from 'react';
import styles from './app/styles/Home.module.css';

interface InkZoneProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  message: string;
  region: string;
  requiredPlanets: string[];
  onComplete: (regionId: string) => void;
}

// Helper function to get discovered planets from session storage
const getDiscoveredPlanets = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem('discoveredPlanets') || '[]');
  } catch (error) {
    console.error('Error parsing discoveredPlanets:', error);
    return [];
  }
};

// Helper function to check if all required planets have been discovered
const hasAllRequiredPlanets = (required: string[], discovered: string[]): boolean => {
  return required.every(planet => discovered.includes(planet));
};

const InkZone: React.FC<InkZoneProps> = ({
  id,
  x,
  y,
  width,
  height,
  message,
  region,
  requiredPlanets,
  onComplete,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Check session storage for discovered planets
  useEffect(() => {
    const checkDiscoveredPlanets = () => {
      const discoveredPlanets = getDiscoveredPlanets();
      const shouldBeActive = hasAllRequiredPlanets(requiredPlanets, discoveredPlanets);
      
      if (shouldBeActive && !isActive) {
        console.log(`Ink zone ${id} activated: All required planets discovered`);
        setIsActive(true);
        
        // Auto-reveal immediately when all requirements are met
        if (!isRevealed) {
          console.log(`Auto-revealing ink zone: ${id}`);
          setIsRevealed(true);
          onComplete(region);
        }
      }
    };
    
    // Check immediately and set up interval
    checkDiscoveredPlanets();
    const interval = setInterval(checkDiscoveredPlanets, 300);
    
    return () => clearInterval(interval);
  }, [id, isActive, isRevealed, onComplete, region, requiredPlanets]);

  return (
    <div
      className={styles.inkZone}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        pointerEvents: 'none', // Always non-interactive as we auto-reveal
        backgroundColor: isActive && !isRevealed ? 'rgba(100, 100, 255, 0.1)' : 'transparent',
      }}
    >
      <div
        className={`${styles.inkMessage} ${isRevealed ? styles.inkRevealed : ''}`}
      >
        {message}
      </div>
    </div>
  );
};

export default InkZone;

// import { useState, useEffect } from 'react';
// import styles from '../styles/Home.module.css';

// interface InkZoneProps {
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   message: string;
//   region: string;
//   onComplete: (regionId: string) => void;
//   active: boolean;
// }

// // Helper function to get registered regions from session storage
// const getRegisteredRegions = (): string[] => {
//   try {
//     return JSON.parse(sessionStorage.getItem('registeredRegions') || '[]');
//   } catch (error) {
//     console.error('Error parsing registeredRegions:', error);
//     return [];
//   }
// };

// const InkZone: React.FC<InkZoneProps> = ({
//   id,
//   x,
//   y,
//   width,
//   height,
//   message,
//   region,
//   onComplete,
//   active
// }) => {
//   const [isRevealed, setIsRevealed] = useState(false);
//   const [isActive, setIsActive] = useState(active);

//   // Check session storage directly to ensure component updates properly
//   useEffect(() => {
//     const checkSessionStorage = () => {
//       const regions = getRegisteredRegions();
//       // Update active state based on registered regions count
//       setIsActive(regions.length >= 3 || active);
//     };

//     // Check immediately and set up interval
//     checkSessionStorage();
//     const interval = setInterval(checkSessionStorage, 100);
    
//     return () => clearInterval(interval);
//   }, [active]);

//   // Handle reveal on hover
//   const handleMouseEnter = () => {
//     if (!isRevealed && isActive) {
//       console.log('Revealing ink zone:', id);
//       setIsRevealed(true);
//       onComplete(region);
//     }
//   };

//   return (
//     <div
//       className={styles.inkZone}
//       style={{
//         left: `${x}%`,
//         top: `${y}%`,
//         width: `${width}%`,
//         height: `${height}%`,
//         pointerEvents: isActive ? 'auto' : 'none',
//         // Add a subtle indicator when active but not revealed
//         backgroundColor: isActive && !isRevealed ? 'rgba(100, 100, 255, 0.1)' : 'transparent',
//         cursor: isActive && !isRevealed ? 'pointer' : 'default',
//       }}
//       onMouseEnter={handleMouseEnter}
//     >
//       <div
//         className={`${styles.inkMessage} ${isRevealed ? styles.inkRevealed : ''}`}
//       >
//         {message}
//       </div>
//     </div>
//   );
// };

// export default InkZone;

// // import { useState } from 'react';
// // import styles from '../styles/Home.module.css';

// // interface InkZoneProps {
// //   id: string;
// //   x: number;
// //   y: number;
// //   width: number;
// //   height: number;
// //   message: string;
// //   region: string;
// //   onComplete: (regionId: string) => void;
// //   active: boolean;
// // }

// // const InkZone: React.FC<InkZoneProps> = ({
// //   id,
// //   x,
// //   y,
// //   width,
// //   height,
// //   message,
// //   region,
// //   onComplete,
// //   active
// // }) => {
// //   const [isRevealed, setIsRevealed] = useState(false);

// //   // Handle immediate reveal on hover
// //   const handleMouseEnter = () => {
// //     if (!isRevealed && active) {
// //       setIsRevealed(true);
// //       onComplete(region);
// //     }
// //   };

// //   // Only make the zone interactive if it's active
// //   const pointerEvents = active ? 'auto' : 'none';

// //   return (
// //     <div
// //       className={styles.inkZone}
// //       style={{
// //         left: `${x}%`,
// //         top: `${y}%`,
// //         width: `${width}%`,
// //         height: `${height}%`,
// //         pointerEvents,
// //       }}
// //       onMouseEnter={handleMouseEnter}
// //     >
// //       <div
// //         className={`${styles.inkMessage} ${isRevealed ? styles.inkRevealed : ''}`}
// //       >
// //         {message}
// //       </div>
// //     </div>
// //   );
// // };

// // export default InkZone;
