// // src/App.jsx
// import React, { useState, useRef } from 'react'; // Import useRef
// import Board from './Board';
// import './App.css';
// import axios from 'axios';

// // A helper function to create a new empty board
// const createEmptyBoard = (size) => Array(size).fill(0).map(() => Array(size).fill(0));

// function App() {
//   const [n, setN] = useState(4);
//   const [board, setBoard] = useState(createEmptyBoard(4));
//   const [isPlaying, setIsPlaying] = useState(false); // To disable controls
  
//   // Use useRef to hold the current board state inside the timer loop
//   const boardRef = useRef(board);
//   boardRef.current = board; // Keep it updated on every render

//   const handleSlider = (e) => {
//     const newN = parseInt(e.target.value, 10);
//     setN(newN);
//     setBoard(createEmptyBoard(newN));
//   };

//   // --- NEW: This function will animate the steps ---
//   const visualizeSteps = (steps) => {
//     let currentStep = 0;

//     const nextStep = () => {
//       if (currentStep >= steps.length) {
//         setIsPlaying(false); // Animation finished
//         return;
//       }

//       const step = steps[currentStep];
//       const { action, row, col } = step;

//       // Create a *new copy* of the board to update the state
//       const newBoard = boardRef.current.map(arr => [...arr]);

//       if (action === 'place') {
//         newBoard[row][col] = 1; // Place a queen
//       } else if (action === 'remove') {
//         newBoard[row][col] = 0; // Remove a queen
//       }
//       // We can ignore 'try' and 'conflict' for this visualizer,
//       // or you could add a temporary 'try' class later!

//       setBoard(newBoard); // Update the UI
//       currentStep++;

//       // Wait 150ms before showing the next step
//       setTimeout(nextStep, 150); 
//     };

//     nextStep(); // Start the animation
//   };

//   const startSolving = async () => {
//     console.log("Start solving for N=", n);
//     setIsPlaying(true); // Disable controls during animation

//     // 1. Clear the board for a fresh start
//     setBoard(createEmptyBoard(n));

//     try {
//       // 2. Call the Java backend API
//       const response = await axios.get(`http://localhost:8080/api/solve?n=${n}`);
      
//       // 3. Get the list of steps from the response
//       const steps = response.data;
//       console.log("Received steps from backend:", steps);

//       // 4. Call our new animation function!
//       visualizeSteps(steps);

//     } catch (error) {
//       console.error("Error fetching solution:", error);
//       setIsPlaying(false); // Re-enable controls if there's an error
//     }
//   };

//   return (
//     <div className="app">
//       <h1>N-Queens Visualizer</h1>
//       <div className="controls">
//         <label>Select N: {n}</label>
//         <input 
//           type="range" 
//           min="4" 
//           max="8" 
//           value={n} 
//           onChange={handleSlider} 
//           disabled={isPlaying} // Disable slider while playing
//         />
//         <button onClick={startSolving} disabled={isPlaying}>
//           {isPlaying ? 'Solving...' : 'Solve'}
//         </button>
//       </div>
//       <Board board={board} />
//     </div>
//   );
// }

// export default App;

// src/App.jsx
import React, { useState, useRef, useEffect } from 'react'; // Import useEffect
import Board from './Board';
import './App.css';
import axios from 'axios';

// A helper function to create a new empty board
const createEmptyBoard = (size) => Array(size).fill(0).map(() => Array(size).fill(0));

function App() {
  const [n, setN] = useState(4);
  const [board, setBoard] = useState(createEmptyBoard(4));
  const [isPlaying, setIsPlaying] = useState(false);
  
  // --- NEW STATES ---
  const [speed, setSpeed] = useState(150); // Default speed (Medium)
  const [isDarkMode, setIsDarkMode] = useState(false); // Default (Light)

  // Use refs to hold the current state for the timer loop
  const boardRef = useRef(board);
  boardRef.current = board;
  
  // --- NEW REF for Speed ---
  const speedRef = useRef(speed);
  speedRef.current = speed; // Keep it updated

  // --- NEW EFFECT for Dark Mode ---
  useEffect(() => {
    // Add or remove the 'dark-mode' class from the main app div
    const appElement = document.querySelector('.app');
    if (isDarkMode) {
      appElement.classList.add('dark-mode');
    } else {
      appElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]); // This runs whenever isDarkMode changes

  const handleSlider = (e) => {
    const newN = parseInt(e.target.value, 10);
    setN(newN);
    setBoard(createEmptyBoard(newN));
  };
  
  // --- NEW: Handle speed change ---
  const handleSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
  };

  // --- NEW: Handle theme toggle ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // This function will animate the steps
  const visualizeSteps = (steps) => {
    let currentStep = 0;

    const nextStep = () => {
      if (currentStep >= steps.length) {
        setIsPlaying(false); // Animation finished
        return;
      }

      const step = steps[currentStep];
      const { action, row, col } = step;

      const newBoard = boardRef.current.map(arr => [...arr]);

      if (action === 'place') {
        newBoard[row][col] = 1; // Place a queen
      } else if (action === 'remove') {
        newBoard[row][col] = 0; // Remove a queen
      }

      setBoard(newBoard);
      currentStep++;

      // --- UPDATED: Use the speed from the ref ---
      setTimeout(nextStep, speedRef.current); 
    };

    nextStep(); // Start the animation
  };

  const startSolving = async () => {
    console.log("Start solving for N=", n);
    setIsPlaying(true);
    setBoard(createEmptyBoard(n));

    try {
      // --- IMPORTANT: Update this to your deployed Render URL! ---
       const apiUrl = `http://localhost:8080/api/solve?n=${n}`;
     // const apiUrl = `https://n-queens-api.onrender.com/api/solve?n=${n}`; // Or your localhost for testing
      
      const response = await axios.get(apiUrl);
      
      const steps = response.data;
      console.log("Received steps from backend:", steps);

      visualizeSteps(steps);

    } catch (error) {
      console.error("Error fetching solution:", error);
      setIsPlaying(false);
    }
  };

  return (
    // We remove 'className="app"' here because it's now handled by the effect
    <div className="app"> 
      <h1>N-Queens Visualizer</h1>
      
      {/* --- NEW THEME TOGGLE --- */}
      <div className="theme-switcher">
        <span>Light</span>
        <label className="switch">
          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
          <span className="slider round"></span>
        </label>
        <span>Dark</span>
      </div>
      
      <div className="controls">
        <label>Select N: {n}</label>
        <input 
          type="range" 
          min="4" 
          max="8" 
          value={n} 
          onChange={handleSlider} 
          disabled={isPlaying}
        />
        
        {/* --- NEW SPEED CONTROL --- */}
        <label>Speed:</label>
        <select value={speed} onChange={handleSpeedChange} disabled={isPlaying}>
          <option value={300}>Low</option>
          <option value={150}>Medium</option>
          <option value={50}>High</option>
        </select>
        
        <button onClick={startSolving} disabled={isPlaying}>
          {isPlaying ? 'Solving...' : 'Solve'}
        </button>
      </div>
      <Board board={board} />
    </div>
  );
}

export default App;