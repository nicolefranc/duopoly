import React, { useState, useEffect } from 'react';
import tiles from './data/tiles';
import properties from './data/properties';
import chest from './data/chest';
import chance from './data/chance';
import utilities from './data/utilities';
import corner from './data/corner';
import Board from './components/Board';
import PlayerPanel from './components/PlayerPanel';

export default function App() {
  const boardLength = Object.keys(tiles).length - 1;

  const [positionP1, setPositionP1] = useState(0);
  const [positionP2, setPositionP2] = useState(0);
  const [turn, setTurn] = useState(1);
  const [message, setMessage] = useState('');
  
  // Player economy state
  const [player1Coins, setPlayer1Coins] = useState(650);
  const [player2Coins, setPlayer2Coins] = useState(650);
  const [propertyOwnership, setPropertyOwnership] = useState({});
  const [propertyHouses, setPropertyHouses] = useState({});
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showBailModal, setShowBailModal] = useState(false);
  const [showBankruptcyModal, setShowBankruptcyModal] = useState(false);
  const [showSellPropertiesModal, setShowSellPropertiesModal] = useState(false);
  const [bankruptPlayer, setBankruptPlayer] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  
  // Jail system state
  const [player1JailTurns, setPlayer1JailTurns] = useState(0);
  const [player2JailTurns, setPlayer2JailTurns] = useState(0);
  const [player1InJail, setPlayer1InJail] = useState(false);
  const [player2InJail, setPlayer2InJail] = useState(false);
  const [player1CanBeBailed, setPlayer1CanBeBailed] = useState(false);
  const [player2CanBeBailed, setPlayer2CanBeBailed] = useState(false);

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

  const getCurrentPlayerJailState = () => {
    if (turn === 1) {
      return {
        inJail: player1InJail,
        jailTurns: player1JailTurns,
        canBeBailed: player1CanBeBailed
      };
    } else {
      return {
        inJail: player2InJail,
        jailTurns: player2JailTurns,
        canBeBailed: player2CanBeBailed
      };
    }
  };

  const setCurrentPlayerJailState = (inJail, jailTurns, canBeBailed) => {
    if (turn === 1) {
      setPlayer1InJail(inJail);
      setPlayer1JailTurns(jailTurns);
      setPlayer1CanBeBailed(canBeBailed);
    } else {
      setPlayer2InJail(inJail);
      setPlayer2JailTurns(jailTurns);
      setPlayer2CanBeBailed(canBeBailed);
    }
  };

  const sendPlayerToJail = (playerNumber) => {
    if (playerNumber === 1) {
      setPlayer1InJail(true);
      setPlayer1JailTurns(2);
      setPlayer1CanBeBailed(false);
      setPositionP1(15); // Move to Love Jail position
    } else {
      setPlayer2InJail(true);
      setPlayer2JailTurns(2);
      setPlayer2CanBeBailed(false);
      setPositionP2(15); // Move to Love Jail position
    }
  };

  const handleBailOut = (jailedPlayer) => {
    const bailingPlayer = jailedPlayer === 1 ? 2 : 1;
    const bailingPlayerCoins = bailingPlayer === 1 ? player1Coins : player2Coins;
    
    if (bailingPlayerCoins >= 15) {
      // Deduct coins from bailing player
      if (bailingPlayer === 1) {
        setPlayer1Coins(player1Coins - 15);
      } else {
        setPlayer2Coins(player2Coins - 15);
      }
      
      // Release jailed player
      if (jailedPlayer === 1) {
        setPlayer1InJail(false);
        setPlayer1JailTurns(0);
        setPlayer1CanBeBailed(false);
      } else {
        setPlayer2InJail(false);
        setPlayer2JailTurns(0);
        setPlayer2CanBeBailed(false);
      }
      
      setMessage(`Player ${bailingPlayer} bailed out Player ${jailedPlayer} for 15 coins! 💖`);
      setShowBailModal(false);
    } else {
      setMessage(`Player ${bailingPlayer} doesn't have enough coins to bail out Player ${jailedPlayer}!`);
    }
  };

  const getPlayerProperties = (playerNumber) => {
    const ownedProperties = [];
    Object.entries(propertyOwnership).forEach(([propertyIndex, owner]) => {
      if (owner === playerNumber) {
        const property = properties[parseInt(propertyIndex)];
        const houses = propertyHouses[propertyIndex] || 0;
        ownedProperties.push({ 
          ...property, 
          houses, 
          propertyIndex: parseInt(propertyIndex),
          sellPrice: Math.floor(property.price * 0.8) // 20% less than original price
        });
      }
    });
    return ownedProperties;
  };

  const checkBankruptcy = (playerNumber) => {
    const playerCoins = playerNumber === 1 ? player1Coins : player2Coins;
    const playerProperties = getPlayerProperties(playerNumber);
    
    console.log(`Checking bankruptcy for Player ${playerNumber}:`, { playerCoins, propertyCount: playerProperties.length });
    
    if (playerCoins < 0) {
      console.log(`Player ${playerNumber} has negative coins: ${playerCoins}`);
      if (playerProperties.length === 0) {
        // No properties to sell - declare bankruptcy
        console.log(`Player ${playerNumber} has no properties - declaring bankruptcy`);
        setBankruptPlayer(playerNumber);
        setShowBankruptcyModal(true);
        setGameEnded(true);
        return true;
      } else {
        // Has properties - offer to sell them
        console.log(`Player ${playerNumber} has ${playerProperties.length} properties - offering to sell`);
        setBankruptPlayer(playerNumber);
        setShowSellPropertiesModal(true);
        return true;
      }
    }
    return false;
  };

  const sellProperty = (propertyIndex) => {
    const property = properties[propertyIndex];
    const houses = propertyHouses[propertyIndex] || 0;
    const sellPrice = Math.floor(property.price * 0.8);
    
    // Remove houses from the property
    setPropertyHouses(prev => ({ ...prev, [propertyIndex]: 0 }));
    
    // Remove ownership
    setPropertyOwnership(prev => ({ ...prev, [propertyIndex]: null }));
    
    // Add coins to the player
    if (bankruptPlayer === 1) {
      setPlayer1Coins(prev => {
        const newCoins = prev + sellPrice;
        console.log(`Player 1 sold ${property.name} for ${sellPrice}, new balance: ${newCoins}`);
        return newCoins;
      });
    } else {
      setPlayer2Coins(prev => {
        const newCoins = prev + sellPrice;
        console.log(`Player 2 sold ${property.name} for ${sellPrice}, new balance: ${newCoins}`);
        return newCoins;
      });
    }
    
    setMessage(`Player ${bankruptPlayer} sold ${property.name} for ${sellPrice} coins!`);
    
    // Check if player is still bankrupt after selling
    setTimeout(() => {
      const currentCoins = bankruptPlayer === 1 ? player1Coins : player2Coins;
      console.log(`Checking bankruptcy after sale for Player ${bankruptPlayer}, coins: ${currentCoins}`);
      
      if (currentCoins < 0) {
        const remainingProperties = getPlayerProperties(bankruptPlayer);
        console.log(`Player ${bankruptPlayer} still has ${remainingProperties.length} properties`);
        
        if (remainingProperties.length === 0) {
          console.log(`Player ${bankruptPlayer} has no more properties - declaring bankruptcy`);
          setShowSellPropertiesModal(false);
          setShowBankruptcyModal(true);
          setGameEnded(true);
        }
      } else {
        console.log(`Player ${bankruptPlayer} is no longer bankrupt`);
        // Don't automatically close modal - let player choose when to continue
      }
    }, 100);
  };

  const checkIfPassedPicnic = (oldPos, newPos) => {
    return (newPos < oldPos) || oldPos === 0
    // // "Have a picnic" is at position 0
    // const picnicPosition = 0;
    
    // // If player moved from a position after picnic to a position before picnic (wrapped around)
    // if (oldPos > picnicPosition && newPos < picnicPosition) {
    //   return true;
    // }
    
    // // If player moved from a position before picnic to a position after picnic (normal forward movement)
    // if (oldPos < picnicPosition && newPos > picnicPosition) {
    //   return true;
    // }
    
    // // If player landed exactly on picnic (this shouldn't happen with the new logic, but just in case)
    // if (newPos === picnicPosition) {
    //   return false; // Don't give reward for landing on it, only for passing
    // }
    
    // return false;
  };

  const getPropertyAtPosition = (position) => {
    const tile = tiles[position];
    if (tile && tile.type === 'property') {
      return properties[tile.idx];
    }
    return null;
  };

  // Calculate rent based on number of houses
  const calculateRent = (property, houses) => {
    if (houses === 0) {
      return property.rent;
    }
    return property.rentWithHouses[houses - 1] || property.rent;
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
    
    // Check for bankruptcy after property action
    if (checkBankruptcy(turn)) {
      return; // Don't switch turns if bankruptcy modal is shown
    }
    
    // Switch turns after action is completed
    setTimeout(() => {
      setTurn(prev => (prev === 1 ? 2 : 1));
    }, 1000);
  };

  const handleLanding = (position) => {
    const tile = tiles[position];
    
    if (tile.type === 'chest') {
      // Handle chest card
      const shuffledChest = [...chest].sort(() => Math.random() - 0.5);
      const selectedCard = shuffledChest[0];
      setCurrentCard({
        type: 'chest',
        card: selectedCard,
        position: position
      });
      setShowCardModal(true);
      return;
    }
    
    if (tile.type === 'chance') {
      // Handle chance card
      const shuffledChance = [...chance].sort(() => Math.random() - 0.5);
      const selectedCard = shuffledChance[0];
      setCurrentCard({
        type: 'chance',
        card: selectedCard,
        position: position
      });
      setShowCardModal(true);
      return;
    }
    
    if (tile.type === 'utility') {
      // Handle utility card - automatic reward
      const utility = utilities[tile.idx];
      const currentCoins = getCurrentPlayerCoins();
      const newCoins = Math.max(0, currentCoins + utility.reward);
      setCurrentPlayerCoins(newCoins);
      
      const rewardText = utility.reward >= 0 ? `gained ${utility.reward}` : `lost ${Math.abs(utility.reward)}`;
      setMessage(`Player ${turn} ${rewardText} coins from ${utility.name}!`);
      
      // Check for bankruptcy after utility
      if (checkBankruptcy(turn)) {
        return; // Don't switch turns if bankruptcy modal is shown
      }
      
      // Switch turns after a delay if no bankruptcy
      setTimeout(() => {
        setTurn(prev => (prev === 1 ? 2 : 1));
      }, 1000);
      return;
    }
    
    if (tile.type === 'corner') {
      // Handle corner card
      const cornerCard = corner[tile.idx];
      
      if (cornerCard.name === "Go to love jail") {
        // Send player to jail
        sendPlayerToJail(turn);
        setMessage(`Player ${turn} was sent to Love Jail! 💔`);
        
        // Switch turns immediately
        setTimeout(() => {
          setTurn(prev => (prev === 1 ? 2 : 1));
        }, 1000);
        return;
      } else if (cornerCard.name === "Love Jail") {
        // Player is already in jail, just switch turns
        setTimeout(() => {
          setTurn(prev => (prev === 1 ? 2 : 1));
        }, 500);
        return;
      } else if (cornerCard.name === "Have a picnic") {
        // No reward for landing on picnic - only for passing it
        setTimeout(() => {
          setTurn(prev => (prev === 1 ? 2 : 1));
        }, 500);
        return;
      } else {
        // Other corner cards - automatic reward
        const currentCoins = getCurrentPlayerCoins();
        const newCoins = Math.max(0, currentCoins + cornerCard.reward);
        setCurrentPlayerCoins(newCoins);
        
        const rewardText = cornerCard.reward >= 0 ? `gained ${cornerCard.reward}` : `lost ${Math.abs(cornerCard.reward)}`;
        setMessage(`Player ${turn} ${rewardText} coins from ${cornerCard.name}!`);
        
        // Check for bankruptcy after corner card
        if (checkBankruptcy(turn)) {
          return; // Don't switch turns if bankruptcy modal is shown
        }
        
        // Switch turns after a delay if no bankruptcy
        setTimeout(() => {
          setTurn(prev => (prev === 1 ? 2 : 1));
        }, 1000);
        return;
      }
    }
    
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
    const rentAmount = calculateRent(property, currentHouses);
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
        // Player can't afford rent - pay what they can and check bankruptcy
        setCurrentPlayerCoins(0);
        if (turn === 1) {
          setPlayer2Coins(player2Coins + currentCoins);
        } else {
          setPlayer1Coins(player1Coins + currentCoins);
        }
        setMessage(`Player ${turn} paid all their coins (${currentCoins}) but still owes ${rentAmount - currentCoins}!`);
        
        // Check for bankruptcy immediately
        if (checkBankruptcy(turn)) {
          return; // Don't switch turns if bankruptcy modal is shown
        }
        
        // Switch turns after a delay if no bankruptcy
        setTimeout(() => {
          setTurn(prev => (prev === 1 ? 2 : 1));
        }, 1000);
        return;
      }
      
      // Switch turns after rent payment
      setTimeout(() => {
        setTurn(prev => (prev === 1 ? 2 : 1));
      }, 1000);
    }
  };

  const handleRoll = () => {
    if (gameEnded) return; // Don't allow rolling if game is over
    
    const currentJailState = getCurrentPlayerJailState();
    
    // Check if current player is in jail
    if (currentJailState.inJail) {
      if (currentJailState.jailTurns > 0) {
        // Player is still serving jail time
        const newJailTurns = currentJailState.jailTurns - 1;
        setCurrentPlayerJailState(true, newJailTurns, newJailTurns === 0);
        
        if (newJailTurns === 0) {
          setMessage(`Player ${turn} has served their jail time and can be bailed out!`);
          // Check if other player can bail them out
          const otherPlayer = turn === 1 ? 2 : 1;
          const otherPlayerCoins = otherPlayer === 1 ? player1Coins : player2Coins;
          
          if (otherPlayerCoins >= 15) {
            setShowBailModal(true);
          } else {
            setMessage(`Player ${otherPlayer} doesn't have enough coins to bail out Player ${turn}. Player ${turn} will be released automatically.`);
            setTimeout(() => {
              setCurrentPlayerJailState(false, 0, false);
              setTurn(prev => (prev === 1 ? 2 : 1));
            }, 2000);
          }
        } else {
          setMessage(`Player ${turn} is in jail for ${newJailTurns} more turn(s).`);
          setTimeout(() => {
            setTurn(prev => (prev === 1 ? 2 : 1));
          }, 1000);
        }
      } else {
        // Player can be bailed out
        setMessage(`Player ${turn} can be bailed out of jail!`);
        setShowBailModal(true);
      }
      return;
    }
    
    const roll = Math.floor(Math.random() * 3) + 1;
    let newPos;
    let oldPos;

    if (turn === 1) {
      oldPos = positionP1;
      newPos = positionP1 + roll;
      if (newPos >= boardLength) {
        newPos = newPos % boardLength;
      }
      setPositionP1(newPos);
    } else {
      oldPos = positionP2;
      newPos = positionP2 + roll;
      if (newPos >= boardLength) {
        newPos = newPos % boardLength;
      }
      setPositionP2(newPos);
    }

    setMessage(`Player ${turn} rolled a ${roll}!`);

    // Check if player passed "Have a picnic" (position 0)
    const passedPicnic = checkIfPassedPicnic(oldPos, newPos);
    if (passedPicnic) {
      const currentCoins = getCurrentPlayerCoins();
      const newCoins = currentCoins + 150; // Picnic reward
      setCurrentPlayerCoins(newCoins);
      setMessage(`Player ${turn} passed "Have a picnic" and gained 150 coins! 🧺`);
    }

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

  const handleCardReward = () => {
    if (currentCard) {
      const reward = currentCard.card.reward;
      const currentCoins = getCurrentPlayerCoins();
      const newCoins = currentCoins + reward; // Allow negative coins for bankruptcy check
      
      setCurrentPlayerCoins(newCoins);
      
      const rewardText = reward >= 0 ? `gained ${reward}` : `lost ${Math.abs(reward)}`;
      setMessage(`Player ${turn} ${rewardText} coins from ${currentCard.type} card!`);
    }
    
    setShowCardModal(false);
    setCurrentCard(null);
    
    // Check for bankruptcy after card reward
    if (checkBankruptcy(turn)) {
      return; // Don't switch turns if bankruptcy modal is shown
    }
    
    // Switch turns after card action
    setTimeout(() => {
    setTurn(prev => (prev === 1 ? 2 : 1));
    }, 1000);
  };

  const skipCardReward = () => {
    setShowCardModal(false);
    setCurrentCard(null);
    
    // Switch turns after skipping card
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
            player1InJail={player1InJail}
            player2InJail={player2InJail}
            player1JailTurns={player1JailTurns}
            player2JailTurns={player2JailTurns}
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
            player1InJail={player1InJail}
            player2InJail={player2InJail}
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

      {/* Card Modal */}
      {showCardModal && currentCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold mb-2">
                {currentCard.type === 'chest' ? '💎 Chest Card' : '🎲 Chance Card'}
              </h3>
              <div className={`p-4 rounded-lg mb-4 ${
                currentCard.type === 'chest' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-orange-50 border-2 border-orange-200'
              }`}>
                <p className="font-semibold text-gray-800 mb-2">{currentCard.card.name}</p>
                <p className={`text-lg font-bold ${
                  currentCard.card.reward >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currentCard.card.reward >= 0 ? '+' : ''}{currentCard.card.reward} coins
                </p>
                {currentCard.card.manual !== undefined && (
                  <p className="text-sm text-gray-600 mt-2">
                    {currentCard.card.manual ? 'Manual task required' : 'Automatic reward'}
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-600">Current Coins: {getCurrentPlayerCoins()}</p>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCardReward}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Award Reward
              </button>
              <button
                onClick={skipCardReward}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bail Modal */}
      {showBailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold mb-2">💖 Bail Out Opportunity</h3>
              <div className="p-4 rounded-lg mb-4 bg-pink-50 border-2 border-pink-200">
                <p className="font-semibold text-gray-800 mb-2">
                  Player {turn} can be bailed out of Love Jail!
                </p>
                <p className="text-lg font-bold text-pink-600 mb-2">
                  Cost: 15 coins
                </p>
                <p className="text-sm text-gray-600">
                  Show your love by bailing them out! 💕
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Player {turn === 1 ? 2 : 1} Coins: {turn === 1 ? player2Coins : player1Coins}
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleBailOut(turn)}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                Bail Out (15 coins)
              </button>
              <button
                onClick={() => {
                  setShowBailModal(false);
                  // Release player automatically
                  setCurrentPlayerJailState(false, 0, false);
                  setTimeout(() => {
                    setTurn(prev => (prev === 1 ? 2 : 1));
                  }, 500);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Let Them Stay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Properties Modal */}
      {showSellPropertiesModal && bankruptPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold mb-2 text-red-600">💰 Emergency Property Sale</h3>
              <p className="text-sm text-gray-600 mb-4">
                Player {bankruptPlayer} has negative coins! Sell properties to get back in the game.
              </p>
              <p className="text-sm text-gray-600">
                Properties sell for 80% of their original price.
              </p>
            </div>

            <div className="space-y-3">
              {getPlayerProperties(bankruptPlayer).map((property) => (
                <div key={property.propertyIndex} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{property.name}</h4>
                      <p className="text-sm text-gray-600">
                        Original Price: ${property.price} | Sell Price: ${property.sellPrice}
                      </p>
                      {property.houses > 0 && (
                        <p className="text-sm text-green-600">Houses: {property.houses}</p>
                      )}
                    </div>
                    <button
                      onClick={() => sellProperty(property.propertyIndex)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Sell for ${property.sellPrice}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Current Coins: {bankruptPlayer === 1 ? player1Coins : player2Coins}
              </p>
              <button
                onClick={() => {
                  setShowSellPropertiesModal(false);
                  // Switch turns to continue the game
                  setTimeout(() => {
                    setTurn(prev => (prev === 1 ? 2 : 1));
                  }, 500);
                }}
                className="mt-3 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Continue Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bankruptcy Modal */}
      {showBankruptcyModal && bankruptPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2 text-red-600">💔 BANKRUPT!</h3>
              <div className="p-4 rounded-lg mb-4 bg-red-50 border-2 border-red-200">
                <p className="font-semibold text-gray-800 mb-2">
                  But fret not, you're rich with your {bankruptPlayer === 1 ? 'Player 2' : 'Player 1'}'s love ❤️
                </p>
                <p className="text-sm text-gray-600">
                  Game Over - {bankruptPlayer === 1 ? 'Player 2' : 'Player 1'} wins!
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  setShowBankruptcyModal(false);
                  setGameEnded(false);
                  // Reset game state here if needed
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
