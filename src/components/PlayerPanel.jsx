import React from 'react';
import Dice from './Dice';

export default function PlayerPanel({
  player1Coins,
  player2Coins,
  turn,
  propertyOwnership,
  propertyHouses,
  properties,
  tiles,
  onRoll,
  message,
  player1InJail,
  player2InJail,
  player1JailTurns,
  player2JailTurns
}) {
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

  const player1Properties = getPlayerProperties(1);
  const player2Properties = getPlayerProperties(2);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
      <h2 className="text-xl font-bold mb-4 text-center">Player Information</h2>
      
      {/* Current Turn */}
      <div className="mb-6 text-center">
        <div className={`text-lg font-semibold p-3 rounded-lg ${
          turn === 1 ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
        }`}>
          Player {turn}'s Turn
        </div>
      </div>

      {/* Player 1 Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-pink-600 text-lg">🎈</span>
          <h3 className="font-bold text-pink-600">Player 1</h3>
        </div>
        <div className="bg-pink-50 p-3 rounded-lg">
          <p className="font-semibold">Coins: {player1Coins}</p>
          <p className="text-sm text-gray-600">Properties: {player1Properties.length}</p>
          {player1InJail && (
            <div className="mt-2 p-2 bg-red-100 rounded text-xs">
              <p className="font-semibold text-red-700">🔒 In Love Jail</p>
              <p className="text-red-600">Turns remaining: {player1JailTurns}</p>
            </div>
          )}
        </div>
        
        {/* Player 1 Properties */}
        {player1Properties.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Owned Properties:</p>
            <div className="space-y-2">
              {player1Properties.map((property) => (
                <div key={property.propertyIndex} className="bg-pink-50 p-2 rounded text-xs">
                  <p className="font-semibold">{property.name}</p>
                  <p className="text-gray-600">Houses: {property.houses}/4</p>
                  <p className="text-gray-600">Rent: {calculateRent(property, property.houses)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Player 2 Info */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-500 text-lg">🎉</span>
          <h3 className="font-bold text-blue-500">Player 2</h3>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="font-semibold">Coins: {player2Coins}</p>
          <p className="text-sm text-gray-600">Properties: {player2Properties.length}</p>
          {player2InJail && (
            <div className="mt-2 p-2 bg-red-100 rounded text-xs">
              <p className="font-semibold text-red-700">🔒 In Love Jail</p>
              <p className="text-red-600">Turns remaining: {player2JailTurns}</p>
            </div>
          )}
        </div>
        
        {/* Player 2 Properties */}
        {player2Properties.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">Owned Properties:</p>
            <div className="space-y-2">
              {player2Properties.map((property) => (
                <div key={property.propertyIndex} className="bg-blue-50 p-2 rounded text-xs">
                  <p className="font-semibold">{property.name}</p>
                  <p className="text-gray-600">Houses: {property.houses}/4</p>
                  <p className="text-gray-600">Rent: {calculateRent(property, property.houses)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dice */}
      <div className="text-center mb-4">
        <Dice onRoll={onRoll} />
      </div>

      {/* Game Messages */}
      {message && (
        <div className="mt-4">
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{message}</p>
          </div>
        </div>
      )}

      {/* Game Rules */}
      <div className="mt-6 text-xs text-gray-600">
        <h4 className="font-semibold mb-2">Game Rules:</h4>
        <ul className="space-y-1">
          <li>• Start with 800 coins each</li>
          <li>• Buy properties when you land on them</li>
          <li>• Build houses on your properties (max 4)</li>
          <li>• Pay rent when landing on opponent's property</li>
          <li>• Rent increases with each house</li>
        </ul>
      </div>
    </div>
  );
} 