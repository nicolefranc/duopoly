import React from 'react';
import Tile from './Tile';
import Dice from './Dice';
import { CHANCE, CHEST } from '../data/tiles';

export default function Board({ tiles, positionP1, positionP2, onRoll, message }) {
  // Define square layout: clockwise, with dice in center (null)
  const o = -1
  const boardLayout = [
    0, 1, 2, 3, 4, 5,
    19, o, o, o, o, 6,
    18, o, o, o, o, 7,
    17, o, o, null, o, 8,
    16, o, o, o, o, 9,
    15, 14, 13, 12, 11, 10,
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-6 grid-rows-6 gap-1">
        {boardLayout.map((tileIndex, i) => {
          if (tileIndex === null) {
            return (
              <div key={i} className="flex items-center justify-center w-28 h-28">
                <Dice onRoll={onRoll} />
              </div>
            )
          } else if (tileIndex === o) {
            return (
              <div key={i} className="flex items-center justify-center w-28 h-28">
              </div>
            )
          } else {
            return (
              <Tile
                key={i}
                tile={tiles[tileIndex]}
                isP1={positionP1 === tileIndex}
                isP2={positionP2 === tileIndex}
              />
            )
          }
        })}
      </div>

      {message && (
        <div className="mt-4 text-center max-w-sm">
          <pre className="bg-white p-4 rounded shadow whitespace-pre-wrap">
            {message}
          </pre>
        </div>
      )}
    </div>
  );
}
