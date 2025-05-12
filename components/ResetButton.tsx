import React from 'react';

interface ResetButtonProps {
  className?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ className }) => {
  const handleReset = () => {
    // Clear session storage
    sessionStorage.removeItem('hoveredSequence');
    sessionStorage.removeItem('discoveredPlanets');
    sessionStorage.removeItem('solvedRiddles');
    
    // Reload the page to reset the game state
    window.location.reload();
  };

  return (
    <button 
      onClick={handleReset}
      className={className}
      style={{
        padding: '8px 15px',
        backgroundColor: '#cc3333',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
      }}
    >
      Reset Game
    </button>
  );
};

export default ResetButton;