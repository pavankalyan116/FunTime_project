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
                className="bg-gray-900 rounded-2xl p-6 md:p-8 w-full max-w-3xl relative border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
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

                {/* 🎮 PHASER GAME */}
                {activeGame === 'space-shooter' && (
                  <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-gray-700">
                    <iframe
                      src="games/space-shooter/index.html"
                      title="Space Shooter"
                      className="w-full h-full border-none"
                      allowFullScreen
                    />
                  </div>
                )}
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
  const choices = ['rock', 'paper', 'scissors'];
  const icons = { rock: '✊', paper: '✋', scissors: '✌️' };

  const play = (choice) => {
    const comp = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(comp);

    if (choice === comp) setResult('Draw');
    else if (
      (choice === 'rock' && comp === 'scissors') ||
      (choice === 'paper' && comp === 'rock') ||
      (choice === 'scissors' && comp === 'paper')
    ) setResult('You Win!');
    else setResult('Computer Wins!');
  };

  return (
    <div className="text-center space-y-8">
      <h2 className="text-3xl font-bold text-orange-500">Rock Paper Scissors</h2>
      {!userChoice ? (
        <div className="flex justify-center space-x-4">
          {choices.map(c => (
            <button key={c} onClick={() => play(c)} className="text-6xl p-4 bg-gray-800 rounded-xl hover:bg-gray-700">
              {icons[c]}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-4xl font-bold text-white">{result}</div>
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

  const shapes = ['circle', 'square', 'triangle', 'star'];
  const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const start = () => {
    setState('ready');
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
          state === 'now' ? `${getRandomColor()} scale-110 shadow-lg` : 
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
            <p className="text-white/80">Click when shape appears!</p>
            {renderShape(getRandomShape())}
          </div>
        )}
        {state === 'now' && (
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-4">CLICK NOW!</p>
            {renderShape(getRandomShape())}
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
  const [xTurn, setXTurn] = useState(true);
  const winner = calculateWinner(board);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = xTurn ? 'X' : 'O';
    setBoard(newBoard);
    setXTurn(!xTurn);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl text-blue-400 mb-4">Tic Tac Toe</h2>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((v, i) => (
          <button key={i} onClick={() => handleClick(i)} className="h-20 bg-gray-800 text-3xl">
            {v}
          </button>
        ))}
      </div>
      {winner && <p className="mt-4 text-xl">{winner} Wins!</p>}
    </div>
  );
};

const calculateWinner = (b) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (const [a,b1,c] of lines) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  return null;
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
    const flippedCardObjects = newCards.filter(card => card.isFlipped);
    if (flippedCardObjects.length === 2) {
      const [card1, card2] = flippedCardObjects;
      if (card1.symbol === card2.symbol && !card1.isMatched && !card2.isMatched) {
        const matchedCards = newCards.map(card =>
          card.id === card1.id || card.id === card2.id
            ? { ...card, isMatched: true }
            : card
        );
        setCards(matchedCards);
        setFlippedCards([]);
        setMatchedPairs(prev => prev + 1);
        
        // Clear matched cards after delay
        setTimeout(() => {
          setCards(prev => prev.filter(card => !card.isMatched));
        }, 1000);
      }
    }
  };

  return (
    <div className="text-center space-y-6 p-6">
      <h2 className="text-3xl font-bold text-pink-500 mb-4">Memory Match</h2>
      
      {!cards.length ? (
        <button
          onClick={initializeGame}
          className="px-8 py-4 bg-pink-600 rounded-full font-bold text-white hover:bg-pink-700 transform hover:scale-105 transition-all"
        >
          Start Game
        </button>
      ) : (
        <>
          <div className="mb-4 text-lg text-gray-300">
            Moves: {moves} | Matches: {matchedPairs}/8
          </div>
          
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => flipCard(index)}
                disabled={card.isFlipped || card.isMatched}
                className={`w-20 h-20 text-3xl rounded-lg transition-all duration-300 ${
                  card.isFlipped
                    ? 'bg-white text-gray-900 border-2 border-gray-300'
                    : card.isMatched
                    ? 'bg-green-500 text-white border-2 border-green-400'
                    : 'bg-gray-800 text-white border-2 border-gray-600 hover:bg-gray-700'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </button>
            ))}
          </div>
          
          {gameComplete && (
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-green-400 mb-2">🎉 Complete!</h3>
              <p className="text-gray-300 mb-4">You won in {moves} moves!</p>
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
    const isBigFood = Math.random() < 0.2; // 20% chance for big food
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      type: isBigFood ? 'big' : 'normal'
    };
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
          const points = food.type === 'big' ? 20 : 10;
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
                : 'bg-green-600' // Body
            }`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              ...(i === 0 && {
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)'
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
          </div>
        ))}
        
        {/* Food */}
        <div
          className={`absolute rounded-full animate-pulse ${
            food.type === 'big' 
              ? 'bg-yellow-400 shadow-lg' 
              : 'bg-red-500'
          }`}
          style={{
            width: food.type === 'big' ? CELL_SIZE + 4 : CELL_SIZE - 2,
            height: food.type === 'big' ? CELL_SIZE + 4 : CELL_SIZE - 2,
            left: food.x * CELL_SIZE + (food.type === 'big' ? -2 : 0),
            top: food.y * CELL_SIZE + (food.type === 'big' ? -2 : 0),
            ...(food.type === 'big' && {
              boxShadow: '0 0 15px rgba(250, 204, 21, 0.6)'
            })
          }}
        />
        
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
        <p>🔴 Red = 10pts | 🟡 Yellow = 20pts</p>
      </div>
    </div>
  );
};

export default Arcade;
