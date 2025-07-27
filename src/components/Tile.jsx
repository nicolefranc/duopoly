// src/components/Tile.jsx
import React from 'react';
import { CHANCE, CHEST, CORNER, PROPERTY, UTILITY } from '../data/tiles';
import properties from '../data/properties';
import chance from '../data/chance';
import chest from '../data/chest';
import corner from '../data/corner';
import utilities from '../data/utilities';

export default function Tile({ tile, isP1, isP2 }) {

  let tileData

  switch (tile.type) {
    case PROPERTY:
      tileData = properties[tile.idx]
      break
    case UTILITY:
      tileData = utilities[tile.idx]
      break
    case CHANCE:
      tileData = chance[tile.idx]
      break
    case CHEST:
      tileData = chest[tile.idx]
      break
    case CORNER:
      tileData = corner[tile.idx]
      break
    default:
      tileData = {}
  }


  return (
    <div
      className={`w-28 h-28 border rounded flex flex-col items-center justify-center text-center text-xs font-semibold 
        ${isP1 || isP2 ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-300'}`}
    >
      <div>{tileData && tileData["name"]}</div>

      {(isP1 || isP2) && (
        <div className="mt-1 flex gap-1">
          {isP1 && <span className="text-pink-600 text-sm">P1 🎈</span>}
          {isP2 && <span className="text-blue-500 text-sm">P2 🎉</span>}
        </div>
      )}
    </div>
  );
}
