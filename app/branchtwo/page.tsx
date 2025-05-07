'use client';
import React, { useState, useEffect } from 'react';

// Function to shuffle an array randomly
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Types for our game items
type EncryptedWord = {
  encrypted: string;
  answer: string;
  number?: number;
};

type CaesarSentence = {
  encrypted: EncryptedWord[];
  correctSentence: string;
};

// Function to assign random numbers between 1 and 9 to words
function assignRandomNumbers(words: EncryptedWord[]): EncryptedWord[] {
  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledNumbers = shuffleArray(availableNumbers);

  return words.map((word, index) => ({
    ...word,
    number: shuffledNumbers[index % availableNumbers.length],
  }));
}

// Caesar cipher sentences - shifted 5 places forward
const caesarSentences: CaesarSentence[] = [
  {
    encrypted: [
      { encrypted: 'Unwfyjx', answer: 'Pirates' },
      { encrypted: 'wfniji', answer: 'raided' },
      { encrypted: 'xmnux', answer: 'ships' },
      { encrypted: 'sjfw', answer: 'near' },
      { encrypted: 'Hzgf', answer: 'Cuba' },
    ],
    correctSentence: 'Pirates raided ships near Cuba'
  },
  {
    encrypted: [
      { encrypted: 'Ymnjajx', answer: 'Thieves' },
      { encrypted: 'jxhfuji', answer: 'escaped' },
      { encrypted: 'ymwtzlm', answer: 'through' },
      { encrypted: 'xjhwjy', answer: 'secret' },
      { encrypted: 'yzssjq', answer: 'tunnel' },
    ],
    correctSentence: 'Thieves escaped through secret tunnel'
  }
];

// Atbash cipher items (A→Z, B→Y, C→X, etc.)
const atbashItems: EncryptedWord[] = [
  { encrypted: 'kozgrmfn', answer: 'platinum' },
  { encrypted: 'tlow', answer: 'gold' },
  { encrypted: 'wrznlmw', answer: 'diamond' },
  { encrypted: 'hroevi', answer: 'silver' },
  { encrypted: 'yilmav', answer: 'bronze' },
];

// Stage 2 correct order (now using a single string for comparison)
const stage2CorrectString = "diamond platinum gold silver bronze";

export default function VaultBreaker() {
  const [level, setLevel] = useState<number>(1);
  const [inputCode, setInputCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('');
  const [shuffledItems, setShuffledItems] = useState<EncryptedWord[]>([]);
  const [decryptedSentence, setDecryptedSentence] = useState<string>('');
  const [selectedSentence, setSelectedSentence] = useState<CaesarSentence | null>(null);
  const [isVaultOpened, setIsVaultOpened] = useState<boolean>(false);
  const [stage2Input, setStage2Input] = useState<string>(''); // New state for stage 2 input string

  // Initialize game state when level changes
  useEffect(() => {
    if (level === 1) {
      const sentenceIndex = Math.floor(Math.random() * caesarSentences.length);
      const selected = caesarSentences[sentenceIndex];
      setSelectedSentence(selected);
      
      const itemsWithNumbers = assignRandomNumbers(selected.encrypted);
      setShuffledItems(shuffleArray([...itemsWithNumbers]));
      
      setDecryptedSentence('');
      
      setInputCode('');
      setMessage("Decrypt the cipher! Then arrange the words to form a proper sentence.");
      setMessageType('info');
    } else if (level === 2) {
      const itemsWithNumbers = assignRandomNumbers(atbashItems);
      setShuffledItems(shuffleArray([...itemsWithNumbers]));
      
      setInputCode('');
      setStage2Input(''); // Reset stage 2 input
      setMessage("Decrypt the cipher! Then order the items as per its value, from highest to lowest");
      setMessageType('info');
    }
  }, [level]);

  const handleSentenceChange = (value: string) => {
    setDecryptedSentence(value);
  };

  const handleStage2InputChange = (value: string) => {
    setStage2Input(value);
    // Generate the code based on the words entered
    if (value.trim()) {
      const words = value.trim().toLowerCase().split(/\s+/);
      const code = words.map(word => {
        const foundItem = shuffledItems.find(item => 
          item.answer.toLowerCase() === word.toLowerCase()
        );
        return foundItem ? foundItem.number : '';
      }).join('');
      setInputCode(code);
    } else {
      setInputCode('');
    }
  };

  const checkLevel1Solution = (): boolean => {
    // For level 1, check if the decrypted sentence matches the correct one
    if (!selectedSentence) return false;
    
    const userSentence = decryptedSentence.trim().toLowerCase();
    const correctSentence = selectedSentence.correctSentence.toLowerCase();
    
    return userSentence === correctSentence;
  };
  
  const checkLevel2Solution = (): boolean => {
    // For level 2, check if the entered items match the correct order string
    const userInput = stage2Input.trim().toLowerCase();
    return userInput === stage2CorrectString;
  };
  
  const handleSubmit = () => {
    if (level === 1) {
      if (checkLevel1Solution()) {
        setMessage('Excellent! First layer of security bypassed! Proceeding to Stage 2.');
        setMessageType('success');
        setLevel(2);
      } else {
        setMessage('Incorrect sentence. Make sure all words are decrypted correctly and the sentence makes sense!');
        setMessageType('error');
      }
    } else if (level === 2) {
      if (checkLevel2Solution()) {
        setMessage('Vault Opened! Treasures await!');
        setMessageType('success');
        setIsVaultOpened(true);
      } else {
        setMessage('Incorrect sequence. The order matters!');
        setMessageType('error');
      }
    }
  };

  const resetGame = () => {
    setLevel(1);
    setIsVaultOpened(false);
  };

  return (
    <div className="vault-container">
      <h1 className="vault-title">VAULT BREAKER</h1>
      
      <div className="vault-subtitle">
        SECURITY LEVEL {level}/2
      </div>
      
      <div className="vault-progress-container">
        <div className="vault-progress-bar" style={{ width: `${(level/2) * 100}%` }}></div>
      </div>
      
      <div className="vault-card">
        <p className="vault-hint">
          {level === 1 
            ? "Level 1: The vault hums: Step back 5 times to unlock the door" 
            : "Level 2: Mirror, mirror on the wall... find what's reflected in the opposite"}
        </p>
        
        {level === 1 ? (
          <div>
            <div className="encrypted-words-container">
              <p className="section-title">Encrypted words to decode:</p>
              <div className="words-grid">
                {shuffledItems.map((item, i) => (
                  <span key={i} className="encrypted-word">
                    {item.encrypted}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="input-section">
              <label className="input-label">
                Enter your decrypted sentence:
              </label>
              <textarea
                className="vault-input"
                placeholder="Type the full decrypted sentence here..."
                value={decryptedSentence}
                onChange={(e) => handleSentenceChange(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div>
            <ul className="items-list">
              {shuffledItems.map((item, i) => (
                <li key={i} className="list-item">
                  <span className="encrypted-text">
                    {item.encrypted}
                  </span>
                  <span className="number-badge">
                    {item.number}
                  </span>
                </li>
              ))}
            </ul>
            
            <div className="input-section">
              <label className="input-label">
                Enter the items in order (highest to lowest value):
              </label>
              <textarea
                className="vault-input"
                placeholder="Type the items in order, separated by spaces (e.g., 'diamond platinum gold...')"
                value={stage2Input}
                onChange={(e) => handleStage2InputChange(e.target.value)}
              />             
            </div>
          </div>
        )}
        
        <button className="vault-button" onClick={handleSubmit}>
          {level === 1 ? "CRACK FIRST LAYER" : "OPEN THE VAULT"}
        </button>
        
        {message && (
          <p className={`hint-message ${messageType === 'success' ? 'success' : messageType === 'error' ? 'error' : ''}`}>
            {message}
          </p>
        )}
      </div>

      {isVaultOpened && (
        <div className="vault-popup">
          <div className="vault-popup-content">
            <h2 className="success-title">VAULT OPENED! 🎉</h2>
            <p>Congratulations! You've successfully cracked both security layers and opened the vault!</p>
            <p>THe password to the final puzzle is : portal</p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* General body and background */
        :global(body) {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(45deg, #1a1a1a, #333);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          width: 100vw;
          overflow-x: hidden;
          color: #fff;
          box-sizing: border-box;
        }
        
        /* Vault container and overall layout */
        .vault-container {
          text-align: center;
          width: 100%;
          max-width: 800px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 12px;
          box-shadow: 0 0 50px rgba(0, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          margin: 20px auto;
        }
        
        /* Vault title */
        .vault-title {
          font-size: 2.5rem;
          color: #00ffcc;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.8);
          margin-bottom: 20px;
        }
        
        /* Vault subtitle */
        .vault-subtitle {
          font-size: 1.2rem;
          font-weight: bold;
          letter-spacing: 2px;
          color: #e3e3e3;
          margin-bottom: 20px;
        }
        
        /* Message feedback (hint or success message) */
        .hint-message {
          color: #ff0066;
          font-size: 1rem;
          margin-top: 15px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .hint-message.success {
          color: #00ffcc;
        }
        
        .hint-message.error {
          color: #ff0066;
        }
        
        /* Vault Card */
        .vault-card {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
          margin-bottom: 20px;
          transition: transform 0.3s ease;
        }
        
        /* Progress bar */
        .vault-progress-container {
          height: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          margin: 0 0 20px;
          overflow: hidden;
        }
        
        .vault-progress-bar {
          height: 100%;
          background: #00ffcc;
          border-radius: 5px;
          transition: width 0.5s ease;
        }
        
        /* List items in the game */
        .items-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .list-item {
          margin: 15px 0;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        /* Encrypted text display */
        .encrypted-text {
          color: #ff6b6b;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .number-badge {
          background-color: #00ffcc;
          color: #000;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 1.1rem;
        }
        
        /* Input sections */
        .input-section {
          margin: 20px 0;
        }
        
        .input-label {
          color: #e3e3e3;
          display: block;
          margin-bottom: 10px;
          font-size: 1.1rem;
          text-align: left;
        }
        
        .vault-input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 2px solid #00ffcc;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
          box-sizing: border-box;
          min-height: 100px;
        }
        
        .vault-input:focus {
          outline: none;
          border-color: #00ffaa;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
        }
        
        /* Code display section */
        .code-display {
          margin: 15px 0;
          padding: 10px;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 8px;
          border: 1px dashed #00ffcc;
        }
        
        .code-label {
          margin: 0 0 5px;
          color: #e3e3e3;
          font-size: 0.9rem;
        }
        
        .code-value {
          margin: 0;
          font-size: 1.8rem;
          color: #00ffcc;
          font-weight: bold;
          letter-spacing: 5px;
        }
        
        /* Vault button style */
        .vault-button {
          background: linear-gradient(135deg, #00b3b3, #009999);
          color: #fff;
          border: none;
          padding: 12px 25px;
          font-size: 1.2rem;
          font-weight: bold;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
          transition: 0.3s ease;
          width: 100%;
          margin-top: 20px;
        }
        
        .vault-button:hover {
          background: linear-gradient(135deg, #009999, #00b3b3);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
        }
        
        .vault-button:active {
          transform: scale(0.98);
        }
        
        /* Vault popup */
        .vault-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .vault-popup-content {
          background: linear-gradient(145deg, #333, #444);
          padding: 30px;
          border-radius: 10px;
          color: #fff;
          text-align: center;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          animation: popUpAnimation 0.5s ease-out;
          max-width: 500px;
          width: 90%;
        }
        
        .success-title {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #00ffcc;
        }
        
        .vault-popup-button {
          background-color: #00ffcc;
          color: #333;
          border: none;
          padding: 10px 20px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s ease;
          margin-top: 20px;
        }
        
        .vault-popup-button:hover {
          background-color: #00e6b8;
        }
        
        .vault-hint {
          color: #00ffcc;
          font-size: 1.2rem;
          margin-bottom: 20px;
          font-style: italic;
        }
        
        .section-title {
          color: #e3e3e3;
          margin-bottom: 15px;
          font-size: 1.1rem;
          text-align: left;
        }
        
        .encrypted-words-container {
          margin-bottom: 30px;
        }
        
        .words-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          justify-content: center;
        }
        
        .encrypted-word {
          background: rgba(0, 0, 0, 0.3);
          padding: 12px 18px;
          border-radius: 8px;
          color: #ff6b6b;
          font-weight: bold;
          font-size: 1.6rem;
        }
        
        @keyframes popUpAnimation {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* For small screens */
        @media (max-width: 600px) {
          .vault-title {
            font-size: 2rem;
          }
        
          .vault-card {
            padding: 20px;
          }
        
          .vault-input {
            font-size: 0.9rem;
          }
        
          .vault-button {
            font-size: 1rem;
            padding: 10px 20px;
          }
          
          .encrypted-word {
            font-size: 1.2rem;
          }
          
          .code-value {
            font-size: 1.4rem;
            letter-spacing: 3px;
          }
        }
      `}</style>
    </div>
  );
}