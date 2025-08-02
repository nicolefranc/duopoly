// src/components/Tile.jsx
import React from 'react';
import { CHANCE, CHEST, CORNER, PROPERTY, UTILITY } from '../data/tiles';
import properties from '../data/properties';
import chance from '../data/chance';
import chest from '../data/chest';
import corner from '../data/corner';
import utilities from '../data/utilities';

export default function Tile({ tile, isP1, isP2, propertyOwnership, propertyHouses, properties, player1InJail, player2InJail }) {

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

  // Get property ownership and houses for property tiles
  const owner = tile.type === PROPERTY ? propertyOwnership[tile.idx] : null;
  const houses = tile.type === PROPERTY ? (propertyHouses[tile.idx] || 0) : 0;

  // Determine tile background color based on ownership
  const getTileBackground = () => {
    if (isP1 || isP2) return 'bg-pink-100 border-pink-400';
    if (owner === 1) return 'bg-pink-50 border-pink-300';
    if (owner === 2) return 'bg-blue-50 border-blue-300';
    return 'bg-white border-gray-300';
  };

  // Check if this is the Love Jail tile and if any player is in jail
  const isLoveJail = tile.type === CORNER && tileData && tileData.name === "Love Jail";
  const hasJailedPlayers = player1InJail || player2InJail;

  return (
    <div
      className={`w-28 h-28 border rounded flex flex-col items-center justify-center text-center text-xs font-semibold ${getTileBackground()}`}
    >
      { tileData && 
        <div className="mb-1">
          {tile.type === CHANCE ? "CHANCE" : tile.type === CHEST ? "CHEST" : tileData["name"]}
        </div>
      }

      {/* Property ownership indicator */}
      {tile.type === PROPERTY && owner && (
        <div className="text-xs mb-1">
          <span className={`px-1 py-0.5 rounded text-white ${
            owner === 1 ? 'bg-pink-500' : 'bg-blue-500'
          }`}>
            P{owner}
          </span>
        </div>
      )}

      {/* Houses indicator */}
      {tile.type === PROPERTY && houses > 0 && (
        <div className="flex gap-0.5 mb-1">
          {[...Array(houses)].map((_, i) => (
            <span key={i} className="text-green-600 text-xs">🏠</span>
          ))}
        </div>
      )}

      {/* Property price/rent info */}
      {tile.type === PROPERTY && (
        <div className="text-xs text-gray-600">
          {owner ? `Rent: ${tileData.rent + (houses * tileData.rent)}` : `$${tileData.price}`}
        </div>
      )}

      {/* Jail indicator */}
      {isLoveJail && hasJailedPlayers && (
        <div className="mt-1">
          <div className="text-xs text-red-600 font-semibold">🔒 Jail</div>
          <div className="flex gap-1 justify-center">
            {player1InJail && <span className="text-pink-600 text-xs">P1</span>}
            {player2InJail && <span className="text-blue-500 text-xs">P2</span>}
          </div>
        </div>
      )}

      {/* Player position indicators */}
      {(isP1 || isP2) && (
        <div className="mt-1 flex gap-1">
          {isP1 && <span className="text-pink-600 text-sm">P1 🎈</span>}
          {isP2 && <span className="text-blue-500 text-sm">P2 🎉</span>}
        </div>
      )}
    </div>
  );
}
