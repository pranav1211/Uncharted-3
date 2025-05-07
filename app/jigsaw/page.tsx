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
  const [loadingImages, setLoadingImages] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
  ];

  const colors = ['#795548', '#f44336', '#03a9f4'];

  // Debug function to check image URLs
  const checkImageUrls = useCallback(() => {
    const currentLevelData = levels[currentLevel];
    return currentLevelData.images.map(img => `/images/${img}`);
  }, [currentLevel, levels]);

  const createJigsaw = useCallback(() => {
    class Jigsaw implements JigsawType {
      private container: HTMLDivElement | null = null;
      private puzzleImg: { url?: string; width?: number; height?: number } = {};
      private pieces: PieceType[] = [];
      private gridSize: number = 4;
      private puzzleWidth: number = 0;
      private puzzleHeight: number = 0;
      private emptyPosition: { row: number; col: number } = { row: 0, col: 0 };
      private onPuzzleComplete: () => void = () => { };
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

        // Add visible loading state to container
        if (this.container) {
          this.container.innerHTML = '<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; justify-content:center; align-items:center; background-color:rgba(255,255,255,0.8);">Loading puzzle image...</div>';
        }

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
            this.container.innerHTML = ''; // Clear loading message
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
            this.container.innerHTML = `
              <div style="color: #e53935; padding: 20px; text-align: center; position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">Failed to load image</div>
                <div style="margin-top: 5px; font-size: 14px;">Path: ${image}</div>
                <div style="margin-top: 10px; font-size: 12px; color: #666;">
                  Check if the image exists in the public/images folder
                </div>
              </div>`;
          }
        };

        // Log the attempted image path
        console.log("Attempting to load image:", image);
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
          movePiece: function (row, col) {
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
            pieceEle.style.border = '1px solid rgba(0,0,0,0.1)'; // Add visible borders to pieces

            // Add drag events
            pieceEle.addEventListener('mousedown', (e) => this.onDragStart(e, piece));
            pieceEle.addEventListener('touchstart', (e) => this.onDragStart(e, piece), { passive: false });

            container.appendChild(pieceEle);
            piece.pieceEle = pieceEle;
          },
          removePiece: function () {
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

        // Add a grid background to visualize empty spaces
        const gridBg = document.createElement('div');
        gridBg.style.position = 'absolute';
        gridBg.style.top = '0';
        gridBg.style.left = '0';
        gridBg.style.width = '100%';
        gridBg.style.height = '100%';
        gridBg.style.backgroundImage = 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)';
        gridBg.style.backgroundSize = `${pieceSize}px ${pieceSize}px`;
        gridBg.style.opacity = '0.2';
        this.container.appendChild(gridBg);

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

    // Put these in a setTimeout to prevent the immediate state update
    // that could cause the infinite loop
    setTimeout(() => {
      setLoadingImages(true);
      setLoadError(false);
    }, 0);

    // Clean up previous jigsaw instances
    jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    jigsawInstancesRef.current = [];

    // Initialize all puzzles - but only if we're mounted
    let isMounted = true;
    const currentLevelData = levels[currentLevel];
    const gridSize = currentLevelData.gridSize;

    // Log the image paths being used
    console.log("Current level images:", checkImageUrls());

    // Preload images to check if they exist
    const preloadImages = currentLevelData.images.map(imgSrc => {
      return new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
          console.error(`Failed to load image: /images/${imgSrc}`);
          resolve(false);
        };
        img.src = `/images/${imgSrc}`;
      });
    });

    Promise.all(preloadImages).then(results => {
      // Check if we're still mounted before updating state
      if (!isMounted) return;

      setLoadingImages(false);
      setLoadError(!results.every(Boolean));

      if (!results.every(Boolean)) {
        console.error("Some images failed to load");
        return;
      }

      // Only initialize jigsaws if all images loaded successfully
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
    });

    return () => {
      isMounted = false; // Mark as unmounted
      window.removeEventListener('resize', handleResize);
      jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    };
  }, [createJigsaw, currentLevel, checkImageUrls]);

  // Also, make sure the usePlaceholderImages function doesn't trigger infinite updates
  // Removed duplicate declaration of usePlaceholderImages

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

  // Debug images option to test using placeholders
  // The issue is likely in the useEffect that initializes the puzzles.
  // Here's a fixed version of that useEffect:

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

    // Put these in a setTimeout to prevent the immediate state update
    // that could cause the infinite loop
    setTimeout(() => {
      setLoadingImages(true);
      setLoadError(false);
    }, 0);

    // Clean up previous jigsaw instances
    jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    jigsawInstancesRef.current = [];

    // Initialize all puzzles - but only if we're mounted
    let isMounted = true;
    const currentLevelData = levels[currentLevel];
    const gridSize = currentLevelData.gridSize;

    // Log the image paths being used
    console.log("Current level images:", checkImageUrls());

    // Preload images to check if they exist
    const preloadImages = currentLevelData.images.map(imgSrc => {
      return new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
          console.error(`Failed to load image: /images/${imgSrc}`);
          resolve(false);
        };
        img.src = `/images/${imgSrc}`;
      });
    });

    Promise.all(preloadImages).then(results => {
      // Check if we're still mounted before updating state
      if (!isMounted) return;

      setLoadingImages(false);
      setLoadError(!results.every(Boolean));

      if (!results.every(Boolean)) {
        console.error("Some images failed to load");
        return;
      }

      // Only initialize jigsaws if all images loaded successfully
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
    });

    return () => {
      isMounted = false; // Mark as unmounted
      window.removeEventListener('resize', handleResize);
      jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    };
  }, [createJigsaw, currentLevel, checkImageUrls]);

  // Also, make sure the usePlaceholderImages function doesn't trigger infinite updates
  const usePlaceholderImages = useCallback(() => {
    // Clean up previous jigsaw instances
    jigsawInstancesRef.current.forEach(jigsaw => jigsaw.destroy());
    jigsawInstancesRef.current = [];

    const currentLevelData = levels[currentLevel];
    const gridSize = currentLevelData.gridSize;

    puzzleRefs.forEach((ref, index) => {
      if (ref.current) {
        // Clear container
        ref.current.innerHTML = '';

        // Create jigsaw with placeholder image
        const jigsaw = createJigsaw();
        jigsawInstancesRef.current[index] = jigsaw;

        jigsaw.init({
          container: ref.current,
          // Use a placeholder image service instead
          image: `https://via.placeholder.com/${containerSize}x${containerSize}?text=Puzzle+${index + 1}`,
          gridSize: gridSize,
          onComplete: () => {
            setCompletedPuzzles(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      }
    });

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

        {/* Image Error Message */}
        {loadError && (
          <div className="bg-red-600 text-white mb-4 p-4 rounded-lg max-w-lg text-center">
            <h3 className="font-bold text-lg">Image Loading Error</h3>
            <p className="mb-2">There was a problem loading the puzzle images. Make sure the following image files exist:</p>
            <ul className="text-left mb-4 pl-4 text-sm">
              {levels[currentLevel].images.map((img, idx) => (
                <li key={idx}>• /images/{img}</li>
              ))}
            </ul>
            <button
              className="bg-white text-red-600 font-bold py-1 px-3 rounded-lg hover:bg-gray-100"
              onClick={usePlaceholderImages}
            >
              Use Placeholder Images
            </button>
          </div>
        )}

        {/* Puzzle container */}
        <div
          ref={wrapperRef}
          className="relative bg-white/80 shadow-lg rounded-lg p-2 overflow-hidden mb-4"
          style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
        >
          {loadingImages && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-700">Loading puzzle images...</p>
              </div>
            </div>
          )}

          <div className="relative h-full w-full">
            {puzzleRefs.map((ref, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-300 ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                ref={ref}
                style={{ backgroundColor: '#f5f5f5' }} // Light background for empty puzzle
              ></div>
            ))}
          </div>
          {/* Puzzle navigation thumbnails */}
          <div className="flex justify-center gap-4 mb-4">
            {levels[currentLevel].images.map((img, index) => (
              <div
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-24 h-24 rounded-lg overflow-hidden border-4 cursor-pointer transition-all ${currentSlide === index ? 'border-yellow-300 scale-110' : 'border-transparent opacity-70'
                  }`}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              >
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url(/images/${img})` }}
                >
                  {completedPuzzles[index] && (
                    <div className="w-full h-full flex items-center justify-center bg-green-500/50">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Theme guessing section */}
          <div className={`max-w-lg mx-auto p-4 rounded-lg bg-white/80 transition-opacity ${allPuzzlesCompleted ? 'opacity-100' : 'opacity-50'}`}>
            <h2 className="text-xl font-bold text-gray-800 mb-2">What's the theme?</h2>
            <p className="text-sm text-gray-600 mb-4">
              {levels[currentLevel].hintText}
            </p>

            <div className="flex gap-2">
              <input
                ref={themeInputRef}
                type="text"
                value={themeGuess}
                onChange={(e) => setThemeGuess(e.target.value)}
                placeholder="Enter the theme..."
                disabled={!allPuzzlesCompleted}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && checkTheme()}
              />
              <button
                onClick={checkTheme}
                disabled={!allPuzzlesCompleted || themeGuess.trim() === ''}
                className={`px-4 py-2 rounded-lg font-bold ${!allPuzzlesCompleted || themeGuess.trim() === ''
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
              >
                Check
              </button>
            </div>

            {/* Success/failure messages */}
            {showSuccessMessage && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Correct! The theme is <strong>{levels[currentLevel].theme}</strong>.</span>
              </div>
            )}

            {showFailureMessage && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>That's not it. Try again!</span>
              </div>
            )}
          </div>

          {/* Next level button */}
          {puzzleSolved && (
            <button
              onClick={moveToNextLevel}
              className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center mx-auto animate-bounce"
            >
              <span>Next Level</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Help button */}
          <button
            onClick={() => setShowInstructions(true)}
            className="absolute top-4 right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);};