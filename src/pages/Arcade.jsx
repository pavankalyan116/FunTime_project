import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, Trophy, Star, Zap, Target, Timer, Sparkles } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { TicTacToeGame, MemoryCardGame, ClickSpeedGame } from '../components/ArcadeGames';

const Arcade = () => {
  const { addXp, updateStats } = useGame();
  const [activeGame, setActiveGame] = useState(null);
  const [gameStats, setGameStats] = useState({
    totalGamesPlayed: 0,
    totalScore: 0,
    favoriteGame: null
  });

  const games = [
    { 
      id: 'tictactoe', 
      name: 'Tic Tac Toe', 
      description: 'Classic strategy vs AI', 
      color: 'from-blue-500 to-cyan-500',
      icon: '⭕',
      difficulty: 'Medium',
      category: 'Strategy'
    },
    { 
      id: 'memory', 
      name: 'Memory Cards', 
      description: 'Match pairs to win', 
      color: 'from-purple-500 to-indigo-500',
      icon: '🧠',
      difficulty: 'Easy',
      category: 'Memory'
    },
    { 
      id: 'clickspeed', 
      name: 'Click Speed', 
      description: 'Click targets as fast as you can', 
      color: 'from-orange-500 to-red-500',
      icon: '⚡',
      difficulty: 'Easy',
      category: 'Reflex'
    },
    { 
      id: 'snake', 
      name: 'Snake Game', 
      description: 'Eat, grow, survive', 
      color: 'from-green-500 to-emerald-500',
      icon: '🐍',
      difficulty: 'Easy',
      category: 'Arcade'
    },
    { 
      id: 'rps', 
      name: 'Rock Paper Scissors', 
      description: 'Beat the computer', 
      color: 'from-orange-500 to-red-500',
      icon: '✂️',
      difficulty: 'Easy',
      category: 'Casual'
    },
    { 
      id: 'reaction', 
      name: 'Reaction Test', 
      description: 'Test your reflexes', 
      color: 'from-purple-500 to-indigo-500',
      icon: '⚡',
      difficulty: 'Medium',
      category: 'Skill'
    },
    { 
      id: 'numberpuzzle', 
      name: 'Number Puzzle', 
      description: 'Slide tiles to order', 
      color: 'from-indigo-500 to-purple-500',
      icon: '🧩',
      difficulty: 'Hard',
      category: 'Puzzle'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-24 -right-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute -bottom-28 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-900/40 via-blue-900/40 to-purple-900/40 border border-green-500/30 backdrop-blur-sm mb-6"
          >
            <Gamepad2 className="w-6 h-6 text-green-400" />
            <span className="text-sm font-semibold text-green-200">Retro Gaming Collection</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Arcade Zone
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Classic games reimagined with modern flair. Challenge yourself across multiple genres and skill levels.
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-6 mt-6 text-sm"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">{games.length} Games</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300">6 Categories</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-gray-300">All Skill Levels</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Games Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                z: 50
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGame(game.id)}
              className={`group relative p-6 rounded-3xl bg-gradient-to-br ${game.color} cursor-pointer shadow-2xl min-h-[240px] flex flex-col justify-between overflow-hidden border border-white/10`}
              style={{
                transformStyle: "preserve-3d"
              }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl opacity-30">{game.icon}</div>
                <div className="absolute bottom-4 left-4 w-20 h-20 border-2 border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {game.icon}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold text-white">
                      {game.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-200' :
                      game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-200' :
                      'bg-red-500/20 text-red-200'
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-100 transition-colors">
                  {game.name}
                </h2>
              </div>
              
              <div className="relative z-10">
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {game.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-sm font-semibold"
                  >
                    <Sparkles className="w-4 h-4" />
                    Play Now
                  </motion.div>
                  
                  <div className="text-white/60 text-xs">
                    Click to start
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Modal */}
        <AnimatePresence>
          {activeGame && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setActiveGame(null)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-3xl p-6 md:p-8 w-full max-w-6xl relative border border-gray-700/50 shadow-2xl max-h-[95vh] overflow-y-auto backdrop-blur-sm"
              >
                {/* Enhanced Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveGame(null)}
                  className="absolute top-6 right-6 p-2 bg-gray-800/80 hover:bg-red-600/80 text-gray-400 hover:text-white rounded-full transition-all duration-300 z-10"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Game Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  {(() => {
                    const game = games.find(g => g.id === activeGame);
                    return game ? (
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${game.color} text-white text-2xl`}>
                          {game.icon}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white">{game.name}</h2>
                          <p className="text-gray-400">{game.description}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </motion.div>

                {/* Game Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {activeGame === 'tictactoe' && <TicTacToeGame />}
                  {activeGame === 'memory' && <MemoryCardGame />}
                  {activeGame === 'clickspeed' && <ClickSpeedGame />}
                  {activeGame === 'snake' && <SnakeGame />}
                  {activeGame === 'rps' && <RockPaperScissors />}
                  {activeGame === 'reaction' && <ReactionTest />}
                  {activeGame === 'numberpuzzle' && <NumberPuzzleGame />}
                </motion.div>
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

// 🔹 Breakout Game
const BreakoutGame = () => {
  const [ball, setBall] = useState({ x: 200, y: 250, vx: 0, vy: 0 });
  const [paddle, setPaddle] = useState({ x: 175, y: 275 });
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameArea, setGameArea] = useState({ width: 400, height: 200 });

  const initializeGame = () => {
    const newBricks = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        newBricks.push({
          x: col * 37 + 25,
          y: row * 12 + 25,
          width: 35,
          height: 10,
          hits: 1,
          color: `hsl(${(row * 60 + col * 30)}, 70%, 50%)`
        });
      }
    }
    setBricks(newBricks);
    setBall({ x: 200, y: 250, vx: 0, vy: 0 });
    setPaddle({ x: 175, y: 275 });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  useEffect(() => {
    const updateGameArea = () => {
      const width = Math.min(800, window.innerWidth - 40);
      const height = Math.min(400, window.innerHeight - 300);
      setGameArea({ width, height });
    };
    
    updateGameArea();
    window.addEventListener('resize', updateGameArea);
    return () => window.removeEventListener('resize', updateGameArea);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setPaddle(prev => ({ ...prev, x: Math.max(30, prev.x - 20) }));
          break;
        case 'ArrowRight':
        case 'd':
          setPaddle(prev => ({ ...prev, x: Math.min(gameArea.width - 30, prev.x + 20) }));
          break;
      }
    };

    const handleTouch = (e) => {
      if (gameOver) return;
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      setPaddle(prev => ({ ...prev, x: Math.max(30, Math.min(gameArea.width - 30, x)) }));
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameElement = document.getElementById('breakout-game');
    if (gameElement) {
      gameElement.addEventListener('touchmove', handleTouch, { passive: true });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameElement) {
        gameElement.removeEventListener('touchmove', handleTouch);
      }
    };
  }, [gameStarted, gameOver, gameArea.width]);

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
          
          <div 
            id="breakout-game"
            className="relative bg-gray-900 rounded-lg p-4 mx-auto" 
            style={{ width: `${gameArea.width}px`, height: `${gameArea.height}px` }}
          >
            {/* Ball */}
            <div
              className="absolute w-2 h-2 sm:w-4 sm:h-4 bg-blue-500 rounded-full"
              style={{
                left: `${(ball.x / 400) * gameArea.width - 4}px`,
                top: `${(ball.y / 200) * gameArea.height - 4}px`,
                transition: 'all 0.1s'
              }}
            />
            
            {/* Paddle */}
            <div
              className="absolute h-2 sm:h-4 bg-green-500 rounded"
              style={{
                left: `${(paddle.x / 400) * gameArea.width - 15}px`,
                top: `${(paddle.y / 200) * gameArea.height - 4}px`,
                width: '30px sm:w-60px',
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
                    left: `${(brick.x / 400) * gameArea.width}px`,
                    top: `${(brick.y / 200) * gameArea.height}px`,
                    width: `${(brick.width / 400) * gameArea.width}px`,
                    height: `${(brick.height / 200) * gameArea.height}px`,
                    backgroundColor: brick.color,
                    border: '1px solid rgba(0,0,0,0.3)'
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
  const [cellSize, setCellSize] = useState(20);
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
    const updateCellSize = () => {
      const maxSize = Math.min(20, Math.floor((window.innerWidth - 40) / GRID_SIZE));
      setCellSize(Math.max(10, maxSize));
    };
    
    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp': 
        case 'w': 
          if (direction !== 'DOWN') setDirection('UP'); 
          break;
        case 'ArrowDown': 
        case 's': 
          if (direction !== 'UP') setDirection('DOWN'); 
          break;
        case 'ArrowLeft': 
        case 'a': 
          if (direction !== 'RIGHT') setDirection('LEFT'); 
          break;
        case 'ArrowRight': 
        case 'd': 
          if (direction !== 'LEFT') setDirection('RIGHT'); 
          break;
      }
    };

    const handleTouch = (e) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      const gameElement = document.getElementById('snake-game');
      if (!gameElement) return;
      
      const rect = gameElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const dx = x - centerX;
      const dy = y - centerY;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== 'LEFT') setDirection('RIGHT');
        else if (dx < 0 && direction !== 'RIGHT') setDirection('LEFT');
      } else {
        if (dy > 0 && direction !== 'UP') setDirection('DOWN');
        else if (dy < 0 && direction !== 'DOWN') setDirection('UP');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameElement = document.getElementById('snake-game');
    if (gameElement) {
      gameElement.addEventListener('touchstart', handleTouch, { passive: true });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameElement) {
        gameElement.removeEventListener('touchstart', handleTouch);
      }
    };
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
        id="snake-game"
        className="bg-gray-800 border-2 border-gray-700 relative mb-6 mx-auto"
        style={{ width: GRID_SIZE * cellSize, height: GRID_SIZE * cellSize }}
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
              width: cellSize - 2,
              height: cellSize - 2,
              left: segment.x * cellSize,
              top: segment.y * cellSize,
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
                    width: Math.max(2, cellSize / 10),
                    height: Math.max(2, cellSize / 10),
                    left: direction === 'LEFT' ? 1 : direction === 'RIGHT' ? cellSize / 2 : cellSize / 3,
                    top: direction === 'UP' ? 1 : direction === 'DOWN' ? cellSize / 2 : cellSize / 3
                  }}
                />
                <div 
                  className="absolute bg-black rounded-full"
                  style={{
                    width: Math.max(2, cellSize / 10),
                    height: Math.max(2, cellSize / 10),
                    left: direction === 'LEFT' ? cellSize / 2 : direction === 'RIGHT' ? 1 : cellSize * 0.6,
                    top: direction === 'UP' ? 1 : direction === 'DOWN' ? cellSize / 2 : cellSize / 3
                  }}
                />
              </>
            )}
            {/* Tail pattern */}
            {i === snake.length - 1 && snake.length > 1 && (
              <div 
                className="absolute bg-green-800 rounded-full"
                style={{
                  width: Math.max(3, cellSize / 3),
                  height: Math.max(3, cellSize / 3),
                  left: cellSize * 0.35,
                  top: cellSize * 0.35
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
            width: food.type === 'super' ? cellSize + cellSize/2 : food.type === 'big' ? cellSize + cellSize/4 : cellSize - 2,
            height: food.type === 'super' ? cellSize + cellSize/2 : food.type === 'big' ? cellSize + cellSize/4 : cellSize - 2,
            left: food.x * cellSize + (food.type === 'super' ? -cellSize/4 : food.type === 'big' ? -cellSize/8 : 0),
            top: food.y * cellSize + (food.type === 'super' ? -cellSize/4 : food.type === 'big' ? -cellSize/8 : 0),
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
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold" style={{ fontSize: cellSize / 3 }}>
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
        <p>Desktop: Arrow Keys or WASD to Move</p>
        <p>Mobile: Tap to Change Direction</p>
        <p>🔴 Red = 10pts | 🟡 Yellow = 20pts | 🟣 Purple = 50pts</p>
      </div>
    </div>
  );
};

// 🔹 Space Shooter Game
const SpaceShooterGame = () => {
  const [gameArea, setGameArea] = useState({ width: 800, height: 600 });
  const [player, setPlayer] = useState({ x: 400, y: 500 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [keys, setKeys] = useState({});

  useEffect(() => {
    const updateGameArea = () => {
      const width = Math.min(800, window.innerWidth - 40);
      const height = Math.min(600, window.innerHeight - 200);
      setGameArea({ width, height });
    };
    
    updateGameArea();
    window.addEventListener('resize', updateGameArea);
    return () => window.removeEventListener('resize', updateGameArea);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    const handleTouch = (e) => {
      if (!e.touches.length) return;
      const touch = e.touches[0];
      const gameElement = document.getElementById('space-shooter-game');
      if (!gameElement) return;
      
      const rect = gameElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      setPlayer(prev => ({
        x: Math.max(20, Math.min(gameArea.width - 20, x)),
        y: Math.max(20, Math.min(gameArea.height - 20, y))
      }));
      
      // Auto shoot on touch
      setBullets(prev => {
        const now = Date.now();
        const lastBullet = prev[prev.length - 1];
        if (!lastBullet || now - lastBullet.time > 200) {
          return [...prev, { x: x, y: y - 10, time: now }];
        }
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    const gameElement = document.getElementById('space-shooter-game');
    if (gameElement) {
      gameElement.addEventListener('touchmove', handleTouch, { passive: true });
      gameElement.addEventListener('touchstart', handleTouch, { passive: true });
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gameElement) {
        gameElement.removeEventListener('touchmove', handleTouch);
        gameElement.removeEventListener('touchstart', handleTouch);
      }
    };
  }, [gameStarted, gameOver, gameArea]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Move player
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        
        if (keys['ArrowLeft'] || keys['a']) newX = Math.max(20, newX - 8);
        if (keys['ArrowRight'] || keys['d']) newX = Math.min(gameArea.width - 20, newX + 8);
        if (keys['ArrowUp'] || keys['w']) newY = Math.max(20, newY - 8);
        if (keys['ArrowDown'] || keys['s']) newY = Math.min(gameArea.height - 20, newY + 8);
        
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
        .filter(enemy => enemy.y < gameArea.height + 20)
      );

      // Spawn enemies
      if (Math.random() < 0.02) {
        setEnemies(prev => [...prev, {
          x: Math.random() * (gameArea.width - 40) + 20,
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
  }, [gameStarted, gameOver, keys, player.x, player.y, enemies, gameArea]);

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
              <p>🎮 <strong>Desktop:</strong> Arrow Keys or WASD to move, Spacebar to shoot</p>
              <p>📱 <strong>Mobile:</strong> Touch to move spaceship, auto-shoots</p>
              <p>👾 <strong>Goal:</strong> Destroy enemies to earn points</p>
              <p>💥 <strong>Avoid:</strong> Don't let enemies hit your spaceship</p>
              <p>🏆 <strong>Scoring:</strong> 10 points per enemy destroyed</p>
            </div>
          </div>
          
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
      
          <div 
            id="space-shooter-game"
            className="relative bg-gray-900 rounded-lg border-2 border-gray-700 mx-auto" 
            style={{ width: `${gameArea.width}px`, height: `${gameArea.height}px` }}
          >
            <div
              className="absolute transition-all duration-100"
              style={{
                left: `${(player.x / 800) * gameArea.width - 15}px`,
                top: `${(player.y / 600) * gameArea.height - 15}px`,
                transform: 'scale(0.8)'
              }}
            >
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '12px solid transparent',
                  borderRight: '12px solid transparent',
                  borderBottom: '24px solid #10b981',
                  filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
                }}
              />
            </div>
            
            {bullets.map((bullet, index) => (
              <div
                key={index}
                className="absolute w-1 h-2 sm:w-2 sm:h-4 bg-yellow-400 rounded-full"
                style={{
                  left: `${(bullet.x / 800) * gameArea.width - 1}px`,
                  top: `${(bullet.y / 600) * gameArea.height - 2}px`,
                  boxShadow: '0 0 6px rgba(250, 204, 21, 0.8)'
                }}
              />
            ))}
            
            {enemies.map(enemy => (
              <div
                key={enemy.id}
                className="absolute w-4 h-4 sm:w-8 sm:h-8 bg-red-500 rounded-full animate-pulse"
                style={{
                  left: `${(enemy.x / 800) * gameArea.width - 4}px`,
                  top: `${(enemy.y / 600) * gameArea.height - 4}px`,
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
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
            <p>Desktop: Arrow Keys/WASD to move • Spacebar to shoot</p>
            <p>Mobile: Touch to move spaceship • Auto-shoots</p>
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
