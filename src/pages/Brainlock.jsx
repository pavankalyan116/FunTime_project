import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, RefreshCw, Timer, Flame, Sparkles, ChevronRight, Target } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Brainlock = () => {
  const [topic, setTopic] = useState('');
  const [gameStatus, setGameStatus] = useState('idle'); // idle, loading, playing, finished
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [timedMode, setTimedMode] = useState(true);
  const [timePerQuestion, setTimePerQuestion] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20);

  const topicPresets = [
    'Space',
    'Cricket',
    'Marvel',
    'Geography',
    'Coding',
    'Movies',
    'History',
    'Anime'
  ];

  const current = questions[currentQuestion];
  const totalQuestions = questions.length || questionCount;
  const progressPct = totalQuestions ? Math.round(((currentQuestion + (gameStatus === 'finished' ? 1 : 0)) / totalQuestions) * 100) : 0;
  const questionTime = Math.max(5, Math.min(60, Number(timePerQuestion) || 20));

  const startQuiz = async () => {
    if (!topic) return;
    setGameStatus('loading');
    setQuestions([]);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(questionTime);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Generate ${questionCount} unique, ${difficulty} multiple-choice quiz questions about "${topic}".
            Format the response ONLY as a raw JSON array (no markdown, no extra text) with this structure:
            [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}]
            Make sure options are an array of strings and correctAnswer is the index (0-3). Keep explanations short and clear.`
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
        setTimeLeft(questionTime);
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      console.error("Quiz generation failed", e);
      alert("Failed to generate quiz. Try a different topic.");
      setGameStatus('idle');
    }
  };

  useEffect(() => {
    if (!timedMode) return;
    if (gameStatus !== 'playing') return;
    if (!current) return;
    if (showExplanation) return;

    if (timeLeft <= 0) {
      if (selectedAnswer === null) {
        setSelectedAnswer(-1);
        setShowExplanation(true);
        setStreak(0);
      }
      return;
    }

    const t = window.setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [timedMode, gameStatus, showExplanation, timeLeft, selectedAnswer, current]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);

    const correct = index === current.correctAnswer;
    if (correct) {
      setScore((s) => s + 1);
    }
    setStreak((prev) => {
      const next = correct ? prev + 1 : 0;
      setBestStreak((b) => Math.max(b, next));
      return next;
    });
  };

  const nextStep = () => {
    if (gameStatus !== 'playing') return;
    setShowExplanation(false);
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setTimeLeft(questionTime);
    } else {
      setGameStatus('finished');
    }
  };

  const reset = () => {
    setTopic('');
    setGameStatus('idle');
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(questionTime);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-indigo-950/20 to-gray-950 p-4 md:p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-28 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-900/60 border border-gray-800 backdrop-blur-sm mb-6"
          >
            <Brain className="w-5 h-5 text-purple-300" />
            <span className="text-sm text-gray-300">AI Quiz Arena</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent mb-3">
            Brainlock
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Pick a topic, set the vibe, and battle through smart questions with streaks and timers.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {gameStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-900/60 rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl backdrop-blur-sm"
            >
              <div className="space-y-6">
                <div className="grid gap-4">
                  <label className="text-lg font-medium text-gray-200">Choose your topic</label>
                  <div className="flex flex-wrap gap-2">
                    {topicPresets.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          topic === t
                            ? 'bg-purple-600/30 border-purple-400/40 text-purple-100'
                            : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Space, 90s Music, Quantum Physics..."
                    className="bg-gray-950/40 border border-gray-700 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-lg backdrop-blur-sm"
                    onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-950/30 border border-gray-800 rounded-2xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Difficulty</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['easy', 'medium', 'hard'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                            difficulty === d
                              ? 'bg-indigo-600/30 border-indigo-400/40 text-indigo-100'
                              : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-950/30 border border-gray-800 rounded-2xl p-4">
                    <div className="text-sm text-gray-400 mb-2">Questions</div>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 7, 10].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setQuestionCount(n)}
                          className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                            questionCount === n
                              ? 'bg-purple-600/30 border-purple-400/40 text-purple-100'
                              : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-950/30 border border-gray-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-400">Timer</div>
                      <button
                        type="button"
                        onClick={() => setTimedMode((s) => !s)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          timedMode
                            ? 'bg-pink-600/25 border-pink-400/40 text-pink-100'
                            : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {timedMode ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className={`flex items-center gap-3 ${timedMode ? '' : 'opacity-40 pointer-events-none'}`}>
                      <Timer className="w-4 h-4 text-gray-300" />
                      <input
                        type="range"
                        min="10"
                        max="40"
                        step="5"
                        value={questionTime}
                        onChange={(e) => {
                          const v = Number(e.target.value) || 20;
                          setTimePerQuestion(v);
                          setTimeLeft(v);
                        }}
                        className="w-full"
                      />
                      <div className="text-sm text-gray-200 w-10 text-right">{questionTime}s</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={startQuiz}
                  disabled={!topic}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
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
              <p className="mt-4 text-xl font-medium animate-pulse">Forging questions from stardust...</p>
              <p className="mt-2 text-sm text-gray-500">Topic: {topic} • {difficulty} • {questionCount} Qs</p>
            </motion.div>
          )}

          {gameStatus === 'playing' && questions.length > 0 && (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900/60 rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl backdrop-blur-sm"
            >
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gray-950/40 border border-gray-800 text-xs font-mono text-gray-300">
                      Q {currentQuestion + 1} / {questions.length}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/20 text-xs font-semibold text-purple-200 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Score {score}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-pink-600/15 border border-pink-500/20 text-xs font-semibold text-pink-200 flex items-center gap-2">
                      <Flame className="w-4 h-4" />
                      Streak {streak}
                    </span>
                  </div>

                  {timedMode && (
                    <div className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-2 ${
                      timeLeft <= 5 ? 'bg-red-600/20 border-red-500/30 text-red-200' : 'bg-indigo-600/15 border-indigo-500/20 text-indigo-200'
                    }`}>
                      <Timer className="w-4 h-4" />
                      {Math.max(0, timeLeft)}s
                    </div>
                  )}
                </div>

                <div className="h-2 w-full rounded-full bg-black/30 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, Math.round(((currentQuestion) / questions.length) * 100)))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold leading-snug">
                  {current?.question}
                </h2>

                <div className="grid gap-3">
                  {current.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === current.correctAnswer;
                    const isTimedOut = selectedAnswer === -1;
                    const letters = ['A', 'B', 'C', 'D'];

                    let btnClass = 'bg-gray-950/30 border-gray-800 hover:bg-gray-900/50 hover:border-gray-700';
                    if (showExplanation) {
                      if (isCorrect) btnClass = 'bg-green-600/25 border-green-500/30';
                      else if (isSelected) btnClass = 'bg-red-600/25 border-red-500/30';
                      else btnClass = 'bg-gray-950/20 border-gray-900/30 opacity-60';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={showExplanation}
                        className={`w-full p-4 md:p-5 rounded-2xl text-left transition-all font-medium flex items-start justify-between gap-4 border ${btnClass}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black border ${
                            showExplanation && isCorrect
                              ? 'bg-green-500/20 border-green-500/30 text-green-100'
                              : showExplanation && isSelected
                              ? 'bg-red-500/20 border-red-500/30 text-red-100'
                              : 'bg-white/5 border-white/10 text-gray-100'
                          }`}>
                            {letters[idx]}
                          </span>
                          <span className="text-base md:text-lg text-gray-100 leading-relaxed">{option}</span>
                        </div>

                        <div className="pt-1">
                          {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-green-200" />}
                          {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-200" />}
                          {showExplanation && isTimedOut && <Timer className="w-5 h-5 text-red-200" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-5 rounded-2xl bg-gray-950/40 border border-gray-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-400">
                            Correct answer: <span className="text-gray-200 font-semibold">{current.options[current.correctAnswer]}</span>
                          </div>
                          <div className="text-sm text-gray-300 leading-relaxed">
                            <span className="font-semibold text-gray-200">Explanation:</span> {current.explanation}
                          </div>
                        </div>

                        <button
                          onClick={nextStep}
                          className="shrink-0 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all font-bold flex items-center gap-2"
                        >
                          Next
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {gameStatus === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/60 rounded-3xl p-8 md:p-10 border border-gray-800 shadow-2xl text-center backdrop-blur-sm"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-950/40 border border-gray-800 mb-6">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm text-gray-300">Challenge Complete</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">Final Score</h2>

              <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-600 mb-4">
                {score} / {questions.length}
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <span className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/20 text-sm text-purple-200">
                  Best streak: {bestStreak}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-600/15 border border-indigo-500/20 text-sm text-indigo-200">
                  Accuracy: {questions.length ? Math.round((score / questions.length) * 100) : 0}%
                </span>
                <span className="px-3 py-1 rounded-full bg-pink-600/15 border border-pink-500/20 text-sm text-pink-200">
                  Topic: {topic}
                </span>
              </div>

              <p className="text-gray-400 mb-10">
                {score === questions.length
                  ? "Perfect run. Absolute legend."
                  : score >= Math.ceil(questions.length * 0.7)
                  ? "Strong performance. One more run for perfection."
                  : "Warm-up complete. Try a new topic and level up."}
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                <button
                  onClick={() => setGameStatus('idle')}
                  className="flex items-center justify-center w-full bg-gray-800/70 hover:bg-gray-700 py-4 rounded-2xl font-bold transition-colors border border-gray-700"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Play Again
                </button>
                <button
                  onClick={reset}
                  className="flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  New Topic
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Brainlock;
