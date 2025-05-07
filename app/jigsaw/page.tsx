"use client";

import { useEffect, useState, useRef, useCallback } from "react";

// Define types
type PieceType = {
  row: number;
  col: number;
  size: number;
  newRow: number;
  newCol: number;
  pieceEle: HTMLDivElement | null;
  movePiece: (row: number, col: number) => void;
  createPiece: (container: HTMLDivElement) => void;
  removePiece: () => void;
};

type JigsawType = {
  init: (options: {
    container: HTMLDivElement;
    image: string;
    gridSize: number;
    onComplete?: () => void;
  }) => void;
  destroy: () => void;
};

type PuzzleLevel = {
  images: string[];
  theme: string;
  gridSize: number;
  hintText: string;
};

export default function JigsawPuzzle() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [containerSize, setContainerSize] = useState(512);
  const [completedPuzzles, setCompletedPuzzles] = useState<boolean[]>([false, false, false]);
  const [themeGuess, setThemeGuess] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const puzzleRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const jigsawInstancesRef = useRef<JigsawType[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const themeInputRef = useRef<HTMLInputElement>(null);

  const levels: PuzzleLevel[] = [
    {
      images: ['jerry1.png', 'mini.png', 'micky.png'],
      theme: 'mouse',
      gridSize: 4,
      hintText: "These characters are small and have one common thing in common..."
    },
    {
      images: ['superman.png', 'ironman.png', 'batman.png'],
      theme: 'superhero',
      gridSize: 4,
      hintText: "These iconic figures are heroes and have super abilities, some might say they are..."
    }
    // {
    //   images: ['lion.png', 'tiger.png', 'leopard.png'],
    //   theme: 'big cats',
    //   gridSize: 5,
    //   hintText: "These powerful predators are known for their strength and agility..."
    // }
  ];

  const colors = ['#795548', '#f44336', '#03a9f4'];

  const createJigsaw = useCallback(() => {
    class Jigsaw implements JigsawType {
      private container: HTMLDivElement | null = null;
      private puzzleImg: { url?: string; width?: number; height?: number } = {};
      private pieces: PieceType[] = [];
      private gridSize: number = 4;
      private puzzleWidth: number = 0;
      private puzzleHeight: number = 0;
      private emptyPosition: { row: number; col: number } = { row: 0, col: 0 };
      private onPuzzleComplete: () => void = () => {};
      private draggedPiece: PieceType | null = null;
      private dragStartX: number = 0;
      private dragStartY: number = 0;
      private pieceSize: number = 0;
      private initialized: boolean = false;

      init(options: { 
        container: HTMLDivElement; 
        image: string; 
        gridSize: number;
        onComplete?: () => void;
      }) {
        if (this.initialized) {
          this.destroy();
        }

        this.gridSize = Math.max(options.gridSize || 4, 3);
        this.container = options.container;
        
        if (options.onComplete) {
          this.onPuzzleComplete = options.onComplete;
        }
        
        // Get container dimensions
        const containerRect = this.container.getBoundingClientRect();
        this.puzzleWidth = containerRect.width;
        this.puzzleHeight = containerRect.height;
        
        this.loadPuzzleImage(options.image);
        this.initialized = true;
      }

      destroy() {
        // Remove all event listeners and clean up
        if (this.container) {
          this.container.innerHTML = '';
        }
        
        document.removeEventListener('mousemove', this.onDragMove);
        document.removeEventListener('mouseup', this.onDragEnd);
        document.removeEventListener('touchmove', this.onDragMove);
        document.removeEventListener('touchend', this.onDragEnd);
        
        this.pieces = [];
        this.draggedPiece = null;
        this.initialized = false;
      }

      private loadPuzzleImage(image: string) {
        const img = new Image();
        img.onload = () => {
          this.puzzleImg.url = img.src;
          
          if (this.container) {
            this.container.style.position = 'relative';
            this.container.style.touchAction = 'none'; // Prevent scrolling while dragging on touch devices
            this.container.style.overflow = 'hidden'; // Ensure pieces don't overflow
          }
          
          this.pieceSize = this.puzzleWidth / this.gridSize;
          this.preparePieces();
          setTimeout(() => {
            this.resetGame();
          }, 500);
        };
        img.onerror = () => {
          console.error("Failed to load image:", image);
          if (this.container) {
            this.container.innerHTML = '<div style="color: red; padding: 20px; text-align: center;">Failed to load image</div>';
          }
        };
        img.src = image;
      }

      private createPiece(row: number, col: number, size: number): PieceType {
        const piece: PieceType = {
          row,
          col,
          size,
          newRow: row,
          newCol: col,
          pieceEle: null,
          movePiece: function(row, col) {
            this.newRow = row;
            this.newCol = col;
            if (this.pieceEle) {
              this.pieceEle.style.transition = 'left 350ms, top 350ms';
              this.pieceEle.style.left = `${col * size}px`;
              this.pieceEle.style.top = `${row * size}px`;
            }
          },
          createPiece: (container) => {
            const pieceEle = document.createElement('div');
            pieceEle.style.position = 'absolute';
            pieceEle.style.left = `${col * size}px`;
            pieceEle.style.top = `${row * size}px`;
            pieceEle.style.height = `${size - 4}px`;
            pieceEle.style.width = `${size - 4}px`;
            pieceEle.style.margin = '2px';
            pieceEle.style.backgroundImage = `url(${this.puzzleImg.url})`;
            pieceEle.style.backgroundPositionX = `${col * size * -1}px`;
            pieceEle.style.backgroundPositionY = `${row * size * -1}px`;
            pieceEle.style.backgroundSize = `${this.puzzleWidth}px`;
            pieceEle.style.backgroundRepeat = 'no-repeat';
            pieceEle.style.cursor = 'grab';
            pieceEle.style.borderRadius = '4px';
            pieceEle.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            pieceEle.style.userSelect = 'none';
            
            // Add drag events
            pieceEle.addEventListener('mousedown', (e) => this.onDragStart(e, piece));
            pieceEle.addEventListener('touchstart', (e) => this.onDragStart(e, piece), { passive: false });
            
            container.appendChild(pieceEle);
            piece.pieceEle = pieceEle;
          },
          removePiece: function() {
            if (this.pieceEle && this.pieceEle.parentNode) {
              this.pieceEle.parentNode.removeChild(this.pieceEle);
            }
          }
        };
        
        return piece;
      }

      private onDragStart(e: MouseEvent | TouchEvent, piece: PieceType) {
        e.preventDefault();
        
        this.draggedPiece = piece;
        
        if (piece.pieceEle) {
          piece.pieceEle.style.transition = 'none';
          piece.pieceEle.style.zIndex = '100';
          piece.pieceEle.style.cursor = 'grabbing';
          
          // Get starting position
          const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
          const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
            
          // Calculate start position
          const rect = piece.pieceEle.getBoundingClientRect();
          this.dragStartX = clientX - rect.left;
          this.dragStartY = clientY - rect.top;
        }
        
        // Add move and end events
        if (e instanceof MouseEvent) {
          document.addEventListener('mousemove', this.onDragMove);
          document.addEventListener('mouseup', this.onDragEnd);
        } else {
          document.addEventListener('touchmove', this.onDragMove, { passive: false });
          document.addEventListener('touchend', this.onDragEnd);
        }
      }
      
      private onDragMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        
        if (!this.draggedPiece || !this.draggedPiece.pieceEle || !this.container) return;
        
        // Get current position
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        
        // Calculate container position
        const containerRect = this.container.getBoundingClientRect();
        
        // Position piece relative to container
        let left = clientX - containerRect.left - this.dragStartX;
        let top = clientY - containerRect.top - this.dragStartY;
        
        // Restrict movement within container bounds
        left = Math.max(0, Math.min(left, containerRect.width - this.pieceSize));
        top = Math.max(0, Math.min(top, containerRect.height - this.pieceSize));
        
        // Apply position
        this.draggedPiece.pieceEle.style.left = `${left}px`;
        this.draggedPiece.pieceEle.style.top = `${top}px`;
      };
      
      private onDragEnd = (e: MouseEvent | TouchEvent) => {
        if (!this.draggedPiece || !this.draggedPiece.pieceEle || !this.container) {
          this.cleanupDragEvents();
          return;
        }
        
        // Find the grid position based on current position
        const rect = this.draggedPiece.pieceEle.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        const relativeLeft = rect.left - containerRect.left;
        const relativeTop = rect.top - containerRect.top;
        
        // Calculate grid position
        const col = Math.round(relativeLeft / this.pieceSize);
        const row = Math.round(relativeTop / this.pieceSize);
        
        // Check if position is valid and empty
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize && !this.getPiece(row, col)) {
          // Reset z-index and cursor
          this.draggedPiece.pieceEle.style.zIndex = '';
          this.draggedPiece.pieceEle.style.cursor = 'grab';
          
          // Move piece to grid position
          const oldRow = this.draggedPiece.newRow;
          const oldCol = this.draggedPiece.newCol;
          
          this.draggedPiece.movePiece(row, col);
          this.emptyPosition = { row: oldRow, col: oldCol };
          
          // Check if puzzle is solved
          setTimeout(() => {
            this.checkPuzzleComplete();
          }, 400);
        } else {
          // Return to original position if not empty
          this.draggedPiece.pieceEle.style.transition = 'left 200ms, top 200ms';
          this.draggedPiece.pieceEle.style.left = `${this.draggedPiece.newCol * this.pieceSize}px`;
          this.draggedPiece.pieceEle.style.top = `${this.draggedPiece.newRow * this.pieceSize}px`;
          this.draggedPiece.pieceEle.style.zIndex = '';
          this.draggedPiece.pieceEle.style.cursor = 'grab';
        }
        
        this.draggedPiece = null;
        this.cleanupDragEvents();
      };
      
      private cleanupDragEvents() {
        document.removeEventListener('mousemove', this.onDragMove);
        document.removeEventListener('mouseup', this.onDragEnd);
        document.removeEventListener('touchmove', this.onDragMove);
        document.removeEventListener('touchend', this.onDragEnd);
      }

      private preparePieces() {
        if (!this.container) return;
        
        // Clear existing pieces
        this.pieces = [];
        this.container.innerHTML = '';
        
        const pieceSize = this.puzzleWidth / this.gridSize;
        
        for (let i = 0; i < this.gridSize; i++) {
          for (let j = 0; j < this.gridSize; j++) {
            // Skip the bottom-right corner to create empty space
            if (i === this.gridSize - 1 && j === this.gridSize - 1) {
              this.emptyPosition = { row: i, col: j };
              continue;
            }
            
            const piece = this.createPiece(i, j, pieceSize);
            piece.createPiece(this.container);
            this.pieces.push(piece);
          }
        }
      }

      private getPiece(row: number, col: number) {
        return this.pieces.find(piece => piece.newRow === row && piece.newCol === col) || null;
      }

      private shuffle(array: PieceType[]) {
        let currentIndex = array.length;
        let randomIndex;

        // Create a copy of the array to avoid modifying the original
        const shuffled = [...array];

        while (currentIndex !== 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
        }

        return shuffled;
      }

      private resetGame() {
        // Get shuffled positions
        const shuffledPieces = this.shuffle(this.pieces);
        let index = 0;
        
        for (let i = 0; i < this.gridSize; i++) {
          for (let j = 0; j < this.gridSize; j++) {
            if (i === this.gridSize - 1 && j === this.gridSize - 1) {
              this.emptyPosition = { row: i, col: j };
              continue;
            }
            
            if (index < shuffledPieces.length) {
              const piece = shuffledPieces[index];
              piece.movePiece(i, j);
              index++;
            }
          }
        }
      }

      private checkPuzzleComplete() {
        // Check if all pieces are in their original position
        const isComplete = this.pieces.every(piece => piece.row === piece.newRow && piece.col === piece.newCol);
        
        if (isComplete) {
          // Add visual feedback for completion
          if (this.container) {
            // Create a completion overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
            overlay.style.zIndex = '200';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.fontSize = '24px';
            overlay.style.fontWeight = 'bold';
            overlay.style.color = 'white';
            overlay.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
            overlay.innerText = 'Completed!';
            
            this.container.appendChild(overlay);
            
            // Remove the overlay after the navigation happens
            setTimeout(() => {
              if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
              }
            }, 1500);
          }
          
          this.onPuzzleComplete();
        }
      }
    }

    return new Jigsaw();
  }, []);

  // Initialize puzzles for the current level
  useEffect(() => {
    const handleResize = () => {
      const newSize = Math.min(window.innerWidth - 40, 512);
      setContainerSize(newSize);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Reset state when level changes
    setCurrentSlide(0);
    setCompletedPuzzles([false, false, false]);
    setThemeGuess("");
    setShowSuccessMessage(false);
    setShowFailureMessage(false);
    setPuzzleSolved(false);

    // Clean up previous jigsaw instances
    jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    jigsawInstancesRef.current = [];

    // Initialize all puzzles
    const currentLevelData = levels[currentLevel];
    const gridSize = currentLevelData.gridSize;
    
    puzzleRefs.forEach((ref, index) => {
      if (ref.current) {
        // Clear container
        ref.current.innerHTML = '';
        
        // Create jigsaw
        const jigsaw = createJigsaw();
        jigsawInstancesRef.current[index] = jigsaw;
        
        jigsaw.init({
          container: ref.current,
          image: `/images/${currentLevelData.images[index]}`,
          gridSize: gridSize,
          onComplete: () => {
            // Update completed puzzles
            setCompletedPuzzles(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            
            // Automatically move to next puzzle after completion
            if (index < 2) {
              setTimeout(() => {
                handleSlideChange(index + 1);
              }, 1500);
            } else if (themeInputRef.current) {
              // Focus on theme input after completing all puzzles
              setTimeout(() => {
                if (themeInputRef.current) themeInputRef.current.focus();
              }, 1000);
            }
          }
        });
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    };
  }, [createJigsaw, currentLevel]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const checkTheme = () => {
    const currentTheme = levels[currentLevel].theme;
    const userGuess = themeGuess.toLowerCase().trim();
    
    // Common synonyms for each theme
    const themeMatches: Record<string, string[]> = {
      'mouse': ['mice', 'cartoon mice', 'cartoon mouse', 'mickey mouse', 'rodent', 'rodents'],
      'superhero': ['superheroes', 'heroes', 'super heroes', 'super hero', 'comic book heroes'],
      'big cats': ['cats', 'felines', 'wild cats', 'large cats', 'big cat', 'predatory cats']
    };
    
    // Check if user guess matches the theme or its synonyms
    if (userGuess === currentTheme || (themeMatches[currentTheme] && themeMatches[currentTheme].includes(userGuess))) {
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      setPuzzleSolved(true);
      
      // Automatically hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } else {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      
      // Automatically hide failure message after 3 seconds
      setTimeout(() => {
        setShowFailureMessage(false);
      }, 3000);
    }
  };

  const moveToNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setPuzzleSolved(false);
    } else {
      // All levels completed
      alert("Congratulations! You've completed all puzzle levels!");
    }
  };

  const allPuzzlesCompleted = completedPuzzles.every(completed => completed);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-8" 
         style={{ backgroundColor: colors[currentSlide % colors.length] }}>
      
      {/* Game title */}
      <h1 className="text-yellow-300 text-3xl font-bold mb-6">
        Level {currentLevel + 1}: {puzzleSolved ? levels[currentLevel].theme.toUpperCase() : "???"}
      </h1>
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">How to Play</h2>
            <ol className="list-decimal pl-5 space-y-2 mb-6 text-gray-700">
              <li>Drag and drop puzzle pieces to solve all three puzzles.</li>
              <li>Navigate between puzzles using the thumbnails below the main puzzle.</li>
              <li>You must complete all three puzzles before you can guess the theme.</li>
              <li>Once all puzzles are solved, enter the common theme that connects all three images.</li>
              <li>Complete all levels to win the game!</li>
            </ol>
            <button 
              onClick={() => setShowInstructions(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="flex gap-2 mb-4">
        {completedPuzzles.map((completed, index) => (
          <div 
            key={index}
            className={`w-4 h-4 rounded-full ${completed ? 'bg-green-500' : 'bg-white/30'}`}
          />
        ))}
      </div>
      
      {/* Puzzle container */}
      <div 
        ref={wrapperRef}
        className="relative bg-white/80 shadow-lg rounded-lg p-2 overflow-hidden mb-4"
        style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
      >
        <div className="relative h-full w-full">
          {puzzleRefs.map((ref, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              ref={ref}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="flex gap-4 mt-2 mb-4">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white scale-110 shadow-lg' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          >
            <div 
              className="w-8 h-8 bg-cover bg-center rounded-full"
              style={{ backgroundImage: `url(/images/${levels[currentLevel].images[index]})` }}
            />
          </button>
        ))}
      </div>

      {/* Arrow navigation */}
      <div className="flex gap-8 mt-2 mb-6">
        <button
          onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 ${
            currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={currentSlide === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 6L9 12L15 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <button
          onClick={() => handleSlideChange(Math.min(2, currentSlide + 1))}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 ${
            currentSlide === 2 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
          }`}
          disabled={currentSlide === 2}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L15 12L9 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      {/* Hint and Theme Checking */}
      <div className="w-full max-w-lg px-4">
        {/* Hint box */}
        <div className="bg-gray-800/60 rounded-lg p-4 mb-4 text-white">
          <h3 className="font-bold text-lg mb-2">Hint:</h3>
          <p>{levels[currentLevel].hintText}</p>
        </div>
        
        {!allPuzzlesCompleted && (
          <div className="bg-yellow-500/20 border-l-4 border-yellow-500 p-3 mb-4 text-white">
            <strong>Note:</strong> You must solve all three puzzles before you can guess the theme.
          </div>
        )}
        
        {/* Theme input form */}
        <div className="flex gap-2">
          <input
            ref={themeInputRef}
            type="text"
            placeholder="What's the common theme?"
            value={themeGuess}
            onChange={(e) => setThemeGuess(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50 placeholder-white/70"
            disabled={!allPuzzlesCompleted || puzzleSolved}
          />
          <button
            onClick={checkTheme}
            disabled={!allPuzzlesCompleted || puzzleSolved || !themeGuess.trim()}
            className={`px-4 py-2 rounded-r-lg bg-yellow-300 text-gray-900 font-bold ${
              (!allPuzzlesCompleted || puzzleSolved || !themeGuess.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'
            }`}
          >
            Check
          </button>
        </div>
        
        {!allPuzzlesCompleted && (
          <div className="text-white text-sm mt-2">
            {completedPuzzles.filter(p => p).length} of 3 puzzles completed
          </div>
        )}
        
        {/* Success/Failure messages */}
        {showSuccessMessage && (
          <div className="bg-green-500 text-white rounded-lg p-3 mt-4 animate-pulse">
            Correct! Thats the theme!
          </div>
        )}
        
        {showFailureMessage && (
          <div className="bg-red-500 text-white rounded-lg p-3 mt-4 animate-pulse">
            Try again. Thats not the theme we are looking for.
          </div>
        )}
        
        {/* Next level button */}
        {puzzleSolved && (
          <button
            onClick={moveToNextLevel}
            className="w-full mt-4 px-4 py-3 rounded-lg bg-yellow-300 text-gray-900 font-bold hover:bg-yellow-400 transition-colors"
          >
            {currentLevel < levels.length - 1 ? "Next Level" : "Finish Game"}
          </button>
        )}
        
{/* Instructions button */}
<button
    onClick={() => setShowInstructions(true)}
    className="w-full mt-4 px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
  >
    How to Play
  </button>
</div>

      {/* Level counter */}
      <div className="mt-8 text-center text-white/70">
        Level {currentLevel + 1} of {levels.length}
      </div>
    </div>
  );
}