import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import LanguageDemo from '../components/LanguageDemo';
import { MoodAnimations } from '../components/LottieAnimations';
import { secureApiCall, API_ENDPOINTS, rateLimiter, RATE_LIMITS } from '../config/api.js';

const MoodDetector = () => {
  const { addXp, updateStats } = useGame();
  const { getLanguagePrompt } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [moodResult, setMoodResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const detectMood = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setShowResult(false);
    
    try {
      const basePrompt = `Analyze the mood and emotions in this text: "${inputText.trim()}". Provide a mood analysis with suggestions for activities.`;
      const languageAwarePrompt = getLanguagePrompt(basePrompt, 'mood');
      
      const response = await secureApiCall(API_ENDPOINTS.MOOD_DETECT, {
        method: 'POST',
        body: JSON.stringify({
          text: inputText.trim(),
          prompt: languageAwarePrompt
        })
      });

      const data = await response.json();
      setMoodResult(data);
      setIsAnalyzing(false);
      setShowResult(true);
      
      // Award XP for using mood detection
      addXp(12);
      updateStats('motivationsGot'); // Using this as a general "AI interaction" stat
      
    } catch (error) {
      console.error('Error detecting mood:', error);
      // Fallback to mock mood detection
      const moods = ['happy', 'excited', 'tired', 'stressed', 'confident', 'bored', 'creative', 'focused'];
      const mood = moods[Math.floor(Math.random() * moods.length)];
      const suggestions = {
        happy: { activity: 'Share your joy with others!', game: 'arcade', color: 'green' },
        excited: { activity: 'Channel that energy into something fun!', game: 'arcade', color: 'orange' },
        tired: { activity: 'Take it easy with something relaxing', game: 'sing-with-me', color: 'blue' },
        stressed: { activity: 'Let off some steam!', game: 'roast-me', color: 'red' },
        confident: { activity: 'Challenge yourself!', game: 'brainlock', color: 'purple' },
        bored: { activity: 'Discover something new!', game: 'destiny', color: 'pink' },
        creative: { activity: 'Express yourself!', game: 'sing-with-me', color: 'cyan' },
        focused: { activity: 'Put that focus to good use!', game: 'brainlock', color: 'indigo' }
      };
      
      setMoodResult({ 
        mood, 
        confidence: 0.85,
        suggestion: suggestions[mood]
      });
      setIsAnalyzing(false);
      setShowResult(true);
      
      // Still award XP for fallback
      addXp(12);
      updateStats('motivationsGot');
    }
  };

  const resetDetection = () => {
    setInputText('');
    setMoodResult(null);
    setShowResult(false);
  };

  const getGamePath = (game) => {
    const gamePaths = {
      'arcade': '/arcade',
      'brainlock': '/brainlock',
      'destiny': '/destiny',
      'sing-with-me': '/sing-with-me',
      'roast-me': '/roast-me',
      'jokes': '/jokes'
    };
    return gamePaths[game] || '/';
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'from-green-500 to-emerald-500',
      excited: 'from-orange-500 to-yellow-500',
      tired: 'from-blue-500 to-indigo-500',
      stressed: 'from-red-500 to-pink-500',
      confident: 'from-purple-500 to-indigo-500',
      bored: 'from-gray-500 to-slate-500',
      creative: 'from-cyan-500 to-blue-500',
      focused: 'from-indigo-500 to-purple-500',
      neutral: 'from-gray-500 to-gray-600'
    };
    return colors[mood] || colors.neutral;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Mood Detective
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Tell me how you're feeling, and I'll analyze your mood and suggest the perfect activity for you!
          </p>
          
          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-4"
          >
            <LanguageSelector />
          </motion.div>
          
          {/* Language Preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md mx-auto"
          >
            <LanguageDemo category="compliments" />
          </motion.div>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How are you feeling right now?
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="I'm feeling excited about my new project, but also a bit overwhelmed with all the tasks I need to complete..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                rows={4}
              />
            </div>

            <motion.button
              onClick={detectMood}
              disabled={!inputText.trim() || isAnalyzing}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                !inputText.trim() || isAnalyzing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg'
              }`}
              whileHover={!inputText.trim() || isAnalyzing ? {} : { scale: 1.02 }}
              whileTap={!inputText.trim() || isAnalyzing ? {} : { scale: 0.98 }}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center">
                  <Brain className="w-5 h-5 mr-2 animate-pulse" />
                  AI is analyzing your mood...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Detect My Mood
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {showResult && moodResult && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`bg-gradient-to-r ${getMoodColor(moodResult.mood)} p-8 rounded-2xl shadow-2xl mb-8`}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6 flex justify-center"
                >
                  {MoodAnimations[moodResult.mood] ? 
                    MoodAnimations[moodResult.mood]({ size: 80 }) : 
                    <div className="text-6xl">🤖</div>
                  }
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-3xl font-bold mb-2">
                    You're feeling {moodResult.mood}!
                  </h2>
                  <p className="text-lg opacity-90 mb-4">
                    Confidence: {Math.round(moodResult.confidence * 100)}%
                  </p>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-3">AI Suggestion:</h3>
                    <p className="text-lg mb-4">{moodResult.suggestion.activity}</p>
                    
                    <Link
                      to={getGamePath(moodResult.suggestion.game)}
                      className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
                    >
                      Try {moodResult.suggestion.game.replace('-', ' ')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                  
                  <div className="text-sm opacity-75">
                    +12 XP earned for mood analysis!
                  </div>
                </motion.div>

                <div className="flex justify-center space-x-4 mt-6">
                  <motion.button
                    onClick={resetDetection}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Analyze Again
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it Works */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-cyan-400" />
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <h4 className="font-semibold mb-1">AI Analysis</h4>
              <p>Advanced language processing analyzes your text for emotional indicators</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold mb-1">Mood Detection</h4>
              <p>Identifies your primary emotion and confidence level</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-semibold mb-1">Smart Suggestions</h4>
              <p>Recommends activities that match your current mood</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodDetector;