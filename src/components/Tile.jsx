// src/components/Tile.jsx
import React, { useState } from 'react';
import { CHANCE, CHEST, CORNER, PROPERTY, UTILITY } from '../data/tiles';
import properties from '../data/properties';
import chance from '../data/chance';
import chest from '../data/chest';
import corner from '../data/corner';
import utilities from '../data/utilities';
import boardImage from '../assets/board.png';

// Hover Card Components (shadcn style)
const HoverCard = ({ children, trigger, position }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {trigger}
      {isOpen && children}
    </div>
  );
};

const HoverCardContent = ({ children, position }) => {
  // Determine positioning based on tile location
  const getPositionClasses = () => {
    if (position <= 5) {
      // Top row - show below
      return "absolute top-full left-1/2 transform -translate-x-1/2 mt-2";
    } else if (position >= 15 && position <= 19) {
      // Bottom row - show above
      return "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    } else if (position === 6 || position === 14) {
      // Right side - show to the left
      return "absolute top-1/2 right-full transform -translate-y-1/2 mr-2";
    } else if (position === 10 || position === 18) {
      // Left side - show to the right
      return "absolute top-1/2 left-full transform -translate-y-1/2 ml-2";
    } else {
      // Center tiles - show above
      return "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getArrowClasses = () => {
    if (position <= 5) {
      // Top row - arrow pointing up
      return "absolute bottom-full left-1/2 transform -translate-x-1/2";
    } else if (position >= 15 && position <= 19) {
      // Bottom row - arrow pointing down
      return "absolute top-full left-1/2 transform -translate-x-1/2";
    } else if (position === 6 || position === 14) {
      // Right side - arrow pointing right
      return "absolute top-1/2 left-full transform -translate-y-1/2";
    } else if (position === 10 || position === 18) {
      // Left side - arrow pointing left
      return "absolute top-1/2 right-full transform -translate-y-1/2";
    } else {
      // Center tiles - arrow pointing down
      return "absolute top-full left-1/2 transform -translate-x-1/2";
    }
  };

  const getArrowDirection = () => {
    if (position <= 5) {
      return "border-8 border-transparent border-b-white";
    } else if (position >= 15 && position <= 19) {
      return "border-8 border-transparent border-t-white";
    } else if (position === 6 || position === 14) {
      return "border-8 border-transparent border-l-white";
    } else if (position === 10 || position === 18) {
      return "border-8 border-transparent border-r-white";
    } else {
      return "border-8 border-transparent border-t-white";
    }
  };

  return (
    <div className={`${getPositionClasses()} z-50`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-0 overflow-hidden w-64">
        {children}
      </div>
      {/* Arrow */}
      <div className={getArrowClasses()}>
        <div className={getArrowDirection()}></div>
      </div>
    </div>
  );
};

export default function Tile({ tile, isP1, isP2, propertyOwnership, propertyHouses, properties, player1InJail, player2InJail, position }) {
  const [showModal, setShowModal] = useState(false);

  // Calculate rent based on number of houses
  const calculateRent = (property, houses) => {
    if (houses === 0) {
      return property.rent;
    }
    return property.rentWithHouses[houses - 1] || property.rent;
  };
  
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

  // Get image path with fallback to board.png
  const getImagePath = () => {
    return tileData.imgPath;
  };

  // Get tile color based on type and set
  const getTileColor = () => {
    if (tile.type === PROPERTY) {
      const setColors = {
        memory: 'bg-pink-500',
        travel: 'bg-blue-500', 
        dream: 'bg-purple-500',
        event: 'bg-green-500'
      };
      return setColors[tileData.set] || 'bg-gray-500';
    }
    if (tile.type === CHANCE) return 'bg-orange-500';
    if (tile.type === CHEST) return 'bg-blue-500';
    if (tile.type === UTILITY) return 'bg-red-500';
    if (tile.type === CORNER) return 'bg-gray-500';
    return 'bg-gray-500';
  };

  const tileTrigger = (
    <div 
      className={`w-28 h-28 border rounded flex flex-col items-center justify-center text-center text-xs font-semibold ${getTileBackground()} ${tile.type !== CHEST && tile.type !== CHANCE ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={() => {
        if (tile.type !== CHEST && tile.type !== CHANCE) {
          setShowModal(true);
        }
      }}
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
                      {owner ? `Rent: ${calculateRent(tileData, houses)}` : `$${tileData.price}`}
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

    const TileCard = () => (
    <div className="flex flex-col h-80">
      {/* Card Header with Color Bar */}
      <div className={`h-4 ${getTileColor()}`}></div>
      
      {/* Card Image */}
      <div className="flex-1 p-4">
        <img 
          src={getImagePath()} 
          alt={tileData.name}
          className="w-full h-32 object-cover rounded mb-3"
        />
        
        {/* Card Title */}
        <h3 className="font-bold text-lg mb-2 text-gray-800 text-center">{tileData.name}</h3>
        
        {/* Card Type Badge */}
        <div className="flex justify-center mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">
            {tile.type}
          </span>
        </div>
        
        {/* Card Details */}
        <div className="space-y-2 text-sm">
          {/* Property Information */}
          {tile.type === PROPERTY && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-semibold">${tileData.price}</span>
              </div>
              <div className="flex justify-between">
                            <span className="text-gray-600">Rent:</span>
            <span className="font-semibold">${calculateRent(tileData, houses)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upgrade:</span>
                <span className="font-semibold">${tileData.upgradeCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Set:</span>
                <span className="font-semibold capitalize">{tileData.set}</span>
              </div>
              {owner && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Owner:</span>
                  <span className={`font-semibold ${owner === 1 ? 'text-pink-600' : 'text-blue-600'}`}>
                    Player {owner}
                  </span>
                </div>
              )}
              {houses > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Houses:</span>
                  <span className="font-semibold text-green-600">{houses}/4</span>
                </div>
              )}
            </>
          )}
          
          {/* Utility Information */}
          {tile.type === UTILITY && (
            <div className="flex justify-between">
              <span className="text-gray-600">Cost:</span>
              <span className="font-semibold text-red-600">${Math.abs(tileData.reward)}</span>
            </div>
          )}
          
          {/* Chance/Chest Information */}
          {(tile.type === CHANCE || tile.type === CHEST) && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Reward:</span>
                <span className={`font-semibold ${tileData.reward >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tileData.reward >= 0 ? '+' : ''}{tileData.reward} coins
                </span>
              </div>
              {tileData.manual !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">{tileData.manual ? 'Manual Task' : 'Automatic'}</span>
                </div>
              )}
            </>
          )}
          
          {/* Corner Information */}
          {tile.type === CORNER && (
            <>
              {tileData.reward !== 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reward:</span>
                  <span className="font-semibold text-green-600">+{tileData.reward} coins</span>
                </div>
              )}
              {tileData.name === "Love Jail" && (
                <div className="text-center">
                  <span className="text-red-600 font-semibold">Jail Location</span>
                </div>
              )}
              {tileData.name === "Go to love jail" && (
                <div className="text-center">
                  <span className="text-red-600 font-semibold">Go to Jail</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {tile.type !== CHEST && tile.type !== CHANCE ? (
        <HoverCard trigger={tileTrigger} position={position}>
          <HoverCardContent position={position}>
            {tileData && <TileCard />}
          </HoverCardContent>
        </HoverCard>
      ) : (
        tileTrigger
      )}

      {/* Click Modal */}
      {showModal && tileData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-0 overflow-hidden w-80 max-h-[90vh] overflow-y-auto">
            <TileCard />
            <div className="p-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
