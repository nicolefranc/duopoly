import React from 'react';
import Tile from './Tile';

export default function Board({ tiles, positionP1, positionP2, propertyOwnership, propertyHouses, properties }) {
  // Define square layout: clockwise, with empty center
  const o = -1
  const boardLayout = [
    0, 1, 2, 3, 4, 5,
    19, o, o, o, o, 6,
    18, o, o, o, o, 7,
    17, o, o, o, o, 8,
    16, o, o, o, o, 9,
    15, 14, 13, 12, 11, 10,
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-6 grid-rows-6 gap-1">
        {boardLayout.map((tileIndex, i) => {
          if (tileIndex === o) {
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
                propertyOwnership={propertyOwnership}
                propertyHouses={propertyHouses}
                properties={properties}
              />
            )
          }
        })}
      </div>
    </div>
  );
}
