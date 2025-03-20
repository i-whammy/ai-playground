import React, { useEffect, useState } from 'react';
import { Board as BoardType, Cell, CellState, CellValue, Face, GameStatus } from '../types';
import { generateBoard, hasWon, openCell, getRemainingFlags } from '../utils';
import Board from './Board';
import NumberDisplay from './NumberDisplay';

// Game configuration
const MAX_ROWS = 16;
const MAX_COLS = 16;
const NUM_BOMBS = 40;

const Game: React.FC = () => {
  // Game state
  const [board, setBoard] = useState<BoardType>([]);
  const [face, setFace] = useState<Face>(Face.SMILE);
  const [time, setTime] = useState<number>(0);
  const [bombCounter, setBombCounter] = useState<number>(NUM_BOMBS);
  const [status, setStatus] = useState<GameStatus>('playing');
  const [isFirstClick, setIsFirstClick] = useState<boolean>(true);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Initialize the game
  useEffect(() => {
    const freshBoard = generateBoard(MAX_ROWS, MAX_COLS, NUM_BOMBS);
    setBoard(freshBoard);
    setStatus('playing');
    setFace(Face.SMILE);
    setTime(0);
    setBombCounter(NUM_BOMBS);
    setIsFirstClick(true);
    setHasStarted(false);
  }, []);

  // Timer logic
  useEffect(() => {
    if (hasStarted && status === 'playing') {
      const timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [hasStarted, status]);

  // Handle left click on a cell
  const handleCellClick = (rowParam: number, colParam: number) => () => {
    // Do nothing if the game is over
    if (status !== 'playing') {
      return;
    }

    // Start the game on the first click
    if (isFirstClick) {
      setIsFirstClick(false);
      setHasStarted(true);
    }

    // Get the clicked cell
    const currentCell = board[rowParam][colParam];

    // Do nothing if the cell is flagged or already visible
    if (
      currentCell.state === CellState.FLAGGED ||
      currentCell.state === CellState.VISIBLE
    ) {
      return;
    }

    // If the cell is a bomb, end the game
    if (currentCell.value === CellValue.BOMB) {
      setStatus('lost');
      setFace(Face.LOST);
      
      // Show all bombs
      const newBoard = [...board];
      newBoard.forEach(row => {
        row.forEach(cell => {
          // Show all bombs
          if (cell.value === CellValue.BOMB) {
            cell.state = CellState.VISIBLE;
          }
          // Mark incorrectly flagged cells
          if (cell.state === CellState.FLAGGED && cell.value !== CellValue.BOMB) {
            cell.red = true;
          }
        });
      });
      
      // Mark the clicked bomb as red
      newBoard[rowParam][colParam].red = true;
      
      setBoard(newBoard);
      return;
    }

    // Open the cell and potentially cascade to adjacent cells
    const newBoard = openCell(board, rowParam, colParam);
    setBoard(newBoard);

    // Check if the player has won
    if (hasWon(newBoard)) {
      setStatus('won');
      setFace(Face.WON);
      
      // Flag all remaining bombs
      const finalBoard = [...newBoard];
      finalBoard.forEach(row => {
        row.forEach(cell => {
          if (cell.value === CellValue.BOMB && cell.state === CellState.HIDDEN) {
            cell.state = CellState.FLAGGED;
          }
        });
      });
      
      setBoard(finalBoard);
      setBombCounter(0);
    }
  };

  // Handle right click on a cell (flag/unflag)
  const handleCellContext = (rowParam: number, colParam: number) => () => {
    // Do nothing if the game is over
    if (status !== 'playing') {
      return;
    }

    // Get the clicked cell
    const currentCell = board[rowParam][colParam];

    // Do nothing if the cell is already visible
    if (currentCell.state === CellState.VISIBLE) {
      return;
    }

    // Create a new board
    const newBoard = [...board];

    // Toggle the cell's state between hidden and flagged
    if (currentCell.state === CellState.HIDDEN) {
      newBoard[rowParam][colParam].state = CellState.FLAGGED;
    } else {
      newBoard[rowParam][colParam].state = CellState.HIDDEN;
    }

    setBoard(newBoard);
    
    // Update the bomb counter
    setBombCounter(getRemainingFlags(newBoard, NUM_BOMBS));
  };

  // Handle face button click (reset game)
  const handleFaceClick = () => {
    const freshBoard = generateBoard(MAX_ROWS, MAX_COLS, NUM_BOMBS);
    setBoard(freshBoard);
    setStatus('playing');
    setFace(Face.SMILE);
    setTime(0);
    setBombCounter(NUM_BOMBS);
    setIsFirstClick(true);
    setHasStarted(false);
  };

  // Handle mouse down on a cell (change face to "oh")
  const handleMouseDown = () => {
    if (status === 'playing') {
      setFace(Face.OH);
    }
  };

  // Handle mouse up on a cell (change face back to smile)
  const handleMouseUp = () => {
    if (status === 'playing') {
      setFace(Face.SMILE);
    }
  };

  return (
    <div 
      className="game"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="header">
        <NumberDisplay value={bombCounter} />
        <div className="face" onClick={handleFaceClick}>
          {face}
        </div>
        <NumberDisplay value={time} />
      </div>
      <Board 
        board={board} 
        onClick={handleCellClick} 
        onContext={handleCellContext} 
      />
    </div>
  );
};

export default Game;