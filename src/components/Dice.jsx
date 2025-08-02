import React from 'react';

export default function Dice({ onRoll }) {
  return (
    <button
      onClick={onRoll}
      className="bg-pink-400 hover:bg-pink-500 text-white text-sm px-4 py-2 rounded-full shadow"
    >
      Roll Dice 🎲
    </button>
  );
}
