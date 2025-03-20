import { Board, Cell, CellState, CellValue } from "../types";

// Generate a board with random mines
export const generateBoard = (
  rows: number,
  cols: number,
  bombs: number
): Board => {
  // Create an empty board
  let board: Board = [];
  
  // Create empty cells
  for (let row = 0; row < rows; row++) {
    board.push([]);
    for (let col = 0; col < cols; col++) {
      board[row].push({
        value: CellValue.NONE,
        state: CellState.HIDDEN
      });
    }
  }
  
  // Randomly place bombs
  let bombsPlaced = 0;
  while (bombsPlaced < bombs) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    
    // If the cell doesn't already have a bomb, place one
    if (board[randomRow][randomCol].value !== CellValue.BOMB) {
      board[randomRow][randomCol].value = CellValue.BOMB;
      bombsPlaced++;
    }
  }
  
  // Calculate numbers for each cell
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Skip if the cell is a bomb
      if (board[row][col].value === CellValue.BOMB) {
        continue;
      }
      
      // Count adjacent bombs
      let bombCount = 0;
      
      // Check all 8 adjacent cells
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          // Skip the current cell
          if (rowOffset === 0 && colOffset === 0) {
            continue;
          }
          
          const newRow = row + rowOffset;
          const newCol = col + colOffset;
          
          // Check if the adjacent cell is within bounds
          if (
            newRow >= 0 && 
            newRow < rows && 
            newCol >= 0 && 
            newCol < cols && 
            board[newRow][newCol].value === CellValue.BOMB
          ) {
            bombCount++;
          }
        }
      }
      
      // Set the cell value based on the bomb count
      board[row][col].value = bombCount as CellValue;
    }
  }
  
  return board;
};

// Open a cell and handle cascading opens for empty cells
export const openCell = (
  board: Board,
  rowParam: number,
  colParam: number
): Board => {
  const newBoard = [...board];
  const currentCell = newBoard[rowParam][colParam];
  
  // If the cell is already visible or flagged, do nothing
  if (
    currentCell.state === CellState.VISIBLE || 
    currentCell.state === CellState.FLAGGED
  ) {
    return board;
  }
  
  // Make the cell visible
  currentCell.state = CellState.VISIBLE;
  
  // If the cell is empty (has no adjacent bombs), open adjacent cells
  if (currentCell.value === CellValue.NONE) {
    const rows = newBoard.length;
    const cols = newBoard[0].length;
    
    // Check all 8 adjacent cells
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        // Skip the current cell
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }
        
        const newRow = rowParam + rowOffset;
        const newCol = colParam + colOffset;
        
        // Check if the adjacent cell is within bounds
        if (
          newRow >= 0 && 
          newRow < rows && 
          newCol >= 0 && 
          newCol < cols
        ) {
          // Recursively open the adjacent cell
          if (newBoard[newRow][newCol].state === CellState.HIDDEN) {
            openCell(newBoard, newRow, newCol);
          }
        }
      }
    }
  }
  
  return newBoard;
};

// Check if the player has won
export const hasWon = (board: Board): boolean => {
  // Count hidden cells and bombs
  let hiddenCount = 0;
  let bombCount = 0;
  
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.state === CellState.HIDDEN) {
        hiddenCount++;
      }
      if (cell.value === CellValue.BOMB) {
        bombCount++;
      }
    });
  });
  
  // If the number of hidden cells equals the number of bombs, the player has won
  return hiddenCount === bombCount;
};

// Get the number of remaining flags
export const getRemainingFlags = (board: Board, totalBombs: number): number => {
  let flagCount = 0;
  
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.state === CellState.FLAGGED) {
        flagCount++;
      }
    });
  });
  
  return totalBombs - flagCount;
};