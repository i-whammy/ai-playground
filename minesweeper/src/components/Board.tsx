import React from 'react';
import { Board as BoardType, Cell as CellType } from '../types';
import Cell from './Cell';

interface BoardProps {
  board: BoardType;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick, onContext }) => {
  // Render the board as a grid of cells
  const renderBoard = (): React.ReactNode => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            state={cell.state}
            value={cell.value}
            red={cell.red}
            onClick={onClick}
            onContext={onContext}
          />
        ))}
      </div>
    ));
  };

  return <div className="board">{renderBoard()}</div>;
};

export default Board;