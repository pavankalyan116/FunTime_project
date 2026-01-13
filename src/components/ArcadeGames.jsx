import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../contexts/GameContext';

// Enhanced TicTacToe with XP integration
export const TicTacToeGame = () => {
  const { addXp, updateStats } = useGame();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, computer: 0, draws: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getComputerMove = () => {
    const availableSpots = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    
    // Try to win
    for (let spot of availableSpots) {
      const testBoard = [...board];
      testBoard[spot] = 'X';
      if (calculateWinner(testBoard) === 'X') return spot;
    }
    
    // Try to block
    for (let spot of availableSpots) {
      const testBoard = [...board];
      testBoard[spot] = 'O';
      if (calculateWinner(testBoard) === 'O') return spot;
    }
    
    // Take center if available
    if (board[4] === null) return 4;
    
    // Take corners
    const corners = [0, 2, 6, 8].filter(i => board[i] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    // Take random available spot
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
  };

  const handleClick = (i) => {
    if (board[i] || gameOver || !isPlayerTurn) return;
    
    const newBoard = [...board];
    newBoard[i] = 'O';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    
    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result);
      setGameOver(true);
      if (result === 'O') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
        // Award XP for winning
        addXp(25);
        updateStats('gamesWon');
      }
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
      setGameOver(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      // Award XP for draw
      addXp(10);
    } else {
      // Computer move after delay
      setTimeout(() => {
        const computerMove = getComputerMove();
        const finalBoard = [...newBoard];
        finalBoard[computerMove] = 'X';
        setBoard(finalBoard);
        
        const finalResult = calculateWinner(finalBoard);
        if (finalResult) {
          setWinner(finalResult);
          setGameOver(true);
          if (finalResult === 'X') {
            setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
            // Award XP for playing (even if lost)
            addXp(5);
          }
        } else if (!finalBoard.includes(null)) {
          setWinner('Draw');
          setGameOver(true);
          setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          addXp(10);
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-blue-400">Tic Tac Toe</h2>
      
      {/* Score Board */}
      <div className="flex justify-center space-x-6 text-lg">
        <div className="text-center">
          <p className="text-gray-400">You (O)</p>
          <p className="text-2xl font-bold text-blue-400">{scores.player}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">Draws</p>
          <p className="text-2xl font-bold text-gray-400">{scores.draws}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400">Computer (X)</p>
          <p className="text-2xl font-bold text-red-400">{scores.computer}</p>
        </div>
      </div>

      {/* Game Status */}
      <div className="text-xl font-semibold">
        {!gameOver && (
          <span className={isPlayerTurn ? "text-blue-400" : "text-red-400"}>
            {isPlayerTurn ? "Your Turn (O)" : "Computer Thinking..."}
          </span>
        )}
        {gameOver && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={
              winner === 'O' ? 'text-green-400' : 
              winner === 'X' ? 'text-red-400' : 
              'text-yellow-400'
            }
          >
            {winner === 'O' && '🎉 You Win! +25 XP'}
            {winner === 'X' && '🤖 Computer Wins! +5 XP'}
            {winner === 'Draw' && '🤝 Draw! +10 XP'}
          </motion.div>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((val, i) => (
          <motion.button 
            key={i} 
            onClick={() => handleClick(i)} 
            disabled={val !== null || gameOver || !isPlayerTurn}
            className={`h-20 text-3xl font-bold transition-all ${
              val === 'O' 
                ? 'bg-blue-600 text-white' 
                : val === 'X' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            } ${!isPlayerTurn && !val && 'opacity-50 cursor-not-allowed'}`}
            whileHover={val === null && isPlayerTurn ? { scale: 1.05 } : {}}
            whileTap={val === null && isPlayerTurn ? { scale: 0.95 } : {}}
          >
            {val}
          </motion.button>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetGame}
          className="px-6 py-2 bg-blue-600 rounded-full font-bold text-white hover:bg-blue-700"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

// Enhanced Memory Card Game
export const MemoryCardGame = () => {
  const { addXp, updateStats } = useGame();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const difficulties = {
    easy: { pairs: 6, gridCols: 3, xp: 20 },
    medium: { pairs: 8, gridCols: 4, xp: 35 },
    hard: { pairs: 12, gridCols: 4, xp: 50 }
  };

  const emojis = ['🎮', '🎯', '🎨', '🎵', '🎭', '🎪', '🎸', '🎺', '🎲', '🎳', '🎪', '🎨', '🎭', '🎮', '🎯', '🎵'];

  const initializeGame = () => {
    const { pairs } = difficulties[difficulty];
    const gameEmojis = emojis.slice(0, pairs);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5).map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      if (cards[first].emoji === cards[second].emoji) {
        setMatchedCards(prev => [...prev, first, second]);
        setFlippedCards([]);
        
        // Check if game is won
        if (matchedCards.length + 2 === cards.length) {
          setGameWon(true);
          const { xp } = difficulties[difficulty];
          const bonus = moves < difficulties[difficulty].pairs * 2 ? 10 : 0; // Bonus for efficiency
          addXp(xp + bonus);
          updateStats('gamesWon');
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matchedCards, moves, difficulty, addXp, updateStats]);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }
    
    setFlippedCards(prev => [...prev, index]);
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-purple-400">Memory Cards</h2>
      
      {/* Difficulty Selector */}
      <div className="flex justify-center space-x-2">
        {Object.keys(difficulties).map(diff => (
          <button
            key={diff}
            onClick={() => setDifficulty(diff)}
            className={`px-4 py-2 rounded-full font-semibold ${
              difficulty === diff 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Game Stats */}
      <div className="text-lg text-gray-300">
        Moves: {moves} | Matches: {matchedCards.length / 2}/{difficulties[difficulty].pairs}
      </div>

      {/* Game Board */}
      <div 
        className={`grid gap-3 max-w-md mx-auto`}
        style={{ gridTemplateColumns: `repeat(${difficulties[difficulty].gridCols}, 1fr)` }}
      >
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 text-2xl font-bold rounded-lg transition-all ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={gameWon}
          >
            {flippedCards.includes(index) || matchedCards.includes(index) ? card.emoji : '?'}
          </motion.button>
        ))}
      </div>

      {gameWon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <p className="text-2xl font-bold text-green-500">🎉 Congratulations!</p>
          <p className="text-white">You won in {moves} moves!</p>
          <p className="text-yellow-400">+{difficulties[difficulty].xp} XP {moves < difficulties[difficulty].pairs * 2 ? '(+10 Efficiency Bonus!)' : ''}</p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-purple-600 rounded-full font-bold text-white hover:bg-purple-700"
          >
            Play Again
          </button>
        </motion.div>
      )}

      {!gameWon && (
        <button
          onClick={initializeGame}
          className="px-6 py-3 bg-gray-600 rounded-full font-bold text-white hover:bg-gray-700"
        >
          New Game
        </button>
      )}
    </div>
  );
};

// Enhanced Click Speed Challenge
export const ClickSpeedGame = () => {
  const { addXp, updateStats } = useGame();
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, finished
  const [timeLeft, setTimeLeft] = useState(10);
  const [clicks, setClicks] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const intervalRef = useRef();

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(10);
    setClicks(0);
    setTargets([]);
    
    // Generate random targets
    const newTargets = [];
    for (let i = 0; i < 20; i++) {
      newTargets.push({
        id: i,
        x: Math.random() * 80 + 10, // 10-90% of container
        y: Math.random() * 80 + 10,
        size: Math.random() * 30 + 20, // 20-50px
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        clicked: false
      });
    }
    setTargets(newTargets);
    
    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    setGameState('finished');
    clearInterval(intervalRef.current);
    
    if (clicks > bestScore) {
      setBestScore(clicks);
    }
    
    // Award XP based on performance
    const xp = Math.max(5, clicks * 2);
    addXp(xp);
    
    if (clicks >= 50) {
      updateStats('gamesWon'); // Consider 50+ clicks a win
    }
  };

  const handleTargetClick = (targetId) => {
    setTargets(prev => prev.map(target => 
      target.id === targetId ? { ...target, clicked: true } : target
    ));
    setClicks(prev => prev + 1);
  };

  const resetGame = () => {
    setGameState('waiting');
    setTimeLeft(10);
    setClicks(0);
    setTargets([]);
    clearInterval(intervalRef.current);
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-orange-400">Click Speed Challenge</h2>
      
      <div className="flex justify-center space-x-8 text-lg">
        <div>Time: {timeLeft}s</div>
        <div>Clicks: {clicks}</div>
        <div>Best: {bestScore}</div>
      </div>

      <div className="relative w-full h-96 bg-gray-800 rounded-xl overflow-hidden">
        {gameState === 'waiting' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-orange-600 rounded-full font-bold text-xl hover:bg-orange-700 transform hover:scale-105 transition-all"
            >
              Start Challenge
            </button>
          </div>
        )}

        {gameState === 'playing' && targets.map(target => (
          !target.clicked && (
            <motion.button
              key={target.id}
              onClick={() => handleTargetClick(target.id)}
              className="absolute rounded-full border-2 border-white"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
                backgroundColor: target.color,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          )
        ))}

        {gameState === 'finished' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white">
            <h3 className="text-3xl font-bold mb-2">Time's Up!</h3>
            <p className="text-xl mb-2">You clicked {clicks} targets!</p>
            <p className="text-yellow-400 mb-4">+{Math.max(5, clicks * 2)} XP</p>
            {clicks > bestScore && <p className="text-green-400 mb-4">🏆 New Best Score!</p>}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-orange-600 rounded-full font-bold hover:bg-orange-700"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm">
        Click as many targets as you can in 10 seconds!
      </p>
    </div>
  );
};