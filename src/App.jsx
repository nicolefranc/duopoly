import React, { useState } from 'react';
import tiles from './data/tiles';
import Board from './components/Board';

export default function App() {
  const boardLength = Object.keys(tiles).length - 1;

  const [positionP1, setPositionP1] = useState(0);
  const [positionP2, setPositionP2] = useState(0);
  const [turn, setTurn] = useState(1);
  const [message, setMessage] = useState('');

  const handleRoll = () => {
    const roll = Math.floor(Math.random() * 3) + 1;

    if (turn === 1) {
      let newPos = positionP1 + roll;

      if (newPos >= boardLength) {
        newPos = newPos % boardLength;
      }

      setPositionP1(newPos);
    }

    if (turn === 2) {
      let newPos = positionP2 + roll;

      if (newPos >= boardLength) {
        newPos = newPos % boardLength;
      }

      setPositionP2(newPos);
    }

    // Switch turns
    setTurn(prev => (prev === 1 ? 2 : 1));
  };


  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">💖 Duopoly Lite – 2 Player Mode</h1>

      <div className="text-center mb-2 text-sm text-gray-600">
        <p>Player {turn}'s turn</p>
      </div>

      <Board
        tiles={tiles}
        positionP1={positionP1}
        positionP2={positionP2}
        onRoll={handleRoll}
        message={message}
      />
    </div>
  );
}
