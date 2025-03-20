import React from 'react';
import { CellState, CellValue } from '../types';

interface CellProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  red?: boolean;
  onClick(rowParam: number, colParam: number): (...args: any[]) => void;
  onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Cell: React.FC<CellProps> = ({ 
  row, 
  col, 
  state, 
  value, 
  red, 
  onClick, 
  onContext 
}) => {
  // Render the cell content based on its state and value
  const renderContent = (): React.ReactNode => {
    // If the cell is hidden, render nothing or a flag
    if (state === CellState.HIDDEN) {
      return null;
    }
    
    // If the cell is flagged, render a flag
    if (state === CellState.FLAGGED) {
      return "🚩";
    }
    
    // If the cell is visible, render its value
    if (value === CellValue.BOMB) {
      return "💣";
    }
    
    // If the cell has no adjacent bombs, render nothing
    if (value === CellValue.NONE) {
      return null;
    }
    
    // Otherwise, render the number of adjacent bombs
    return value;
  };
  
  // Determine the cell's color based on its value
  const getValueColor = (): string => {
    switch (value) {
      case CellValue.ONE:
        return "blue";
      case CellValue.TWO:
        return "green";
      case CellValue.THREE:
        return "red";
      case CellValue.FOUR:
        return "purple";
      case CellValue.FIVE:
        return "maroon";
      case CellValue.SIX:
        return "turquoise";
      case CellValue.SEVEN:
        return "black";
      case CellValue.EIGHT:
        return "gray";
      default:
        return "";
    }
  };

  // Handle right-click (context menu)
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onContext(row, col)();
  };

  // Determine the cell's background color
  const getBackgroundColor = (): string => {
    if (red) {
      return "red";
    }
    
    if (state === CellState.VISIBLE) {
      return "#e5e5e5";
    }
    
    return "";
  };

  return (
    <div
      className={`cell ${state === CellState.VISIBLE ? "visible" : ""}`}
      onClick={onClick(row, col)}
      onContextMenu={handleContextMenu}
      style={{
        color: getValueColor(),
        backgroundColor: getBackgroundColor()
      }}
    >
      {renderContent()}
    </div>
  );
};

export default Cell;