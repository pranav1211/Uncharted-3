import { useState, useEffect } from 'react';
import { TEXT_CHALLENGE_ANSWER } from '../utils/constants';
import styles from '../styles/Home.module.css';


interface TextChallengeProps {
  onComplete: () => void;
  className?: string;
}

const TextChallenge: React.FC<TextChallengeProps> = ({ onComplete, className }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Check input against answer
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase());
    setError(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.toUpperCase() === TEXT_CHALLENGE_ANSWER) {
      setSuccess(true);
      // Trigger animation or effect here
      setTimeout(() => {
        onComplete();
      }, 1000);
    } else {
      setError(true);
      // Reset after showing error
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };
  
  return (
    <div className={`${styles.textChallenge} ${className || ''}`}>
      <h3>Final Challenge</h3>
      <p>Based on the secret riddles answer the quesion</p><br />
      <p>To find this riddle we need change our view. click on a certain key of the keyboard till use the lens(pointer) change, then hover to find the riddle</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter the answer"
          maxLength={10}
          style={{
            borderColor: error ? 'var(--error)' : success ? 'var(--success)' : '',
            animation: error ? 'flashError 0.5s' : '',
            backgroundColor: success ? 'rgba(16, 185, 129, 0.2)' : '',
          }}
        />
        <div style={{ height: '20px', marginTop: '10px' }}>
          {error && <span style={{ color: 'var(--error)' }}>Incorrect alignment. Try again.</span>}
          {success && <span style={{ color: 'var(--success)' }}>Alignment successful!</span>}
        </div>
      </form>
    </div>
  );
};

export default TextChallenge;