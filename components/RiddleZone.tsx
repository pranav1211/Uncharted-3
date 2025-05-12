import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';


interface RiddleZoneProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  riddle: string;
  answer: string;
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

const RiddleZone: React.FC<RiddleZoneProps> = ({
  id,
  x,
  y,
  width,
  height,
  riddle,
  answer,
  region,
  requiredPlanets,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Check session storage for discovered planets
  useEffect(() => {
    const checkDiscoveredPlanets = () => {
      const discoveredPlanets = getDiscoveredPlanets();
      const shouldBeActive = hasAllRequiredPlanets(requiredPlanets, discoveredPlanets);
      
      if (shouldBeActive && !isActive) {
        console.log(`Riddle zone ${id} activated: All required planets discovered`);
        setIsActive(true);
        setIsVisible(true);
      }
    };
    
    // Check immediately and set up interval
    checkDiscoveredPlanets();
    const interval = setInterval(checkDiscoveredPlanets, 300);
    
    return () => clearInterval(interval);
  }, [id, isActive, requiredPlanets]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    setError(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userAnswer.toLowerCase() === answer.toLowerCase()) {
      setSuccess(true);
      // Trigger animation or effect here
      setTimeout(() => {
        onComplete(region);
      }, 1000);
    } else {
      setError(true);
      // Reset after showing error
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={styles.riddleZone}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 0 15px rgba(100, 100, 255, 0.5)',
        zIndex: 1000,
      }}
    >
      <div className={styles.riddleContent}>
       
        <p>{riddle}</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Enter your answer"
            maxLength={20}
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '10px',
              borderRadius: '4px',
              border: error ? '2px solid red' : success ? '2px solid green' : '1px solid #ccc',
              backgroundColor: success ? 'rgba(16, 185, 129, 0.2)' : '',
            }}
          />
          <button 
            type="submit"
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              backgroundColor: '#3366cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Solve
          </button>
          <div style={{ height: '20px', marginTop: '10px' }}>
            {error && <span style={{ color: 'red' }}>Incorrect answer. Try again.</span>}
            {success && <span style={{ color: 'green' }}>Correct! Unlocking region...</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiddleZone;