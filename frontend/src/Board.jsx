// src/Board.jsx
import React from 'react';
import './Board.css';

function Board({ board }) {
  // We'll add a 'queen' class if the cell value is 1
  const getCellClass = (val) => (val === 1 ? 'cell queen' : 'cell');

  return (
    <div 
      className="board" 
      style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)` }}
    >
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => {
          // Create a checkerboard pattern
          const isDark = (rowIndex + colIndex) % 2 === 1;
          const darkClass = isDark ? ' dark' : '';

          return (
            <div 
              key={`${rowIndex}-${colIndex}`} 
              // We'll also add classes for "try" and "conflict"
              className={getCellClass(cell) + darkClass}
            >
              {/* --- THIS IS THE MAIN CHANGE --- */}
              {cell === 1 ? '👑' : ''}
              {/* --- END OF CHANGE --- */}
            </div>
          );
        })
      ))}
    </div>
  );
}

export default Board;