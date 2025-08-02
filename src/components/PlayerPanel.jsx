import React from 'react';
import Dice from './Dice';

export default function PlayerPanel({
  playerNumber,
  playerCoins,
  turn,
  propertyOwnership,
  propertyHouses,
  properties,
  tiles,
  onRoll,
  playerInJail,
  playerJailTurns
}) {
  // Player configuration - easy to change names and emojis
  const playerConfig = {
    1: {
      name: "Player 1",
      emoji: "🎉",
      color: "pink"
    },
    2: {
      name: "Player 2", 
      emoji: "🎉",
      color: "blue"
    }
  };

  // Calculate rent based on number of houses
  const calculateRent = (property, houses) => {
    if (houses === 0) {
      return property.rent;
    }
    return property.rentWithHouses[houses - 1] || property.rent;
  };

  const getPlayerProperties = (playerNumber) => {
    const ownedProperties = [];
    Object.entries(propertyOwnership).forEach(([propertyIndex, owner]) => {
      if (owner === playerNumber) {
        const property = properties[parseInt(propertyIndex)];
        const houses = propertyHouses[propertyIndex] || 0;
        ownedProperties.push({ ...property, houses, propertyIndex: parseInt(propertyIndex) });
      }
    });
    return ownedProperties;
  };

  const playerProperties = getPlayerProperties(playerNumber);
  const currentPlayer = playerConfig[playerNumber];
  const isCurrentTurn = turn === playerNumber;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit w-80">
      <h2 className="text-xl font-bold mb-4 text-center">{currentPlayer.name}</h2>
      
      {/* Current Turn Indicator */}
      <div className="mb-6 text-center">
        <div className={`text-lg font-semibold p-3 rounded-lg ${
          isCurrentTurn ? `bg-${currentPlayer.color}-100 text-${currentPlayer.color}-800` : 'bg-gray-100 text-gray-600'
        }`}>
          {isCurrentTurn ? 'Your Turn!' : 'Waiting...'}
        </div>
      </div>

      {/* Player Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-${currentPlayer.color}-600 text-lg`}>{currentPlayer.emoji}</span>
          <h3 className={`font-bold text-${currentPlayer.color}-600`}>{currentPlayer.name}</h3>
        </div>
        <div className={`bg-${currentPlayer.color}-50 p-3 rounded-lg`}>
          <p className="font-semibold">Coins: {playerCoins}</p>
          <p className="text-sm text-gray-600">Properties: {playerProperties.length}</p>
          {playerInJail && (
            <div className="mt-2 p-2 bg-red-100 rounded text-xs">
              <p className="font-semibold text-red-700">🔒 In Love Jail</p>
              <p className="text-red-600">Turns remaining: {playerJailTurns}</p>
            </div>
          )}
        </div>
        
        {/* Player Properties */}
        {playerProperties.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Owned Properties:</p>
            <div className="space-y-2">
              {playerProperties.map((property) => (
                <div key={property.propertyIndex} className={`bg-${currentPlayer.color}-50 p-2 rounded text-xs`}>
                  <p className="font-semibold">{property.name}</p>
                  <p className="text-gray-600">Houses: {property.houses}/4</p>
                  <p className="text-gray-600">Rent: {calculateRent(property, property.houses)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 