import { useEffect, useState } from 'react';
import { LENS_ZONES } from '../utils/constants';
import styles from '../styles/Home.module.css';

interface DragLensProps {
  x: number;
  y: number;
  lensType: string[];
  onUncover: (regionId: string) => void;
}

const DragLens: React.FC<DragLensProps> = ({ x, y, lensType, onUncover }) => {
  const [activeType, setActiveType] = useState('default');
  const [revealedZones, setRevealedZones] = useState<string[]>([]);

  // Switch lens type on lensType update
  useEffect(() => {
    if (lensType.includes('uv') && activeType === 'default') {
      const delay = setTimeout(() => {
        setActiveType('uv');
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [lensType, activeType]);

  // Toggle lens type on Spacebar press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' && lensType.includes('uv')) {
        e.preventDefault();
        setActiveType((prev) => (prev === 'default' ? 'uv' : 'default'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lensType]);

  // Check if the lens is over a reveal zone
  useEffect(() => {
    LENS_ZONES.forEach((zone) => {
      if (revealedZones.includes(zone.id)) return;

      // Calculate zone boundaries
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const zoneLeft = (zone.x / 100) * viewportWidth;
      const zoneTop = (zone.y / 100) * viewportHeight;
      const zoneRight = zoneLeft + (zone.width / 100) * viewportWidth;
      const zoneBottom = zoneTop + (zone.height / 100) * viewportHeight;

      // Check if lens center is inside zone and matches the required lens type
      if (
        x >= zoneLeft &&
        x <= zoneRight &&
        y >= zoneTop &&
        y <= zoneBottom &&
        zone.requiredLens === activeType
      ) {
        // Reveal this zone
        setRevealedZones((prev) => [...prev, zone.id]);
        onUncover(zone.region);
      }
    });
  }, [x, y, activeType, revealedZones, onUncover]);

  return (
    <>
      {/* Render lens-revealed content */}
      {LENS_ZONES.map((zone) => (
        <div
          key={zone.id}
          className={styles.lensReveal}
          style={{
            left: `${zone.x}%`,
            top: `${zone.y}%`,
            width: `${zone.width}%`,
            height: `${zone.height}%`,
            opacity: revealedZones.includes(zone.id) ? 1 : 0,
          }}
        >
          {zone.message}
        </div>
      ))}

      {/* Lens element follows cursor */}
      <div
        className={`${styles.lens} ${
          activeType === 'default' ? styles.defaultLens : styles.uvLens
        }`}
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      />
    </>
  );
};

export default DragLens;
