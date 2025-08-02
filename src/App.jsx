import React, { useState, useEffect } from 'react';
import tiles from './data/tiles';
import properties from './data/properties';
import Board from './components/Board';
import PlayerPanel from './components/PlayerPanel';

export default function App() {
  const boardLength = Object.keys(tiles).length - 1;

  const [positionP1, setPositionP1] = useState(0);
  const [positionP2, setPositionP2] = useState(0);
  const [turn, setTurn] = useState(1);
  const [message, setMessage] = useState('');
  
  // Player economy state
  const [player1Coins, setPlayer1Coins] = useState(100);
  const [player2Coins, setPlayer2Coins] = useState(100);
  const [propertyOwnership, setPropertyOwnership] = useState({});
  const [propertyHouses, setPropertyHouses] = useState({});
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);

  // Initialize properties with no owners
  useEffect(() => {
    const initialOwnership = {};
    const initialHouses = {};
    properties.forEach((property, index) => {
      initialOwnership[index] = null;
      initialHouses[index] = 0;
    });
    setPropertyOwnership(initialOwnership);
    setPropertyHouses(initialHouses);
  }, []);

  const getCurrentPlayerCoins = () => turn === 1 ? player1Coins : player2Coins;
  const setCurrentPlayerCoins = (amount) => {
    if (turn === 1) {
      setPlayer1Coins(amount);
    } else {
      setPlayer2Coins(amount);
    }
  };

  const getPropertyAtPosition = (position) => {
    const tile = tiles[position];
    if (tile && tile.type === 'property') {
      return properties[tile.idx];
    }
    return null;
  };

  const handlePropertyAction = (action, propertyIndex) => {
    const property = properties[propertyIndex];
    
    if (action === 'buy') {
      if (getCurrentPlayerCoins() >= property.price) {
        setCurrentPlayerCoins(getCurrentPlayerCoins() - property.price);
        setPropertyOwnership(prev => ({ ...prev, [propertyIndex]: turn }));
        setMessage(`Player ${turn} bought ${property.name} for ${property.price} coins!`);
      } else {
        setMessage(`Player ${turn} doesn't have enough coins to buy ${property.name}!`);
      }
    } else if (action === 'build') {
      const currentHouses = propertyHouses[propertyIndex] || 0;
      if (currentHouses < 4 && getCurrentPlayerCoins() >= property.upgradeCost) {
        setCurrentPlayerCoins(getCurrentPlayerCoins() - property.upgradeCost);
        setPropertyHouses(prev => ({ ...prev, [propertyIndex]: currentHouses + 1 }));
        setMessage(`Player ${turn} built a house on ${property.name} for ${property.upgradeCost} coins!`);
      } else if (currentHouses >= 4) {
        setMessage(`${property.name} already has the maximum number of houses!`);
      } else {
        setMessage(`Player ${turn} doesn't have enough coins to build a house!`);
      }
    }
    
    setShowActionModal(false);
    setCurrentAction(null);
    
    // Switch turns after action is completed
    setTimeout(() => {
      setTurn(prev => (prev === 1 ? 2 : 1));
    }, 1000);
  };

  const handleLanding = (position) => {
    const property = getPropertyAtPosition(position);
    
    if (!property) {
      // No property at this position, switch turns
      setTimeout(() => {
        setTurn(prev => (prev === 1 ? 2 : 1));
      }, 500);
      return;
    }

    const propertyIndex = tiles[position].idx;
    const owner = propertyOwnership[propertyIndex];
    const currentHouses = propertyHouses[propertyIndex] || 0;

    if (owner === null) {
      // Property is unowned - offer to buy
      setCurrentAction({
        type: 'buy',
        property: property,
        propertyIndex: propertyIndex
      });
      setShowActionModal(true);
    } else if (owner === turn) {
      // Player owns the property - offer to build house
      if (currentHouses < 4) {
        setCurrentAction({
          type: 'build',
          property: property,
          propertyIndex: propertyIndex,
          currentHouses: currentHouses
        });
        setShowActionModal(true);
      } else {
        // Max houses reached, switch turns
        setTimeout(() => {
          setTurn(prev => (prev === 1 ? 2 : 1));
        }, 500);
      }
    } else {
      // Opponent owns the property - pay rent
      const rentAmount = property.rent + (currentHouses * property.rent);
      const currentCoins = getCurrentPlayerCoins();
      
      if (currentCoins >= rentAmount) {
        setCurrentPlayerCoins(currentCoins - rentAmount);
        if (turn === 1) {
          setPlayer2Coins(player2Coins + rentAmount);
        } else {
          setPlayer1Coins(player1Coins + rentAmount);
        }
        setMessage(`Player ${turn} paid ${rentAmount} coins rent to Player ${owner} for ${property.name}!`);
      } else {
        // Player can't afford rent - they lose
        setMessage(`Player ${turn} can't afford the rent and loses the game!`);
      }
      
      // Switch turns after rent payment
      setTimeout(() => {
        setTurn(prev => (prev === 1 ? 2 : 1));
      }, 1000);
    }
  };

  const handleRoll = () => {
    const roll = Math.floor(Math.random() * 3) + 1;
    let newPos;

    if (turn === 1) {
      newPos = positionP1 + roll;
      if (newPos >= boardLength) {
        newPos = newPos % boardLength;
      }
      setPositionP1(newPos);
    } else {
      newPos = positionP2 + roll;
      if (newPos >= boardLength) {
        newPos = newPos % boardLength;
      }
      setPositionP2(newPos);
    }

    setMessage(`Player ${turn} rolled a ${roll}!`);

    // Handle landing on property
    setTimeout(() => {
      handleLanding(newPos);
    }, 1000);
  };

  const skipAction = () => {
    setShowActionModal(false);
    setCurrentAction(null);
    
    // Switch turns after skipping action
    setTimeout(() => {
      setTurn(prev => (prev === 1 ? 2 : 1));
    }, 500);
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">💖 Duopoly Lite – 2 Player Mode</h1>

      <div className="flex gap-8">
        {/* Player Panel on the left */}
        <div className="w-80">
          <PlayerPanel
            player1Coins={player1Coins}
            player2Coins={player2Coins}
            turn={turn}
            propertyOwnership={propertyOwnership}
            propertyHouses={propertyHouses}
            properties={properties}
            tiles={tiles}
            onRoll={handleRoll}
            message={message}
          />
        </div>

        {/* Board on the right */}
        <div className="flex-1">
          <Board
            tiles={tiles}
            positionP1={positionP1}
            positionP2={positionP2}
            propertyOwnership={propertyOwnership}
            propertyHouses={propertyHouses}
            properties={properties}
          />
        </div>
      </div>

      {/* Action Modal */}
      {showActionModal && currentAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">
              {currentAction.type === 'buy' ? 'Buy Property' : 'Build House'}
            </h3>
            
            <div className="mb-4">
              <p className="font-semibold">{currentAction.property.name}</p>
              {currentAction.type === 'buy' ? (
                <p>Price: {currentAction.property.price} coins</p>
              ) : (
                <p>Upgrade Cost: {currentAction.property.upgradeCost} coins</p>
              )}
              <p>Current Coins: {getCurrentPlayerCoins()}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePropertyAction(currentAction.type, currentAction.propertyIndex)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {currentAction.type === 'buy' ? 'Buy' : 'Build'}
              </button>
              <button
                onClick={skipAction}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
