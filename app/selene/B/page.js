'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


const initialBoard = [
  [5, 3, '', '', 7, '', '', '', ''],
  [6, '', '', 1, 9, 5, '', '', ''],
  ['', 9, 8, '', '', '', '', 6, ''],
  [8, '', '', '', 6, '', '', '', 3],
  [4, '', '', 8, '', 3, '', '', 1],
  [7, '', '', '', 2, '', '', '', 6],
  ['', 6, '', '', '', '', 2, 8, ''],
  ['', '', '', 4, 1, 9, '', '', 5],
  ['', '', '', '', 8, '', '', 7, 9],
];

export default function SudokuPage() {
  const [board, setBoard] = useState(initialBoard);
  const router = useRouter();

  const handleChange = (r, c, value) => {
    const newBoard = board.map((row, i) =>
      row.map((cell, j) => (i === r && j === c ? value : cell))
    );
    setBoard(newBoard);
  };

  const isSolved = () => {
    const isValidSet = (arr) => {
      const nums = arr.map(String).filter((v) => v !== '');
      return nums.length === 9 && new Set(nums).size === 9 && nums.every((n) => /^[1-9]$/.test(n));
    };

    for (let row of board) {
      if (!isValidSet(row)) return false;
    }

    for (let c = 0; c < 9; c++) {
      const col = board.map((r) => r[c]);
      if (!isValidSet(col)) return false;
    }

    for (let br = 0; br < 3; br++) {
      for (let bc = 0; bc < 3; bc++) {
        const box = [];
        for (let r = br * 3; r < br * 3 + 3; r++) {
          for (let c = bc * 3; c < bc * 3 + 3; c++) {
            box.push(board[r][c]);
          }
        }
        if (!isValidSet(box)) return false;
      }
    }

    return true;
  };

  const handleCheck = () => {
    if (isSolved()) {
      alert('🎉 Sudoku Solved! You were Distracted');
      router.push('/'); // redirect to original page
    } else {
      alert('❌ Not solved correctly yet!');
    }
  };

  return (
    <div className="sudoku-container">
      <h1>🧩 Sudoku Puzzle</h1>
      <div className="sudoku-grid">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              className="sudoku-cell"
              type="text"
              maxLength={1}
              value={cell}
              disabled={initialBoard[r][c] !== ''}
              onChange={(e) => handleChange(r, c, e.target.value)}
            />
          ))
        )}
      </div>
      <button onClick={handleCheck} className="check-button">Check Solution</button>
    </div>
  );
}
