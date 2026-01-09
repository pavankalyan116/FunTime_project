import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, Trophy } from 'lucide-react';

const Arcade = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Classic X vs O battle against AI', color: 'from-blue-500 to-cyan-500' },
    { id: 'snake', name: 'Snake', description: 'Eat apples, grow long, don\'t crash', color: 'from-green-500 to-emerald-500' },
    { id: 'rps', name: 'Rock Paper Scissors', description: 'Beat the computer in this classic hand game', color: 'from-orange-500 to-red-500' },
    { id: 'reaction', name: 'Reaction Test', description: 'Test your reflexes against the computer', color: 'from-purple-500 to-indigo-500' },
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
                className="bg-gray-900 rounded-2xl p-6 md:p-8 w-full max-w-2xl relative border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setActiveGame(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>

                {activeGame === 'tictactoe' && <TicTacToe />}
                {activeGame === 'snake' && <SnakeGame />}
                {activeGame === 'rps' && <RockPaperScissors />}
                {activeGame === 'reaction' && <ReactionTest />}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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

    const reset = () => {
        setUserChoice(null);
        setComputerChoice(null);
        setResult(null);
    };

    return (
        <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-orange-500">Rock Paper Scissors</h2>
            {!userChoice ? (
                <div className="flex justify-center space-x-4">
                    {choices.map(c => (
                        <button key={c} onClick={() => play(c)} className="text-6xl p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
                            {icons[c]}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center items-center space-x-12">
                        <div className="text-center">
                            <p className="text-gray-400 mb-2">You</p>
                            <div className="text-6xl">{icons[userChoice]}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-500">VS</div>
                        <div className="text-center">
                            <p className="text-gray-400 mb-2">Computer</p>
                            <div className="text-6xl">{icons[computerChoice]}</div>
                        </div>
                    </div>
                    <div className="text-4xl font-bold text-white">{result}</div>
                    <button onClick={reset} className="px-6 py-2 bg-orange-500 rounded-full font-bold hover:bg-orange-600">
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
};

const ReactionTest = () => {
    const [state, setState] = useState('waiting'); // waiting, ready, now, result
    const [startTime, setStartTime] = useState(null);
    const [score, setScore] = useState(null);
    const timeoutRef = useRef(null);

    const start = () => {
        setState('ready');
        setScore(null);
        const delay = 2000 + Math.random() * 3000;
        timeoutRef.current = setTimeout(() => {
            setState('now');
            setStartTime(Date.now());
        }, delay);
    };

    const handleClick = () => {
        if (state === 'ready') {
            clearTimeout(timeoutRef.current);
            setState('waiting');
            alert("Too early!");
        } else if (state === 'now') {
            const time = Date.now() - startTime;
            setScore(time);
            setState('result');
        }
    };

    return (
        <div className="text-center space-y-6 select-none">
            <h2 className="text-3xl font-bold text-purple-500">Reaction Test</h2>
            <div 
                onClick={state !== 'waiting' && state !== 'result' ? handleClick : undefined}
                className={`w-full h-64 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                    state === 'waiting' || state === 'result' ? 'bg-gray-800' :
                    state === 'ready' ? 'bg-red-500' : 'bg-green-500'
                }`}
            >
                {state === 'waiting' && (
                    <button onClick={start} className="px-8 py-4 bg-purple-600 rounded-full font-bold text-xl hover:bg-purple-700">
                        Start Game
                    </button>
                )}
                {state === 'ready' && <p className="text-3xl font-bold text-white">Wait for Green...</p>}
                {state === 'now' && <p className="text-5xl font-bold text-white">CLICK NOW!</p>}
                {state === 'result' && (
                    <div>
                        <p className="text-4xl font-bold text-white mb-4">{score} ms</p>
                        <button onClick={start} className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold">
                            Try Again
                        </button>
                    </div>
                )}
            </div>
            <p className="text-gray-400">Click as fast as you can when the box turns green.</p>
        </div>
    );
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player is always X
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!isXNext && !winner) {
      // AI Turn
      const timer = setTimeout(() => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
          // Simple AI: Random move (improve later if needed)
          const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          handleClick(randomIndex);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, board]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">Tic Tac Toe</h2>
      <div className="grid grid-cols-3 gap-2 max-w-[300px] mx-auto mb-6">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => isXNext && handleClick(i)} // Only allow click if player turn
            className={`h-24 text-4xl font-bold rounded-xl flex items-center justify-center transition-colors ${
              square === 'X' ? 'bg-blue-600 text-white' : 
              square === 'O' ? 'bg-red-600 text-white' : 
              'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {square}
          </button>
        ))}
      </div>
      
      {winner && (
        <div className="mb-6">
          <p className="text-2xl font-bold mb-4">
            {winner === 'Draw' ? "It's a Draw!" : winner === 'X' ? "You Won!" : "AI Won!"}
          </p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-blue-600 rounded-full font-bold hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      )}
      {!winner && <p className="text-gray-400">{isXNext ? "Your Turn (X)" : "AI Thinking..."}</p>}
    </div>
  );
};

const SnakeGame = () => {
  const GRID_SIZE = 20;
  const CELL_SIZE = 20; // in pixels
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef();

  const generateFood = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  });

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
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        // Check food
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    };

    gameLoopRef.current = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoopRef.current);
  }, [direction, food, gameOver]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4 text-green-400">Snake</h2>
      <p className="mb-4 text-xl">Score: {score}</p>
      
      <div 
        className="bg-gray-800 border-2 border-gray-700 relative mb-6"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-500 rounded-sm"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE
          }}
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h3 className="text-3xl font-bold mb-2">Game Over</h3>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-green-600 rounded-full font-bold hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500">Use Arrow Keys to Move</p>
    </div>
  );
};

export default Arcade;
