import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Brainlock = () => {
  const [topic, setTopic] = useState('');
  const [gameStatus, setGameStatus] = useState('idle'); // idle, loading, playing, finished
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = async () => {
    if (!topic) return;
    setGameStatus('loading');
    setQuestions([]);
    setScore(0);
    setCurrentQuestion(0);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Generate 5 unique, challenging multiple-choice quiz questions about "${topic}". 
            Format the response ONLY as a raw JSON array (no markdown, no extra text) with this structure:
            [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}]
            Make sure options are an array of strings and correctAnswer is the index (0-3).`
          }]
        })
      });

      const data = await response.json();
      
      if (!data.content) {
        throw new Error(data.error || "No content received");
      }

      let content = data.content;
      // Clean up markdown if present
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const quizData = JSON.parse(content);
      
      if (Array.isArray(quizData) && quizData.length > 0) {
        setQuestions(quizData);
        setGameStatus('playing');
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error("Quiz generation failed", e);
      alert("Failed to generate quiz. Try a different topic.");
      setGameStatus('idle');
    }
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQuestion].correctAnswer) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(c => c + 1);
      } else {
        setGameStatus('finished');
      }
    }, 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-4 md:p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-4">
            Brainlock
          </h1>
          <p className="text-gray-400">Unlock your mind with AI-generated challenges.</p>
        </div>

        <AnimatePresence mode="wait">
          {gameStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl"
            >
              <div className="flex flex-col space-y-4">
                <label className="text-lg font-medium text-gray-300">Choose your topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Space, 90s Music, Quantum Physics..."
                  className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                />
                <button
                  onClick={startQuiz}
                  disabled={!topic}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
                >
                  Start Challenge
                </button>
              </div>
            </motion.div>
          )}

          {gameStatus === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Brain className="w-16 h-16 text-purple-500" />
              </motion.div>
              <p className="mt-4 text-xl font-medium animate-pulse">Generating unique questions...</p>
            </motion.div>
          )}

          {gameStatus === 'playing' && questions.length > 0 && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-800 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-mono text-gray-400">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-sm font-mono text-purple-400">Score: {score}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-8">{questions[currentQuestion].question}</h2>
              
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === questions[currentQuestion].correctAnswer;
                  
                  let btnClass = "bg-gray-800 hover:bg-gray-700";
                  if (showExplanation) {
                    if (isCorrect) btnClass = "bg-green-600";
                    else if (isSelected) btnClass = "bg-red-600";
                    else btnClass = "bg-gray-800 opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl text-left transition-all font-medium flex justify-between items-center ${btnClass}`}
                    >
                      <span>{option}</span>
                      {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-white" />}
                      {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300"
                >
                  <strong>Explanation:</strong> {questions[currentQuestion].explanation}
                </motion.div>
              )}
            </motion.div>
          )}

          {gameStatus === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
              <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6">
                {score} / {questions.length}
              </div>
              <p className="text-gray-400 mb-8">
                {score === questions.length ? "Incredible! You're a genius." : 
                 score > questions.length / 2 ? "Great job! Keep it up." : "Good effort! Try again."}
              </p>
              <button
                onClick={() => setGameStatus('idle')}
                className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 py-4 rounded-xl font-bold transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Brainlock;
