"use client";

import { useEffect, useState, useRef } from "react";
import { useCallback } from "react";

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
  
  const slide0Ref = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const levels: PuzzleLevel[] = [
    {
      images: ['jerry1.png', 'mini.png', 'micky.png'],
      theme: 'mouse',
      gridSize: 4,
      hintText: "These characters are small and have a talent for outsmarting their enemies..."
    },
    {
      images: ['superman.png', 'ironman.png', 'batman.png'],
      theme: 'superhero',
      gridSize: 4,
      hintText: "These iconic figures wear costumes and have extraordinary abilities..."
    }
  ];

  const colors = ['#795548', '#f44336', '#03a9f4'];

  const createJigsaw = useCallback(() => {
    class Jigsaw implements JigsawType {
      private container: HTMLDivElement | null = null;
      private puzzleImg: { url?: string; width?: number; height?: number } = {};
      private pieces: PieceType[] = [];
      private gridSize: number = 4;
      private widthFactor: number = 1;
      private heightFactor: number = 1;
      private puzzleWidth: number = Math.min(window.innerWidth, 512) - 20;
      private puzzleHeight: number = Math.min(window.innerWidth, 512) - 20;
      private emptyPosition: { row: number; col: number } = { row: 0, col: 0 };
      private onPuzzleComplete: () => void = () => {};
      private draggedPiece: PieceType | null = null;
      private dragStartX: number = 0;
      private dragStartY: number = 0;
      private pieceSize: number = 0;

      init(options: { 
        container: HTMLDivElement; 
        image: string; 
        gridSize: number;
        onComplete?: () => void;
      }) {
        this.gridSize = Math.max(options.gridSize || 4, 3);
        this.container = options.container;
        if (options.onComplete) {
          this.onPuzzleComplete = options.onComplete;
        }
        this.loadPuzzleImage(options.image);
      }

      private loadPuzzleImage(image: string) {
        const img = document.createElement('img');
        img.onload = (e) => {
          this.puzzleImg.height = img.naturalHeight;
          this.puzzleImg.width = img.naturalWidth;
          this.widthFactor = this.puzzleWidth / img.naturalWidth;
          this.heightFactor = this.puzzleHeight / img.naturalHeight;
          this.puzzleImg.url = img.src;
          
          if (this.container) {
            this.container.style.width = `${this.puzzleWidth}px`;
            this.container.style.height = `${this.puzzleHeight}px`;
            this.container.style.position = 'relative';
            this.container.style.touchAction = 'none'; // Prevent scrolling while dragging on touch devices
          }
          
          this.pieceSize = this.puzzleWidth / this.gridSize;
          this.preparePieces();
          setTimeout(() => {
            this.resetGame();
          }, 1000);
        };
        img.src = image || 'jerry1.png';
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
              this.pieceEle.style.left = `${this.newRow * size}px`;
              this.pieceEle.style.top = `${this.newCol * size}px`;
            }
          },
          createPiece: (container) => {
            const pieceEle = document.createElement('div');
            pieceEle.style.position = 'absolute';
            pieceEle.style.left = `${row * size}px`;
            pieceEle.style.top = `${col * size}px`;
            pieceEle.style.height = `${size - 4}px`;
            pieceEle.style.width = `${size - 4}px`;
            pieceEle.style.margin = '2px';
            pieceEle.style.backgroundImage = `url(${this.puzzleImg.url})`;
            pieceEle.style.backgroundPositionX = `${row * size * -1}px`;
            pieceEle.style.backgroundPositionY = `${col * size * -1}px`;
            pieceEle.style.backgroundSize = `${this.puzzleWidth}px`;
            pieceEle.style.backgroundRepeat = 'no-repeat';
            pieceEle.style.cursor = 'grab';
            pieceEle.style.borderRadius = '4px';
            pieceEle.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            pieceEle.style.userSelect = 'none';
            pieceEle.setAttribute('draggable', 'true');
            
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
        const col = Math.round(relativeTop / this.pieceSize);
        const row = Math.round(relativeLeft / this.pieceSize);
        
        // Check if position is empty
        if (!this.getPiece(row, col)) {
          // Reset z-index and cursor
          this.draggedPiece.pieceEle.style.zIndex = '';
          this.draggedPiece.pieceEle.style.cursor = 'grab';
          
          // Move piece to grid position
          const oldRow = this.draggedPiece.newRow;
          const oldCol = this.draggedPiece.newCol;
          
          this.draggedPiece.movePiece(row, col);
          this.emptyPosition = { row: oldRow, col: oldCol };
          
          // Check if puzzle is solved
          this.checkPuzzleComplete();
        } else {
          // Return to original position if not empty
          this.draggedPiece.pieceEle.style.transition = 'left 200ms, top 200ms';
          this.draggedPiece.pieceEle.style.left = `${this.draggedPiece.newRow * this.pieceSize}px`;
          this.draggedPiece.pieceEle.style.top = `${this.draggedPiece.newCol * this.pieceSize}px`;
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
        
        const pieceSize = this.puzzleWidth / this.gridSize;
        
        for (let i = 0; i < this.gridSize; i++) {
          for (let j = 0; j < this.gridSize; j++) {
            const piece = this.createPiece(i, j, pieceSize);
            piece.createPiece(this.container);
            this.pieces.push(piece);
          }
        }
        
        // Remove last piece to create empty space
        this.pieces.pop()?.removePiece();
        this.emptyPosition = { row: this.gridSize - 1, col: this.gridSize - 1 };
      }

      private getPiece(row: number, col: number) {
        for (let i = 0; i < this.pieces.length; i++) {
          const currPiece = this.pieces[i];
          if (currPiece.newRow === row && currPiece.newCol === col) {
            return currPiece;
          }
        }
        return null;
      }

      private shuffle(array: PieceType[]) {
        let m = array.length;
        let t, i;

        while (m) {
          i = Math.floor(Math.random() * m--);
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }

        return array;
      }

      private resetGame() {
        this.shuffle(this.pieces);
        let index = 0;
        
        for (let i = 0; i < this.gridSize; i++) {
          for (let j = 0; j < this.gridSize; j++) {
            if (i === this.gridSize - 1 && j === this.gridSize - 1) {
              this.emptyPosition = { row: i, col: j };
              continue;
            }
            
            const piece = this.pieces[index];
            
            if (!piece) {
              return;
            }
            
            piece.movePiece(i, j);
            index++;
          }
        }
      }

      private checkPuzzleComplete() {
        let isComplete = true;
        
        for (let i = 0; i < this.pieces.length; i++) {
          const piece = this.pieces[i];
          const originalRow = piece.row;
          const originalCol = piece.col;
          const currentRow = piece.newRow;
          const currentCol = piece.newCol;
          
          if (originalRow !== currentRow || originalCol !== currentCol) {
            isComplete = false;
            break;
          }
        }
        
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
            }, 1000);
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

    if (slide0Ref.current && slide1Ref.current && slide2Ref.current) {
      const currentLevelData = levels[currentLevel];
      const gridSize = currentLevelData.gridSize;
      
      // Clear containers
      slide0Ref.current.innerHTML = '';
      slide1Ref.current.innerHTML = '';
      slide2Ref.current.innerHTML = '';
      
      const jigsaw1 = createJigsaw();
      const jigsaw2 = createJigsaw();
      const jigsaw3 = createJigsaw();

      jigsaw1.init({
        container: slide0Ref.current,
        image: `/images/${currentLevelData.images[0]}`,
        gridSize: gridSize,
        onComplete: () => {
          setCompletedPuzzles(prev => {
            const newState = [...prev];
            newState[0] = true;
            return newState;
          });
          // Automatically move to next puzzle after a brief celebration pause
          setTimeout(() => {
            handleSlideChange(1);
          }, 1000);
        }
      });

      jigsaw2.init({
        container: slide1Ref.current,
        image: `/images/${currentLevelData.images[1]}`,
        gridSize: gridSize,
        onComplete: () => {
          setCompletedPuzzles(prev => {
            const newState = [...prev];
            newState[1] = true;
            return newState;
          });
          // Automatically move to next puzzle after a brief celebration pause
          setTimeout(() => {
            handleSlideChange(2);
          }, 1000);
        }
      });

      jigsaw3.init({
        container: slide2Ref.current,
        image: `/images/${currentLevelData.images[2]}`,
        gridSize: gridSize,
        onComplete: () => {
          setCompletedPuzzles(prev => {
            const newState = [...prev];
            newState[2] = true;
            return newState;
          });
          // Focus on the theme input field after completing all puzzles
          setTimeout(() => {
            const themeInput = document.getElementById('theme-input');
            if (themeInput) themeInput.focus();
          }, 1000);
        }
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createJigsaw, currentLevel]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    
    if (wrapperRef.current) {
      document.body.style.backgroundColor = colors[index];
    }
  };

  const checkTheme = () => {
    const currentTheme = levels[currentLevel].theme;
    const userGuess = themeGuess.toLowerCase().trim();
    
    // Check if user guess matches the theme
    if (
      userGuess === currentTheme ||
      (currentTheme === 'mouse' && ['mice', 'cartoon mice', 'cartoon mouse', 'mickey mouse'].includes(userGuess)) ||
      (currentTheme === 'superhero' && ['superheroes', 'heroes', 'super heroes', 'super hero'].includes(userGuess))
    ) {
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

  const hideInstructions = () => {
    setShowInstructions(false);
  };

  const allPuzzlesCompleted = completedPuzzles.every(completed => completed);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#24252a] transition-colors duration-500" style={{ backgroundColor: colors[currentSlide] }}>
      <h1 className="text-[#e9f71d] text-3xl font-bold absolute top-5 left-1/2 transform -translate-x-1/2 z-20">
        Level {currentLevel + 1}
      </h1>
      
      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            <ol className="list-decimal pl-5 space-y-2 mb-6">
              <li>Drag and drop puzzle pieces to solve all three puzzles.</li>
              <li>Navigate between puzzles using the thumbnails below the main puzzle.</li>
              <li>You must complete all three puzzles before you can guess the theme.</li>
              <li>Once all puzzles are solved, enter the common theme that connects all three images.</li>
              <li>Complete all levels to win the game!</li>
            </ol>
            <button 
              onClick={hideInstructions}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {completedPuzzles.map((completed, index) => (
          <div 
            key={index}
            className={`w-4 h-4 rounded-full ${completed ? 'bg-green-500' : 'bg-white/30'}`}
          />
        ))}
      </div>
      
      <div 
        ref={wrapperRef}
        className="relative bg-white/70 shadow-lg rounded-lg p-2 overflow-visible mb-4"
        style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
      >
        <div className="relative h-full w-full">
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            ref={slide0Ref}
          ></div>
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            ref={slide1Ref}
          ></div>
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            ref={slide2Ref}
          ></div>
        </div>
      </div>
      
      {/* Thumbnail navigation */}
      <div className="flex gap-4 mt-2">
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
      <div className="flex gap-8 mt-4">
        <button
          onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#3d3c3f]/30 hover:bg-[#3d3c3f]/50 transition-all duration-300 ${
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
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#3d3c3f]/30 hover:bg-[#3d3c3f]/50 transition-all duration-300 ${
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
      <div className="w-full max-w-lg mt-6 px-4">
        <div className="bg-white/20 rounded-lg p-4 mb-4 text-white">
          <h3 className="font-bold text-lg mb-2">Hint:</h3>
          <p>{levels[currentLevel].hintText}</p>
        </div>
        
        <div className="bg-yellow-500/20 border-l-4 border-yellow-500 p-3 mb-4 text-white">
          <strong>Note:</strong> You must solve all three puzzles before you can guess the theme.
        </div>
        
        <div className="flex gap-2">
          <input
            id="theme-input"
            type="text"
            placeholder="What's the common theme?"
            value={themeGuess}
            onChange={(e) => setThemeGuess(e.target.value)}
            className="flex-1 px-4 py-2 rounded-l-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:border-white/50"
            disabled={!allPuzzlesCompleted || puzzleSolved}
          />
          <button
            onClick={checkTheme}
            disabled={!allPuzzlesCompleted || puzzleSolved}
            className={`px-4 py-2 rounded-r-lg bg-[#e9f71d] text-[#24252a] font-bold ${
              (!allPuzzlesCompleted || puzzleSolved) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c8d41a]'
            }`}
          >
            Check
          </button>
        </div>
        
        {!allPuzzlesCompleted && (
          <div className="text-white/70 text-sm mt-2">
            {completedPuzzles.filter(p => p).length} of 3 puzzles completed
          </div>
        )}
        
        {showSuccessMessage && (
          <div className="bg-green-500/90 text-white rounded-lg p-3 mt-4 animate-pulse">
            Correct! That's the theme!
          </div>
        )}
        
        {showFailureMessage && (
          <div className="bg-red-500/90 text-white rounded-lg p-3 mt-4 animate-pulse">
            Try again. That's not the theme we're looking for.
          </div>
        )}
        
        {puzzleSolved && (
          <button
            onClick={moveToNextLevel}
            className="w-full mt-4 px-4 py-3 rounded-lg bg-[#e9f71d] text-[#24252a] font-bold hover:bg-[#c8d41a] transition-colors"
          >
            {currentLevel < levels.length - 1 ? "Next Level" : "Finish Game"}
          </button>
        )}
        
        {/* Show instructions button */}
        <button
          onClick={() => setShowInstructions(true)}
          className="w-full mt-4 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 hover:bg-white/30