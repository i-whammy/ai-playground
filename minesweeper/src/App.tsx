import React from 'react';
import './App.css';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Minesweeper</h1>
      <Game />
    </div>
  );
};

export default App;
