import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, RefreshCw, Timer, Flame, Sparkles, ChevronRight, Target, Zap, Trophy, Star } from 'lucide-react';

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
  const [isAnswering, setIsAnswering] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);

  const topicPresets = [
    { name: 'Space & Astronomy', icon: '🚀', color: 'from-blue-500 to-purple-600' },
    { name: 'Cricket', icon: '🏏', color: 'from-green-500 to-blue-500' },
    { name: 'Marvel Universe', icon: '⚡', color: 'from-red-500 to-yellow-500' },
    { name: 'Geography', icon: '🌍', color: 'from-green-500 to-teal-500' },
    { name: 'Programming', icon: '💻', color: 'from-purple-500 to-pink-500' },
    { name: 'Movies & Cinema', icon: '🎬', color: 'from-orange-500 to-red-500' },
    { name: 'World History', icon: '📚', color: 'from-amber-500 to-orange-500' },
    { name: 'Anime & Manga', icon: '🎌', color: 'from-pink-500 to-purple-500' },
    { name: 'Science', icon: '🔬', color: 'from-cyan-500 to-blue-500' },
    { name: 'Sports', icon: '⚽', color: 'from-green-500 to-emerald-500' }
  ];

  const current = questions[currentQuestion];
  const totalQuestions = questions.length || questionCount;
  const progressPct = totalQuestions ? Math.round(((currentQuestion + (gameStatus === 'finished' ? 1 : 0)) / totalQuestions) * 100) : 0;
  const questionTime = Math.max(5, Math.min(60, Number(timePerQuestion) || 20));

  // Enhanced quiz generation with better error handling and retry logic
  const startQuiz = useCallback(async () => {
    if (!topic) return;
    setGameStatus('loading');
    setQuestions([]);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setStreak(0);
    setTimeLeft(questionTime);
    setTotalTime(0);
    setQuestionStartTime(Date.now());

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: `Generate exactly ${questionCount} unique ${difficulty}-level quiz questions about "${topic}".

CRITICAL: Return ONLY valid JSON array, NO markdown, NO backticks, NO extra text.

FORMAT: [{"question": "Clear question?", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Brief explanation"}]

REQUIREMENTS:
- Questions must be clear and unambiguous
- Options should be plausible, only one correct
- correctAnswer is index (0-3) of correct option
- Explanations: 1-2 sentences max
- Difficulty: ${difficulty} (easy=basic facts, medium=thinking required, hard=expert level)
- Make engaging and educational

Topic: ${topic}
Count: ${questionCount}
Level: ${difficulty}`
            }],
            temperature: 0.8,
            top_p: 0.9
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.content) {
          throw new Error("No content received from API");
        }

        let content = data.content.trim();
        
        // Clean up any markdown formatting
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        
        // Remove any leading/trailing text that isn't JSON
        const jsonStart = content.indexOf('[');
        const jsonEnd = content.lastIndexOf(']');
        
        if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("No valid JSON array found in response");
        }
        
        content = content.substring(jsonStart, jsonEnd + 1);
        
        const quizData = JSON.parse(content);
        
        // Validate the quiz data structure
        if (!Array.isArray(quizData) || quizData.length === 0) {
          throw new Error("Invalid quiz format: not an array or empty");
        }

        // Validate each question
        for (let i = 0; i < quizData.length; i++) {
          const q = quizData[i];
          if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || 
              typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3 ||
              !q.explanation) {
            throw new Error(`Invalid question format at index ${i}`);
          }
        }
        
        setQuestions(quizData);
        setGameStatus('playing');
        setTimeLeft(questionTime);
        return; // Success, exit the retry loop
        
      } catch (e) {
        attempts++;
        
        if (attempts >= maxAttempts) {
          alert(`Failed to generate quiz after ${maxAttempts} attempts. Please try a different topic or check your connection.`);
          setGameStatus('idle');
          return;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }, [topic, questionCount, difficulty, questionTime, API_URL]);

  // Enhanced timer with smooth countdown
  useEffect(() => {
    if (!timedMode || gameStatus !== 'playing' || !current || showExplanation || isAnswering) return;

    if (timeLeft <= 0) {
      if (selectedAnswer === null) {
        handleTimeOut();
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timedMode, gameStatus, showExplanation, timeLeft, selectedAnswer, current, isAnswering]);

  // Handle timeout
  const handleTimeOut = useCallback(() => {
    setSelectedAnswer(-1);
    setShowExplanation(true);
    setStreak(0);
    setShowCorrectAnswer(true);
    
    // Add time penalty
    if (questionStartTime) {
      setTotalTime(prev => prev + (Date.now() - questionStartTime));
    }
  }, [questionStartTime]);

  // Enhanced answer handling with animations
  const handleAnswer = useCallback((index) => {
    if (selectedAnswer !== null || isAnswering) return;
    
    setIsAnswering(true);
    setSelectedAnswer(index);
    
    // Calculate time taken for this question
    if (questionStartTime) {
      setTotalTime(prev => prev + (Date.now() - questionStartTime));
    }
    
    setTimeout(() => {
      setShowExplanation(true);
      setShowCorrectAnswer(true);
      
      const correct = index === current.correctAnswer;
      if (correct) {
        setScore(s => s + 1);
      }
      
      setStreak(prev => {
        const next = correct ? prev + 1 : 0;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      
      setIsAnswering(false);
    }, 800);
  }, [selectedAnswer, isAnswering, current, questionStartTime]);

  // Enhanced next step with smooth transitions
  const nextStep = useCallback(() => {
    if (gameStatus !== 'playing') return;
    
    setShowExplanation(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setIsAnswering(false);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
      setTimeLeft(questionTime);
      setQuestionStartTime(Date.now());
    } else {
      setGameStatus('finished');
    }
  }, [gameStatus, currentQuestion, questions.length, questionTime]);

  // Enhanced reset function
  const reset = useCallback(() => {
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
    setIsAnswering(false);
    setShowCorrectAnswer(false);
    setTotalTime(0);
    setQuestionStartTime(null);
  }, [questionTime]);

  // Get performance rating
  const getPerformanceRating = useCallback(() => {
    const accuracy = questions.length ? (score / questions.length) * 100 : 0;
    if (accuracy === 100) return { text: "Perfect! 🏆", color: "text-yellow-400" };
    if (accuracy >= 80) return { text: "Excellent! ⭐", color: "text-green-400" };
    if (accuracy >= 60) return { text: "Good Job! 👍", color: "text-blue-400" };
    if (accuracy >= 40) return { text: "Keep Trying! 💪", color: "text-orange-400" };
    return { text: "Practice More! 📚", color: "text-red-400" };
  }, [score, questions.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-indigo-950/20 to-gray-950 p-4 md:p-8 text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute -bottom-28 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border border-purple-500/30 backdrop-blur-sm mb-6"
          >
            <Brain className="w-6 h-6 text-purple-300" />
            <span className="text-sm font-semibold text-purple-200">AI-Powered Quiz Arena</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent mb-4"
          >
            Brainlock
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Challenge your mind with AI-generated questions. Build streaks, beat the clock, and unlock your potential.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {gameStatus === 'idle' && (
            <motion.div
              key="setup"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 rounded-3xl p-6 md:p-10 border border-gray-800/50 shadow-2xl backdrop-blur-sm"
            >
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Topic Selection */}
                <div className="space-y-4">
                  <label className="text-xl font-bold text-gray-200 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    Choose Your Challenge
                  </label>
                  
                  {/* Topic Presets */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {topicPresets.map((preset) => (
                      <motion.button
                        key={preset.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTopic(preset.name)}
                        className={`p-4 rounded-2xl text-sm font-semibold border transition-all duration-300 ${
                          topic === preset.name
                            ? `bg-gradient-to-r ${preset.color} text-white border-white/20 shadow-lg`
                            : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800/60'
                        }`}
                      >
                        <div className="text-2xl mb-2">{preset.icon}</div>
                        <div className="text-xs leading-tight">{preset.name}</div>
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Custom Topic Input */}
                  <motion.div variants={itemVariants}>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Or enter your own topic... (e.g., Quantum Physics, 90s Music)"
                      className="w-full bg-gray-950/50 border border-gray-700/50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-lg backdrop-blur-sm transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                    />
                  </motion.div>
                </div>

                {/* Settings Grid */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                  {/* Difficulty */}
                  <div className="bg-gradient-to-br from-gray-950/40 to-gray-900/40 border border-gray-800/50 rounded-2xl p-5">
                    <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-indigo-400" />
                      Difficulty Level
                    </div>
                    <div className="space-y-2">
                      {[
                        { key: 'easy', label: 'Easy', desc: 'Basic facts', color: 'green' },
                        { key: 'medium', label: 'Medium', desc: 'Requires thinking', color: 'yellow' },
                        { key: 'hard', label: 'Hard', desc: 'Expert level', color: 'red' }
                      ].map((d) => (
                        <button
                          key={d.key}
                          onClick={() => setDifficulty(d.key)}
                          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
                            difficulty === d.key
                              ? `bg-${d.color}-600/20 border-${d.color}-500/40 text-${d.color}-200`
                              : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <div className="font-bold">{d.label}</div>
                          <div className="text-xs opacity-75">{d.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Question Count */}
                  <div className="bg-gradient-to-br from-gray-950/40 to-gray-900/40 border border-gray-800/50 rounded-2xl p-5">
                    <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      Questions
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 7, 10].map((n) => (
                        <button
                          key={n}
                          onClick={() => setQuestionCount(n)}
                          className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                            questionCount === n
                              ? 'bg-purple-600/25 border-purple-500/40 text-purple-200'
                              : 'bg-gray-900/40 border-gray-700 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timer Settings */}
                  <div className="bg-gradient-to-br from-gray-950/40 to-gray-900/40 border border-gray-800/50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-pink-400" />
                        Timer Mode
                      </div>
                      <button
                        onClick={() => setTimedMode(s => !s)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          timedMode
                            ? 'bg-pink-600/25 border-pink-500/40 text-pink-200'
                            : 'bg-gray-900/40 border-gray-700 text-gray-300'
                        }`}
                      >
                        {timedMode ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className={`space-y-3 ${timedMode ? '' : 'opacity-40 pointer-events-none'}`}>
                      <div className="flex items-center gap-3">
                        <Timer className="w-4 h-4 text-gray-400" />
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
                          className="flex-1 accent-pink-500"
                        />
                        <div className="text-sm font-bold text-gray-200 w-12 text-right">{questionTime}s</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Start Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startQuiz}
                    disabled={!topic}
                    className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-6 h-6" />
                    Launch Challenge
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Loading State */}
          {gameStatus === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 rounded-3xl border border-gray-800/50 backdrop-blur-sm"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                  scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
                className="relative mb-8"
              >
                <Brain className="w-20 h-20 text-purple-500" />
                <motion.div
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 w-20 h-20 border-4 border-purple-400/30 rounded-full"
                />
              </motion.div>
              
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold mb-2">Crafting Your Challenge</h3>
                <p className="text-gray-400 mb-4">AI is generating personalized questions...</p>
                <div className="flex items-center justify-center gap-2 text-sm text-purple-300">
                  <span>📚 Topic: {topic}</span>
                  <span>•</span>
                  <span>⚡ {difficulty}</span>
                  <span>•</span>
                  <span>🎯 {questionCount} Questions</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Playing State */}
          {gameStatus === 'playing' && questions.length > 0 && (
            <motion.div
              key={`question-${currentQuestion}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 rounded-3xl p-6 md:p-10 border border-gray-800/50 shadow-2xl backdrop-blur-sm"
            >
              {/* Enhanced Progress Header */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 rounded-full bg-gray-950/50 border border-gray-800 text-sm font-mono text-gray-300">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <motion.span 
                      animate={{ scale: score > 0 ? [1, 1.1, 1] : 1 }}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 text-sm font-bold text-purple-200 flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Score: {score}
                    </motion.span>
                    <motion.span 
                      animate={{ 
                        scale: streak > 0 ? [1, 1.1, 1] : 1,
                        rotate: streak > 2 ? [0, 5, -5, 0] : 0
                      }}
                      className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${
                        streak > 0 
                          ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border-orange-500/30 text-orange-200' 
                          : 'bg-gray-800/30 border-gray-700 text-gray-400'
                      }`}
                    >
                      <Flame className="w-4 h-4" />
                      Streak: {streak}
                    </motion.span>
                  </div>

                  {timedMode && (
                    <motion.div 
                      animate={{ 
                        scale: timeLeft <= 5 ? [1, 1.05, 1] : 1,
                        backgroundColor: timeLeft <= 5 ? ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)'] : 'rgba(99, 102, 241, 0.1)'
                      }}
                      transition={{ duration: 0.5 }}
                      className={`px-4 py-2 rounded-full border text-sm font-bold flex items-center gap-2 ${
                        timeLeft <= 5 
                          ? 'border-red-500/40 text-red-200' 
                          : 'border-indigo-500/30 text-indigo-200'
                      }`}
                    >
                      <Timer className="w-4 h-4" />
                      {Math.max(0, timeLeft)}s
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Progress Bar */}
                <div className="relative h-3 w-full rounded-full bg-gray-950/50 overflow-hidden border border-gray-800/50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 relative"
                  >
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Question Display */}
              <motion.div variants={itemVariants} className="space-y-8">
                <motion.h2 
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl md:text-3xl font-bold leading-snug text-gray-100"
                >
                  {current?.question}
                </motion.h2>

                {/* Enhanced Options */}
                <div className="grid gap-4">
                  {current.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === current.correctAnswer;
                    const isTimedOut = selectedAnswer === -1;
                    const letters = ['A', 'B', 'C', 'D'];

                    let btnClass = 'bg-gray-950/40 border-gray-800/50 hover:bg-gray-900/60 hover:border-gray-700/60';
                    let iconClass = 'bg-gray-800/50 border-gray-700/50 text-gray-300';
                    
                    if (showExplanation || showCorrectAnswer) {
                      if (isCorrect) {
                        btnClass = 'bg-gradient-to-r from-green-600/25 to-emerald-600/25 border-green-500/40';
                        iconClass = 'bg-green-500/20 border-green-500/40 text-green-200';
                      } else if (isSelected) {
                        btnClass = 'bg-gradient-to-r from-red-600/25 to-pink-600/25 border-red-500/40';
                        iconClass = 'bg-red-500/20 border-red-500/40 text-red-200';
                      } else {
                        btnClass = 'bg-gray-950/20 border-gray-900/30 opacity-60';
                        iconClass = 'bg-gray-800/30 border-gray-700/30 text-gray-500';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-gradient-to-r from-purple-600/25 to-indigo-600/25 border-purple-500/40';
                      iconClass = 'bg-purple-500/20 border-purple-500/40 text-purple-200';
                    }

                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={!showExplanation ? { scale: 1.02 } : {}}
                        whileTap={!showExplanation ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(idx)}
                        disabled={showExplanation || isAnswering}
                        className={`w-full p-5 md:p-6 rounded-2xl text-left transition-all duration-300 font-medium flex items-start justify-between gap-4 border ${btnClass}`}
                      >
                        <div className="flex items-start gap-4">
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border transition-all ${iconClass}`}>
                            {letters[idx]}
                          </span>
                          <span className="text-base md:text-lg text-gray-100 leading-relaxed flex-1">{option}</span>
                        </div>

                        <div className="pt-2">
                          {showExplanation && isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            </motion.div>
                          )}
                          {showExplanation && isSelected && !isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <XCircle className="w-6 h-6 text-red-400" />
                            </motion.div>
                          )}
                          {isTimedOut && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Timer className="w-6 h-6 text-orange-400" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Enhanced Explanation */}
                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="p-6 rounded-2xl bg-gradient-to-br from-gray-950/60 to-gray-900/60 border border-gray-800/50 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="space-y-3 flex-1">
                          <div className="text-sm text-gray-400">
                            <span className="font-semibold text-green-400">Correct Answer:</span>{' '}
                            <span className="text-gray-200 font-semibold">{current.options[current.correctAnswer]}</span>
                          </div>
                          <div className="text-sm text-gray-300 leading-relaxed">
                            <span className="font-semibold text-gray-200">Explanation:</span> {current.explanation}
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={nextStep}
                          className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all font-bold flex items-center gap-2"
                        >
                          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Finished State */}
          {gameStatus === 'finished' && (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 rounded-3xl p-8 md:p-12 border border-gray-800/50 shadow-2xl text-center backdrop-blur-sm"
            >
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Results Header */}
                <div>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-purple-900/40 border border-purple-500/30 mb-6"
                  >
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span className="text-sm font-bold text-purple-200">Challenge Complete!</span>
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </motion.div>

                  <motion.h2 
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-black mb-4"
                  >
                    Final Results
                  </motion.h2>
                </div>

                {/* Score Display */}
                <motion.div
                  variants={itemVariants}
                  className="relative"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-600 mb-6"
                  >
                    {score} / {questions.length}
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`text-2xl font-bold mb-4 ${getPerformanceRating().color}`}
                  >
                    {getPerformanceRating().text}
                  </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30">
                    <div className="text-2xl font-black text-purple-200">{bestStreak}</div>
                    <div className="text-xs text-purple-300">Best Streak</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-indigo-500/30">
                    <div className="text-2xl font-black text-indigo-200">
                      {questions.length ? Math.round((score / questions.length) * 100) : 0}%
                    </div>
                    <div className="text-xs text-indigo-300">Accuracy</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-600/20 to-red-600/20 border border-pink-500/30">
                    <div className="text-2xl font-black text-pink-200">{Math.round(totalTime / 1000)}s</div>
                    <div className="text-xs text-pink-300">Total Time</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30">
                    <div className="text-2xl font-black text-green-200">{difficulty}</div>
                    <div className="text-xs text-green-300">Difficulty</div>
                  </div>
                </motion.div>

                {/* Motivational Message */}
                <motion.p variants={itemVariants} className="text-gray-400 text-lg mb-8">
                  {score === questions.length
                    ? "🏆 Perfect score! You're absolutely brilliant!"
                    : score >= Math.ceil(questions.length * 0.8)
                    ? "⭐ Outstanding performance! Almost perfect!"
                    : score >= Math.ceil(questions.length * 0.6)
                    ? "👍 Great job! You're getting the hang of it!"
                    : "💪 Good effort! Practice makes perfect!"}
                </motion.p>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setGameStatus('idle');
                      setQuestionStartTime(null);
                    }}
                    className="flex items-center justify-center w-full bg-gray-800/70 hover:bg-gray-700/70 py-4 rounded-2xl font-bold transition-all border border-gray-700/50"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Same Topic Again
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={reset}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    New Challenge
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Brainlock;
