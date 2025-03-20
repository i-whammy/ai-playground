import React from 'react';

interface NumberDisplayProps {
  value: number;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ value }) => {
  // Ensure the value is between 0 and 999
  const displayValue = Math.min(Math.max(0, value), 999);
  
  // Format the value to have 3 digits with leading zeros
  const formattedValue = displayValue.toString().padStart(3, '0');
  
  return <div className="number-display">{formattedValue}</div>;
};

export default NumberDisplay;