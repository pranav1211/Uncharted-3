import { useState, useCallback, useEffect } from 'react';
import styles from '../styles/Home.module.css';


interface HoverZoneProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tooltip: string;
  sequence: number;
  region: string;
  onComplete: (regionId: string) => void;
}

// Helper functions for session storage
const getHoveredSequence = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem('hoveredSequence') || '[]');
  } catch (error) {
    console.error('Error parsing hoveredSequence:', error);
    return [];
  }
};

const getDiscoveredPlanets = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem('discoveredPlanets') || '[]');
  } catch (error) {
    console.error('Error parsing discoveredPlanets:', error);
    return [];
  }
};

const saveHoveredSequence = (sequence: string[]): void => {
  sessionStorage.setItem('hoveredSequence', JSON.stringify(sequence));
};

const saveDiscoveredPlanets = (planets: string[]): void => {
  sessionStorage.setItem('discoveredPlanets', JSON.stringify(planets));
};

const HoverZone: React.FC<HoverZoneProps> = ({
  id,
  x,
  y,
  width,
  height,
  tooltip,
  sequence,
  region,
  onComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDiscovered, setIsDiscovered] = useState(false);

  // Check if this planet is already discovered when component mounts
  useEffect(() => {
    const discoveredPlanets = getDiscoveredPlanets();
    if (discoveredPlanets.includes(id)) {
      setIsDiscovered(true);
    }
  }, [id]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);

    // Retrieve current state from session storage
    const hoveredSequence = getHoveredSequence();
    const discoveredPlanets = getDiscoveredPlanets();

    // Check if we need to reset sequence (out of order hover)
    if (hoveredSequence.length > 0) {
      const lastHoveredId = hoveredSequence[hoveredSequence.length - 1];
      const lastHoveredZone = HOVER_ZONES.find(z => z.id === lastHoveredId);
      const lastSequence = lastHoveredZone ? lastHoveredZone.sequence : -1;

      if (sequence !== lastSequence + 1) {
        console.log(`Sequence broken: expected ${lastSequence + 1}, got ${sequence}`);
        saveHoveredSequence([id]);
        return;
      }
    }

    // Add to sequence if not already included
    if (!hoveredSequence.includes(id)) {
      const updatedSequence = [...hoveredSequence, id];
      saveHoveredSequence(updatedSequence);
    }
    
    // Mark this planet as discovered if it's not already
    if (!discoveredPlanets.includes(id)) {
      const updatedPlanets = [...discoveredPlanets, id];
      saveDiscoveredPlanets(updatedPlanets);
      setIsDiscovered(true);
      
      console.log(`Planet ${id} discovered. Total discovered: ${updatedPlanets.length}`);
      console.log('Discovered planets:', updatedPlanets);
      
      // Light up the region when a planet is discovered
      onComplete(region);
    }
  }, [id, sequence, region, onComplete]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`${styles.hoverZone} ${isDiscovered ? styles.discoveredZone : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-sequence={sequence}
      data-region={region}
    >
      {isHovered && <div className={styles.tooltip}>{tooltip}</div>}
    </div>
  );
};

// Import this here to avoid circular dependency issues
import { HOVER_ZONES } from '../utils/constants';

export default HoverZone;
// import { useState, useCallback } from 'react';
// import styles from '../styles/Home.module.css';

// interface HoverZoneProps {
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   tooltip: string;
//   sequence: number;
//   region: string;
//   onComplete: (regionId: string) => void;
// }

// // Helper functions for session storage
// const getHoveredSequence = (): string[] => {
//   try {
//     return JSON.parse(sessionStorage.getItem('hoveredSequence') || '[]');
//   } catch (error) {
//     console.error('Error parsing hoveredSequence:', error);
//     return [];
//   }
// };

// const getRegisteredRegions = (): string[] => {
//   try {
//     return JSON.parse(sessionStorage.getItem('registeredRegions') || '[]');
//   } catch (error) {
//     console.error('Error parsing registeredRegions:', error);
//     return [];
//   }
// };

// const saveHoveredSequence = (sequence: string[]): void => {
//   sessionStorage.setItem('hoveredSequence', JSON.stringify(sequence));
// };

// const saveRegisteredRegions = (regions: string[]): void => {
//   sessionStorage.setItem('registeredRegions', JSON.stringify(regions));
// };

// const HoverZone: React.FC<HoverZoneProps> = ({
//   id,
//   x,
//   y,
//   width,
//   height,
//   tooltip,
//   sequence,
//   region,
//   onComplete,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseEnter = useCallback(() => {
//     setIsHovered(true);

//     // Retrieve current state from session storage
//     const hoveredSequence = getHoveredSequence();
//     const registeredRegions = getRegisteredRegions();

//     // Check if we need to reset sequence (out of order hover)
//     if (hoveredSequence.length > 0) {
//       const lastHoveredId = hoveredSequence[hoveredSequence.length - 1];
//       const lastHoveredSequence = parseInt(lastHoveredId.split('-')[1] || '0', 10);

//       if (sequence !== lastHoveredSequence + 1) {
//         // Reset the sequence if out of order
//         saveHoveredSequence([id]);
//         return;
//       }
//     }

//     // Add to sequence if not already included
//     if (!hoveredSequence.includes(id)) {
//       const updatedSequence = [...hoveredSequence, id];
//       saveHoveredSequence(updatedSequence);
      
//       // Add region if not already present
//       if (!registeredRegions.includes(region)) {
//         const updatedRegions = [...registeredRegions, region];
//         saveRegisteredRegions(updatedRegions);
//       }

//       // Check if this completes a sequence
//       const idsInSameRegion = updatedSequence.filter((hid: string) =>
//         hid.startsWith(region.split('-')[0])
//       );

//       if (idsInSameRegion.length >= 2) {
//         onComplete(region);
//         // Reset sequence after completion
//         saveHoveredSequence([]);
//       }
//     }
//   }, [id, sequence, region, onComplete]);

//   const handleMouseLeave = useCallback(() => {
//     setIsHovered(false);
//   }, []);

//   return (
//     <div
//       className={styles.hoverZone}
//       style={{
//         left: `${x}%`,
//         top: `${y}%`,
//         width: `${width}%`,
//         height: `${height}%`,
//       }}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       data-sequence={sequence}
//       data-region={region}
//     >
//       {isHovered && <div className={styles.tooltip}>{tooltip}</div>}
//     </div>
//   );
// };

// export default HoverZone;

// import { useState, useEffect } from 'react';
// import styles from '../styles/Home.module.css';

// interface HoverZoneProps {
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   tooltip: string;
//   sequence: number;
  
//   region: string;
//   onComplete: (regionId: string) => void;
// }

// // Track the global sequence state
// let hoveredSequence: string[] = [];
// export const register: string[] = []; // Exported array to store all hovered regions

// const HoverZone: React.FC<HoverZoneProps> = ({
//   id,
//   x,
//   y,
//   width,
//   height,
//   tooltip,
//   sequence,
//   region,
//   onComplete
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
  
//   // Handle hover sequence tracking
//   const handleMouseEnter = () => {
//     setIsHovered(true);

//     // Clear sequence if hovering out of order
//     if (hoveredSequence.length > 0 && hoveredSequence[hoveredSequence.length - 1] !== id) {
//       const lastHoveredId = hoveredSequence[hoveredSequence.length - 1];
//       const lastHoveredSequence = parseInt(lastHoveredId.split('-')[1] || '0');
      
//       if (sequence !== lastHoveredSequence + 1) {
//         hoveredSequence = [id];
//         return;
//       }
//     }

//     // Add to sequence
//     if (!hoveredSequence.includes(id)) {
//       hoveredSequence.push(id);
      
//       // Add region to the register array if not already present
//       if (!register.includes(region)) {
//         register.push(region);
//       }

//       // Check if this completes a sequence
//       const idsInSameRegion = hoveredSequence.filter(hid => 
//         hid.startsWith(region.split('-')[0])
//       );
      
//       // If we have a complete sequence for this region
//       if (idsInSameRegion.length >= 2) {
//         onComplete(region);
//         // Reset sequence after completion
//         hoveredSequence = [];
//       }
//     }
//   };
  
//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };
  
//   return (
//     <div
//       className={styles.hoverZone}
//       style={{
//         left: `${x}%`,
//         top: `${y}%`,
//         width: `${width}%`,
//         height: `${height}%`,
//       }}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div className={styles.tooltip}>
//         {tooltip}
//       </div>
//     </div>
//   );
// };

// export default HoverZone;



// import { useState, useEffect } from 'react';
// import styles from '../styles/Home.module.css';

// interface HoverZoneProps {
//   id: string;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   tooltip: string;
//   sequence: number;
//   region: string;
//   onComplete: (regionId: string) => void;
// }

// // Track the global sequence state
// let hoveredSequence: string[] = [];

// const HoverZone: React.FC<HoverZoneProps> = ({
//   id,
//   x,
//   y,
//   width,
//   height,
//   tooltip,
//   sequence,
//   region,
//   onComplete
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
  
//   // Handle hover sequence tracking
//   const handleMouseEnter = () => {
//     setIsHovered(true);
    
//     // Clear sequence if hovering out of order
//     if (hoveredSequence.length > 0 && hoveredSequence[hoveredSequence.length - 1] !== id) {
//       const lastHoveredId = hoveredSequence[hoveredSequence.length - 1];
//       const lastHoveredSequence = parseInt(lastHoveredId.split('-')[1] || '0');
      
//       if (sequence !== lastHoveredSequence + 1) {
//         hoveredSequence = [id];
//         return;
//       }
//     }
    
//     // Add to sequence
//     if (!hoveredSequence.includes(id)) {
//       hoveredSequence.push(id);
      
//       // Check if this completes a sequence
//       const idsInSameRegion = hoveredSequence.filter(hid => 
//         hid.startsWith(region.split('-')[0])
//       );
      
//       // If we have a complete sequence for this region
//       if (idsInSameRegion.length >= 2) {
//         onComplete(region);
//         // Reset sequence after completion
//         hoveredSequence = [];
//       }
//     }
//   };
  
//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };
  
//   return (
//     <div
//       className={styles.hoverZone}
//       style={{
//         left: `${x}%`,
//         top: `${y}%`,
//         width: `${width}%`,
//         height: `${height}%`,
//       }}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div className={styles.tooltip}>
//         {tooltip}
//       </div>
//     </div>
//   );
// };

// export default HoverZone;
