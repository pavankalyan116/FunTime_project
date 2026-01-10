import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X } from 'lucide-react';

const Arcade = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Classic strategy game', color: 'from-blue-500 to-cyan-500' },
    { id: 'snake', name: 'Snake', description: 'Eat apples, grow long, don\'t crash', color: 'from-green-500 to-emerald-500' },
    { id: 'rps', name: 'Rock Paper Scissors', description: 'Beat the computer in this classic hand game', color: 'from-orange-500 to-red-500' },
    { id: 'reaction', name: 'Reaction Test', description: 'Test your reflexes against the computer', color: 'from-purple-500 to-indigo-500' },
    { id: 'memory', name: 'Memory Match', description: 'Match pairs of cards to win', color: 'from-pink-500 to-rose-500' },
    { id: 'breakout', name: 'Breakout', description: 'Break all the bricks with your paddle', color: 'from-yellow-500 to-amber-500' },
    { id: 'wordguess', name: 'Word Guess', description: 'Guess the hidden word letter by letter', color: 'from-teal-500 to-cyan-500' },
    { id: 'numberpuzzle', name: 'Number Puzzle', description: 'Slide tiles to arrange numbers in order', color: 'from-indigo-500 to-purple-500' },

    // 🎮 Phaser Game
    { id: 'space-shooter', name: 'Space Shooter', description: 'Arcade shooter powered by Phaser', color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent text-center">
          Arcade Zone
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGame(game.id)}
              className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} cursor-pointer shadow-xl min-h-[200px] flex flex-col justify-between`}
            >
              <div>
                <Gamepad2 className="w-10 h-10 text-white mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
              </div>
              <p className="text-white/90 text-sm">{game.description}</p>
            </motion.div>
          ))}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {activeGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gray-900 rounded-2xl p-6 md:p-8 w-full max-w-5xl relative border border-gray-800 shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar"
              >
                <button
                  onClick={() => setActiveGame(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* LOCAL REACT GAMES */}
                {activeGame === 'tictactoe' && <TicTacToe />}
                {activeGame === 'snake' && <SnakeGame />}
                {activeGame === 'rps' && <RockPaperScissors />}
                {activeGame === 'reaction' && <ReactionTest />}
                {activeGame === 'memory' && <MemoryMatch />}
                {activeGame === 'breakout' && <BreakoutGame />}
                {activeGame === 'wordguess' && <WordGuessGame />}
                {activeGame === 'numberpuzzle' && <NumberPuzzleGame />}
                {activeGame === 'space-shooter' && <SpaceShooterGame />}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* =======================
   GAMES (UNCHANGED)
======================= */

// 🔹 Rock Paper Scissors
const RockPaperScissors = () => {
  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const choices = ['rock', 'paper', 'scissors'];
  const icons = { rock: '✊', paper: '✋', scissors: '✌️' };

  const play = (choice) => {
    const comp = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(comp);
    setShowResult(false);

    setTimeout(() => {
      if (choice === comp) setResult('Draw');
      else if (
        (choice === 'rock' && comp === 'scissors') ||
        (choice === 'paper' && comp === 'rock') ||
        (choice === 'scissors' && comp === 'paper')
      ) setResult('You Win!');
      else setResult('Computer Wins!');
      setShowResult(true);
    }, 1000);
  };

  const reset = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold text-orange-500">Rock Paper Scissors</h2>
      
      {!userChoice ? (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">How to Play:</h3>
            <div className="text-gray-300 space-y-2 text-left">
              <p>✊ <strong>Rock</strong> beats Scissors</p>
              <p>✋ <strong>Paper</strong> beats Rock</p>
              <p>✌️ <strong>Scissors</strong> beats Paper</p>
              <p>🎯 <strong>Goal:</strong> Choose your move to beat the computer</p>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            {choices.map(c => (
              <button 
                key={c} 
                onClick={() => play(c)} 
                className="text-6xl p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transform hover:scale-110 transition-all"
              >
                {icons[c]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <p className="text-lg text-gray-400 mb-2">You</p>
              <div className="text-6xl p-4 bg-blue-800 rounded-xl">
                {icons[userChoice]}
              </div>
            </div>
            
            <div className="text-3xl text-gray-400">VS</div>
            
            <div className="text-center">
              <p className="text-lg text-gray-400 mb-2">Computer</p>
              <div className="text-6xl p-4 bg-red-800 rounded-xl">
                {showResult ? icons[computerChoice] : '❓'}
              </div>
            </div>
          </div>
          
          {showResult && (
            <div className="text-4xl font-bold text-white animate-pulse">
              {result === 'You Win!' && '🎉 You Win!'}
              {result === 'Computer Wins!' && '💔 Computer Wins!'}
              {result === 'Draw' && '🤝 Draw!'}
            </div>
          )}
          
          <button
            onClick={reset}
            className="px-6 py-3 bg-orange-600 rounded-full font-bold text-white hover:bg-orange-700"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

// 🔹 Reaction Test
const ReactionTest = () => {
  const [state, setState] = useState('waiting');
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(null);
  const [highScore, setHighScore] = useState(null);
  const [round, setRound] = useState(1);
  const [scores, setScores] = useState([]);
  const timeoutRef = useRef(null);

  const shapes = ['circle', 'square', 'triangle', 'star', 'hexagon', 'diamond', 'heart', 'cross'];
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-indigo-500'];
  const objects = ['🎯', '🎨', '🎵', '🎭', '🎪', '🎸', '🎺', '🎮', '🎲', '🎳', '🎯', '🎪', '🎨', '🎭'];
  const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
  const getRandomObject = () => objects[Math.floor(Math.random() * objects.length)];

  const [currentShape, setCurrentShape] = useState(null);
  const [currentColor, setCurrentColor] = useState(null);
  const [currentObject, setCurrentObject] = useState(null);
  const [useObject, setUseObject] = useState(false);

  const start = () => {
    setState('ready');
    setUseObject(Math.random() < 0.3); // 30% chance to use emoji objects
    setCurrentShape(getRandomShape());
    setCurrentColor(getRandomColor());
    setCurrentObject(getRandomObject());
    const delay = 2000 + Math.random() * 3000;
    timeoutRef.current = setTimeout(() => {
      setState('now');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'now') {
      const reactionTime = Date.now() - startTime;
      setScore(reactionTime);
      setScores(prev => [...prev, reactionTime]);
      if (!highScore || reactionTime < highScore) {
        setHighScore(reactionTime);
      }
      setState('result');
    }
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    setScore(null);
    setState('waiting');
  };

  const reset = () => {
    setRound(1);
    setScores([]);
    setHighScore(null);
    setScore(null);
    setState('waiting');
  };

  const renderShape = (shape) => {
    switch(shape) {
      case 'circle':
        return <div className="w-24 h-24 bg-white rounded-full" />;
      case 'square':
        return <div className="w-24 h-24 bg-white" />;
      case 'triangle':
        return <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[80px] border-b-white" />;
      case 'star':
        return <div className="text-6xl text-white">⭐</div>;
      case 'hexagon':
        return <div className="w-24 h-24 bg-white" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />;
      case 'diamond':
        return <div className="w-24 h-24 bg-white transform rotate-45 scale-75" />;
      case 'heart':
        return <div className="text-6xl text-white">❤️</div>;
      case 'cross':
        return <div className="relative w-24 h-24">
          <div className="absolute top-1/2 left-0 right-0 h-4 bg-white transform -translate-y-1/2"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-white transform -translate-x-1/2"></div>
        </div>;
      default:
        return <div className="w-24 h-24 bg-white rounded-full" />;
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-purple-500">Reaction Test</h2>
      
      <div className="flex justify-center space-x-8 text-sm">
        <div className="text-gray-400">Round: {round}</div>
        <div className="text-gray-400">Best: {highScore ? `${highScore}ms` : '-'}</div>
      </div>

      <div
        onClick={state === 'now' ? handleClick : undefined}
        className={`w-full h-64 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 ${
          state === 'ready' ? 'bg-orange-500 animate-pulse' : 
          state === 'now' ? `${currentColor} scale-110 shadow-lg` : 
          'bg-gray-800'
        }`}
      >
        {state === 'waiting' && (
          <button 
            onClick={start}
            className="px-8 py-4 bg-purple-600 rounded-full font-bold text-xl hover:bg-purple-700 transform hover:scale-105 transition-all"
          >
            Start Game
          </button>
        )}
        {state === 'ready' && (
          <div className="text-center">
            <p className="text-3xl font-bold text-white mb-2">Get Ready...</p>
            <p className="text-white/80">Click when target appears!</p>
            {useObject ? (
              <div className="text-6xl opacity-50">{currentObject}</div>
            ) : (
              renderShape(currentShape)
            )}
          </div>
        )}
        {state === 'now' && (
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-4">CLICK NOW!</p>
            {useObject ? (
              <div className="text-8xl animate-bounce">{currentObject}</div>
            ) : (
              renderShape(currentShape)
            )}
          </div>
        )}
        {state === 'result' && (
          <div className="text-center space-y-4">
            <p className="text-4xl font-bold text-white">{score} ms</p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={nextRound}
                className="px-6 py-2 bg-green-600 rounded-full font-bold hover:bg-green-700"
              >
                Next Round
              </button>
              <button 
                onClick={reset}
                className="px-6 py-2 bg-gray-600 rounded-full font-bold hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
            {scores.length > 1 && (
              <div className="text-sm text-gray-400">
                Average: {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}ms
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-gray-400 text-sm">Test your reflexes! Click as fast as you can when the shape appears.</p>
    </div>
  );
};

// 🔹 Tic Tac Toe
const TicTacToe = () => {
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

  const minimax = (newBoard, isMaximizing) => {
    const result = calculateWinner(newBoard);
    
    if (result === 'O') return { score: -10 };
    if (result === 'X') return { score: 10 };
    if (!newBoard.includes(null)) return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'X';
          let score = minimax(newBoard, false).score;
          newBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return { score: bestScore };
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (newBoard[i] === null) {
          newBoard[i] = 'O';
          let score = minimax(newBoard, true).score;
          newBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return { score: bestScore };
    }
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
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
      setGameOver(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
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
          setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
        } else if (!finalBoard.includes(null)) {
          setWinner('Draw');
          setGameOver(true);
          setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
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

  const resetScores = () => {
    setScores({ player: 0, computer: 0, draws: 0 });
    resetGame();
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-blue-400">Tic Tac Toe</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white mb-3">How to Play:</h3>
        <div className="text-gray-300 space-y-1 text-sm text-left">
          <p>🎮 <strong>You are O</strong> • Computer is X</p>
          <p>🎯 <strong>Goal:</strong> Get 3 in a row (horizontal, vertical, or diagonal)</p>
          <p>🤖 <strong>Computer:</strong> Uses smart strategy to win</p>
        </div>
      </div>

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
          <span className={
            winner === 'O' ? 'text-green-400' : 
            winner === 'X' ? 'text-red-400' : 
            'text-yellow-400'
          }>
            {winner === 'O' && '🎉 You Win!'}
            {winner === 'X' && '🤖 Computer Wins!'}
            {winner === 'Draw' && '🤝 Draw!'}
          </span>
        )}
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((val, i) => (
          <button 
            key={i} 
            onClick={() => handleClick(i)} 
            disabled={val !== null || gameOver || !isPlayerTurn}
            className={`h-20 text-3xl font-bold transition-all transform hover:scale-105 ${
              val === 'O' 
                ? 'bg-blue-600 text-white' 
                : val === 'X' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            } ${!isPlayerTurn && !val && 'opacity-50 cursor-not-allowed'}`}
          >
            {val}
          </button>
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
        <button
          onClick={resetScores}
          className="px-6 py-2 bg-gray-600 rounded-full font-bold text-white hover:bg-gray-700"
        >
          Reset Scores
        </button>
      </div>
    </div>
  );
};

// 🔹 Memory Match
const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const symbols = ['🎮', '🎯', '🎨', '🎵', '🎭', '🎪', '🎸', '🎺'];

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols].map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
    
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameComplete(false);
  };

  const flipCard = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index)) return;
    
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    
    const newCards = cards.map(card => 
      card.id === index ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    
    // Check for match
    const flippedCardObjects = newCards.filter(card => card.isFlipped && !card.isMatched);
    if (flippedCardObjects.length === 2) {
      setMoves(prev => prev + 1);
      const [card1, card2] = flippedCardObjects;
      if (card1.symbol === card2.symbol) {
        const matchedCards = newCards.map(card =>
          card.id === card1.id || card.id === card2.id
            ? { ...card, isMatched: true }
            : card
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setMatchedPairs(prev => prev + 1);
        
        // Check for game complete
        if (matchedPairs + 1 === symbols.length) {
          setTimeout(() => {
            setGameComplete(true);
          }, 1000);
        }
      } else {
        // Flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.id === card1.id || card.id === card2.id
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="text-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-pink-500 mb-4">Memory Match</h2>
      
      {!cards.length ? (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">How to Play:</h3>
            <div className="text-gray-300 space-y-2 text-left">
              <p>🧠 <strong>Goal:</strong> Find all matching pairs of cards</p>
              <p>👆 <strong>How:</strong> Click cards to flip them over</p>
              <p>🎯 <strong>Matching:</strong> Find two cards with the same symbol</p>
              <p>⏱️ <strong>Memory:</strong> Remember card positions to match them faster</p>
              <p>🏆 <strong>Win:</strong> Match all 8 pairs to complete the game</p>
            </div>
          </div>
          
          <button
            onClick={initializeGame}
            className="px-8 py-4 bg-pink-600 rounded-full font-bold text-white hover:bg-pink-700 transform hover:scale-105 transition-all"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-lg text-gray-300">
            Moves: <span className="font-bold text-white">{moves}</span> | 
            Matches: <span className="font-bold text-green-400">{matchedPairs}/8</span>
          </div>
          
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => flipCard(index)}
                disabled={card.isFlipped || card.isMatched}
                className={`w-20 h-20 text-3xl rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  card.isFlipped || card.isMatched
                    ? card.isMatched
                      ? 'bg-green-500 text-white border-2 border-green-400 scale-95'
                      : 'bg-white text-gray-900 border-2 border-gray-300'
                    : 'bg-gray-800 text-white border-2 border-gray-600 hover:bg-gray-700'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </button>
            ))}
          </div>
          
          {gameComplete && (
            <div className="mt-6 text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-400">🎉 Complete!</h3>
              <p className="text-gray-300">You won in {moves} moves!</p>
              <div className="text-sm text-gray-400">
                {moves <= 16 && '⭐ Perfect memory!'}
                {moves > 16 && moves <= 24 && '👍 Great job!'}
                {moves > 24 && '💪 Good effort!'}
              </div>
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-pink-600 rounded-full font-bold text-white hover:bg-pink-700"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 🔹 Breakout Game
const BreakoutGame = () => {
  const [ball, setBall] = useState({ x: 400, y: 500, vx: 0, vy: 0 });
  const [paddle, setPaddle] = useState({ x: 350, y: 550 });
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const initializeGame = () => {
    const newBricks = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        newBricks.push({
          x: col * 75 + 50,
          y: row * 25 + 50,
          width: 70,
          height: 20,
          hits: 1,
          color: `hsl(${(row * 60 + col * 30)}, 70%, 50%)`
        });
      }
    }
    setBricks(newBricks);
    setBall({ x: 400, y: 500, vx: 0, vy: 0 });
    setPaddle({ x: 350, y: 550 });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          setPaddle(prev => ({ ...prev, x: Math.max(0, prev.x - 20) }));
          break;
        case 'ArrowRight':
          setPaddle(prev => ({ ...prev, x: Math.min(750, prev.x + 20) }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  return (
    <div className="text-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-yellow-500 mb-4">Breakout</h2>
      
      {!gameStarted ? (
        <button
          onClick={initializeGame}
          className="px-8 py-4 bg-yellow-600 rounded-full font-bold text-white hover:bg-yellow-700 transform hover:scale-105 transition-all"
        >
          Start Game
        </button>
      ) : (
        <>
          <div className="mb-4 text-lg text-gray-300">
            Score: {score}
          </div>
          
          <div className="relative bg-gray-900 rounded-lg p-4" style={{ width: '800px', height: '400px' }}>
            {/* Ball */}
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full"
              style={{
                left: `${ball.x - 8}px`,
                top: `${ball.y - 8}px`,
                transition: 'all 0.1s'
              }}
            />
            
            {/* Paddle */}
            <div
              className="absolute h-4 bg-green-500 rounded"
              style={{
                left: `${paddle.x - 30}px`,
                top: `${paddle.y - 8}px`,
                width: '60px',
                transition: 'all 0.1s'
              }}
            />
            
            {/* Bricks */}
            {bricks.map((brick, index) => (
              !brick.hits && (
                <div
                  key={index}
                  className="absolute rounded"
                  style={{
                    left: `${brick.x}px`,
                    top: `${brick.y}px`,
                    width: `${brick.width}px`,
                    height: `${brick.height}px`,
                    backgroundColor: brick.color,
                    border: '2px solid rgba(0,0,0,0.3)'
                  }}
                />
              )
            ))}
          </div>
          
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
              <h3 className="text-3xl font-bold mb-2">Game Over!</h3>
              <p className="text-xl mb-4">Final Score: {score}</p>
              <button
                onClick={initializeGame}
                className="px-6 py-3 bg-yellow-600 rounded-full font-bold text-white hover:bg-yellow-700"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 🔹 Snake Game
const SnakeGame = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15, type: 'normal' });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef();

  const generateFood = () => {
    const rand = Math.random();
    if (rand < 0.1) { // 10% chance for super food
      return {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: 'super'
      };
    } else if (rand < 0.3) { // 20% chance for big food
      return {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: 'big'
      };
    } else { // 70% chance for normal food
      return {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: 'normal'
      };
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        // Check food
        if (head.x === food.x && head.y === food.y) {
          const points = food.type === 'super' ? 50 : food.type === 'big' ? 20 : 10;
          setScore(s => s + points);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoopRef.current);
  }, [direction, food, gameOver, score, highScore]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4 text-green-400">Snake Game</h2>
      
      <div className="flex justify-center space-x-8 mb-4">
        <div className="text-xl">Score: <span className="font-bold text-white">{score}</span></div>
        <div className="text-xl">Best: <span className="font-bold text-yellow-400">{highScore}</span></div>
      </div>
      
      <div 
        className="bg-gray-800 border-2 border-gray-700 relative mb-6"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {/* Snake Body */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-all duration-100 ${
              i === 0 
                ? 'bg-green-400 shadow-lg z-10' // Head
                : i === snake.length - 1 && snake.length > 1
                ? 'bg-green-700' // Tail (darker)
                : 'bg-green-600' // Body
            }`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              ...(i === 0 && {
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
              }),
              ...(i === snake.length - 1 && snake.length > 1 && {
                opacity: 0.8
              })
            }}
          >
            {/* Snake eyes on head */}
            {i === 0 && (
              <>
                <div 
                  className="absolute bg-black rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    left: direction === 'LEFT' ? 2 : direction === 'RIGHT' ? 10 : 6,
                    top: direction === 'UP' ? 2 : direction === 'DOWN' ? 10 : 6
                  }}
                />
                <div 
                  className="absolute bg-black rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    left: direction === 'LEFT' ? 10 : direction === 'RIGHT' ? 2 : 12,
                    top: direction === 'UP' ? 2 : direction === 'DOWN' ? 10 : 6
                  }}
                />
              </>
            )}
            {/* Tail pattern */}
            {i === snake.length - 1 && snake.length > 1 && (
              <div 
                className="absolute bg-green-800 rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  left: 7,
                  top: 7
                }}
              />
            )}
          </div>
        ))}
        
        {/* Food */}
        <div
          className={`absolute rounded-full animate-pulse ${
            food.type === 'super' 
              ? 'bg-purple-500 shadow-xl' 
              : food.type === 'big'
              ? 'bg-yellow-400 shadow-lg' 
              : 'bg-red-500'
          }`}
          style={{
            width: food.type === 'super' ? CELL_SIZE + 8 : food.type === 'big' ? CELL_SIZE + 4 : CELL_SIZE - 2,
            height: food.type === 'super' ? CELL_SIZE + 8 : food.type === 'big' ? CELL_SIZE + 4 : CELL_SIZE - 2,
            left: food.x * CELL_SIZE + (food.type === 'super' ? -4 : food.type === 'big' ? -2 : 0),
            top: food.y * CELL_SIZE + (food.type === 'super' ? -4 : food.type === 'big' ? -2 : 0),
            ...(food.type === 'super' && {
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
              animation: 'pulse 1s infinite, bounce 2s infinite'
            }),
            ...(food.type === 'big' && {
              boxShadow: '0 0 15px rgba(250, 204, 21, 0.6)'
            })
          }}
        >
          {food.type === 'super' && (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
              ⭐
            </div>
          )}
        </div>
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
            <h3 className="text-3xl font-bold mb-2">Game Over!</h3>
            <p className="text-xl mb-4">Final Score: {score}</p>
            {score === highScore && score > 0 && (
              <p className="text-yellow-400 mb-4">🏆 New High Score!</p>
            )}
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-green-600 rounded-full font-bold hover:bg-green-700 transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-400 space-y-1">
        <p>Use Arrow Keys to Move</p>
        <p>🔴 Red = 10pts | 🟡 Yellow = 20pts | 🟣 Purple = 50pts</p>
      </div>
    </div>
  );
};

// 🔹 Word Guess Game
const WordGuessGame = () => {
  const words = ['REACT', 'CODING', 'GAMES', 'PUZZLE', 'PLAYER', 'SCORE', 'WINNER', 'ARCADE', 'FUNTIME', 'MASTER'];
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const maxWrongGuesses = 6;

  const initializeGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameOver || gameWon) return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses >= maxWrongGuesses) {
        setGameOver(true);
      }
    } else {
      const wordComplete = word.split('').every(l => newGuessedLetters.includes(l));
      if (wordComplete) {
        setGameWon(true);
      }
    }
  };

  const renderHangman = () => {
    const parts = [
      <circle key="head" cx="50" cy="25" r="10" stroke="white" strokeWidth="2" fill="none" />,
      <line key="body" x1="50" y1="35" x2="50" y2="60" stroke="white" strokeWidth="2" />,
      <line key="leftArm" x1="50" y1="40" x2="35" y2="50" stroke="white" strokeWidth="2" />,
      <line key="rightArm" x1="50" y1="40" x2="65" y2="50" stroke="white" strokeWidth="2" />,
      <line key="leftLeg" x1="50" y1="60" x2="35" y2="75" stroke="white" strokeWidth="2" />,
      <line key="rightLeg" x1="50" y1="60" x2="65" y2="75" stroke="white" strokeWidth="2" />
    ];

    return (
      <svg width="100" height="100" className="bg-gray-800 rounded-lg">
        <line x1="10" y1="90" x2="30" y2="90" stroke="white" strokeWidth="2" />
        <line x1="20" y1="90" x2="20" y2="10" stroke="white" strokeWidth="2" />
        <line x1="20" y1="10" x2="50" y2="10" stroke="white" strokeWidth="2" />
        <line x1="50" y1="10" x2="50" y2="15" stroke="white" strokeWidth="2" />
        {parts.slice(0, wrongGuesses)}
      </svg>
    );
  };

  return (
    <div className="text-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-teal-500">Word Guess</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg max-w-2xl mx-auto">
        <h3 className="text-lg font-bold text-white mb-3">How to Play:</h3>
        <div className="text-gray-300 space-y-1 text-sm text-left">
          <p>🔤 <strong>Goal:</strong> Guess the hidden word letter by letter</p>
          <p>❌ <strong>Lives:</strong> You have 6 wrong guesses before game over</p>
          <p>🎯 <strong>Strategy:</strong> Start with common vowels (A, E, I, O, U)</p>
          <p>🧩 <strong>Hint:</strong> Look for patterns in the word structure</p>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        {renderHangman()}
      </div>

      <div className="text-2xl font-mono space-x-2">
        {word.split('').map((letter, index) => (
          <span key={index} className="inline-block w-8 border-b-2 border-white">
            {guessedLetters.includes(letter) ? letter : ''}
          </span>
        ))}
      </div>

      <div className="text-lg text-gray-300">
        Wrong Guesses: <span className="font-bold text-red-400">{wrongGuesses}</span> / {maxWrongGuesses}
        {wrongGuesses > 0 && (
          <span className="ml-4 text-sm">
            ({maxWrongGuesses - wrongGuesses} lives left)
          </span>
        )}
      </div>

      {!gameOver && !gameWon && (
        <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.includes(letter)}
              className={`p-2 rounded font-bold transition-all transform hover:scale-105 ${
                guessedLetters.includes(letter)
                  ? word.includes(letter)
                    ? 'bg-green-600 text-white'
                    : 'bg-red-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-red-500">💀 Game Over!</p>
          <p className="text-xl text-white">The word was: <span className="font-bold text-yellow-400">{word}</span></p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-teal-600 rounded-full font-bold text-white hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      )}

      {gameWon && (
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-green-500">🎉 You Won!</p>
          <p className="text-white">You guessed the word: <span className="font-bold text-green-400">{word}</span></p>
          <p className="text-sm text-gray-400">
            Wrong guesses: {wrongGuesses} {wrongGuesses <= 2 && '⭐ Perfect!'}
          </p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-teal-600 rounded-full font-bold text-white hover:bg-teal-700"
          >
            New Word
          </button>
        </div>
      )}
    </div>
  );
};

// 🔹 Space Shooter Game
const SpaceShooterGame = () => {
  const [player, setPlayer] = useState({ x: 400, y: 500 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [keys, setKeys] = useState({});

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move player
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        if (keys['ArrowLeft'] || keys['a']) newX = Math.max(20, newX - 8);
        if (keys['ArrowRight'] || keys['d']) newX = Math.min(780, newX + 8);
        if (keys['ArrowUp'] || keys['w']) newY = Math.max(20, newY - 8);
        if (keys['ArrowDown'] || keys['s']) newY = Math.min(580, newY + 8);
        
        return { x: newX, y: newY };
      });

      // Shoot bullets
      if (keys[' ']) {
        setBullets(prev => {
          const now = Date.now();
          const lastBullet = prev[prev.length - 1];
          if (!lastBullet || now - lastBullet.time > 200) {
            return [...prev, { x: player.x, y: player.y - 10, time: now }];
          }
          return prev;
        });
      }

      // Move bullets
      setBullets(prev => prev
        .map(bullet => ({ ...bullet, y: bullet.y - 12 }))
        .filter(bullet => bullet.y > -10)
      );

      // Move enemies
      setEnemies(prev => prev
        .map(enemy => ({ ...enemy, y: enemy.y + 2 }))
        .filter(enemy => enemy.y < 610)
      );

      // Spawn enemies
      if (Math.random() < 0.02) {
        setEnemies(prev => [...prev, {
          x: Math.random() * 760 + 20,
          y: -20,
          id: Date.now()
        }]);
      }

      // Check collisions
      setBullets(prevBullets => {
        setEnemies(prevEnemies => {
          let newEnemies = [...prevEnemies];
          let newBullets = [...prevBullets];
          let points = 0;

          newBullets.forEach((bullet, bIndex) => {
            newEnemies.forEach((enemy, eIndex) => {
              const distance = Math.sqrt(
                Math.pow(bullet.x - enemy.x, 2) + 
                Math.pow(bullet.y - enemy.y, 2)
              );
              
              if (distance < 25) {
                newEnemies.splice(eIndex, 1);
                newBullets.splice(bIndex, 1);
                points += 10;
              }
            });
          });

          if (points > 0) setScore(s => s + points);
          return newEnemies;
        });
        return prevBullets;
      });

      // Check player collision
      enemies.forEach(enemy => {
        const distance = Math.sqrt(
          Math.pow(player.x - enemy.x, 2) + 
          Math.pow(player.y - enemy.y, 2)
        );
        
        if (distance < 30) {
          setGameOver(true);
        }
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, keys, player.x, player.y, enemies]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPlayer({ x: 400, y: 500 });
    setBullets([]);
    setEnemies([]);
  };

  return (
    <div className="text-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-pink-500">Space Shooter</h2>
      
      {!gameStarted ? (
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">How to Play:</h3>
            <div className="text-gray-300 space-y-2 text-left">
              <p>🎮 <strong>Movement:</strong> Arrow Keys or WASD</p>
              <p>🔫 <strong>Shoot:</strong> Spacebar</p>
              <p>👾 <strong>Goal:</strong> Destroy enemies to earn points</p>
              <p>💥 <strong>Avoid:</strong> Don't let enemies hit your spaceship</p>
              <p>🏆 <strong>Scoring:</strong> 10 points per enemy destroyed</p>
            </div>
          </div>
          
          {/* Visual Controls Display */}
          <div className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
            <h4 className="text-lg font-bold text-white mb-4">Controls:</h4>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
              <div></div>
              <div className="bg-gray-700 p-3 rounded text-white font-bold">↑</div>
              <div></div>
              <div className="bg-gray-700 p-3 rounded text-white font-bold">←</div>
              <div className="bg-gray-700 p-3 rounded text-white font-bold">↓</div>
              <div className="bg-gray-700 p-3 rounded text-white font-bold">→</div>
            </div>
            <div className="text-gray-300 text-sm">
              <p>Use Arrow Keys or WASD to move</p>
              <p className="mt-2 bg-gray-700 p-2 rounded text-center">SPACEBAR = 🔫 SHOOT</p>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-8 py-4 bg-pink-600 rounded-full font-bold text-white hover:bg-pink-700 transform hover:scale-105 transition-all"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div className="text-lg text-gray-300">
              Score: <span className="font-bold text-white">{score}</span>
            </div>
            
            {/* Live Controls Display */}
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-gray-300 text-sm">
                  <div className="grid grid-cols-3 gap-1">
                    <div></div>
                    <div className={`w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs ${keys['ArrowUp'] || keys['w'] ? 'bg-green-600' : ''}`}>↑</div>
                    <div></div>
                    <div className={`w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs ${keys['ArrowLeft'] || keys['a'] ? 'bg-green-600' : ''}`}>←</div>
                    <div className={`w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs ${keys['ArrowDown'] || keys['s'] ? 'bg-green-600' : ''}`}>↓</div>
                    <div className={`w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs ${keys['ArrowRight'] || keys['d'] ? 'bg-green-600' : ''}`}>→</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-bold ${keys[' '] ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>
                  🔫 FIRE
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative bg-gray-900 rounded-lg border-2 border-gray-700 mx-auto" style={{ width: '900px', height: '650px' }}>
            {/* Player Spaceship */}
            <div
              className="absolute w-0 h-0 transition-all duration-100"
              style={{
                left: `${player.x - 15}px`,
                top: `${player.y - 15}px`,
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '30px solid #10b981',
                filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))'
              }}
            />
            
            {/* Bullets */}
            {bullets.map((bullet, index) => (
              <div
                key={index}
                className="absolute w-2 h-4 bg-yellow-400 rounded-full"
                style={{
                  left: `${bullet.x - 1}px`,
                  top: `${bullet.y - 2}px`,
                  boxShadow: '0 0 8px rgba(250, 204, 21, 0.8)'
                }}
              />
            ))}
            
            {/* Enemies */}
            {enemies.map(enemy => (
              <div
                key={enemy.id}
                className="absolute w-8 h-8 bg-red-500 rounded-full animate-pulse"
                style={{
                  left: `${enemy.x - 16}px`,
                  top: `${enemy.y - 16}px`,
                  boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)'
                }}
              />
            ))}
            
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-bold mb-2">Game Over!</h3>
                <p className="text-xl mb-4">Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-pink-600 rounded-full font-bold hover:bg-pink-700"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-400">
            Use Arrow Keys/WASD to move • Spacebar to shoot
          </div>
        </>
      )}
    </div>
  );
};
// 🔹 Number Puzzle Game (15 Puzzle)
const NumberPuzzleGame = () => {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    numbers.push(null); // Empty tile
    
    // Shuffle tiles (ensure solvable)
    do {
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
    } while (!isSolvable(numbers));
    
    setTiles(numbers);
    setMoves(0);
    setGameWon(false);
  };

  const isSolvable = (puzzle) => {
    let inversions = 0;
    const flatTiles = puzzle.filter(tile => tile !== null);
    
    for (let i = 0; i < flatTiles.length - 1; i++) {
      for (let j = i + 1; j < flatTiles.length; j++) {
        if (flatTiles[i] > flatTiles[j]) {
          inversions++;
        }
      }
    }
    
    return inversions % 2 === 0;
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    // Check win condition
    if (tiles.length === 16) {
      const isWin = tiles.slice(0, 15).every((tile, index) => tile === index + 1) && tiles[15] === null;
      if (isWin && moves > 0) {
        setGameWon(true);
      }
    }
  }, [tiles, moves]);

  const moveTile = (index) => {
    if (gameWon) return;
    
    const emptyIndex = tiles.indexOf(null);
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    // Check if tile is adjacent to empty space
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  return (
    <div className="text-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-indigo-500">Number Puzzle</h2>
      
      <div className="text-lg text-gray-300">
        Moves: {moves}
      </div>

      <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto bg-gray-800 p-4 rounded-lg">
        {tiles.map((tile, index) => (
          <button
            key={index}
            onClick={() => moveTile(index)}
            disabled={tile === null}
            className={`w-16 h-16 text-xl font-bold rounded transition-all ${
              tile === null
                ? 'bg-gray-900 cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105'
            }`}
          >
            {tile}
          </button>
        ))}
      </div>

      {gameWon && (
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-green-500">🎉 Puzzle Solved!</p>
          <p className="text-white">You won in {moves} moves!</p>
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-indigo-600 rounded-full font-bold text-white hover:bg-indigo-700"
          >
            New Game
          </button>
        </div>
      )}

      {!gameWon && (
        <div className="space-y-4">
          <button
            onClick={initializeGame}
            className="px-6 py-3 bg-gray-600 rounded-full font-bold text-white hover:bg-gray-700"
          >
            New Game
          </button>
          <p className="text-sm text-gray-400">
            Arrange numbers 1-15 in order by sliding tiles into the empty space
          </p>
        </div>
      )}
    </div>
  );
};

export default Arcade;
