import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Heart, Zap, Share2, RefreshCw, Sparkles } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import LanguageDemo from '../components/LanguageDemo';
import { LoadingAnimation, FireAnimation, HeartAnimation, LightningAnimation } from '../components/LottieAnimations';
import { secureApiCall, API_ENDPOINTS, rateLimiter, RATE_LIMITS } from '../config/api.js';

const RoastMe = () => {
  const { addXp, updateStats, updateStreak } = useGame();
  const { getLanguagePrompt, language } = useLanguage();
  const [name, setName] = useState('');
  const [mood, setMood] = useState('');
  const [mode, setMode] = useState('roast'); // 'roast', 'compliment', 'motivation'
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const modes = [
    { id: 'roast', label: 'Roast Me', icon: Flame, color: 'from-red-500 to-orange-500', emoji: '🔥' },
    { id: 'compliment', label: 'Compliment Me', icon: Heart, color: 'from-pink-500 to-rose-500', emoji: '💖' },
    { id: 'motivation', label: 'Motivate Me', icon: Zap, color: 'from-blue-500 to-purple-500', emoji: '⚡' }
  ];

  const generateResponse = async () => {
    if (!name.trim()) return;
    
    // Check rate limiting
    if (!rateLimiter.isAllowed(API_ENDPOINTS.PERSONALITY, RATE_LIMITS.PERSONALITY_PER_MINUTE)) {
      setResult("Please wait a moment before generating another response.");
      return;
    }
    
    setIsLoading(true);
    setShowResult(false);
    
    // Update streak when user plays
    updateStreak();
    
    try {
      const basePrompt = `Generate a ${mode} for someone named ${name.trim()}${mood.trim() ? ` who is feeling ${mood.trim()}` : ''}. Make it creative, witty, and appropriate for the ${mode} style.`;
      
      const languageAwarePrompt = getLanguagePrompt(basePrompt, mode);
      
      const response = await secureApiCall(API_ENDPOINTS.PERSONALITY, {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          mood: mood.trim() || null,
          mode,
          language
        })
      });

      const data = await response.json();
      setResult(data.content);
      setIsLoading(false);
      setShowResult(true);
      
      // Award XP and update stats based on mode
      let xpAmount = 10;
      let statKey = '';
      
      switch(mode) {
        case 'roast':
          statKey = 'roastsGenerated';
          xpAmount = 15;
          break;
        case 'compliment':
          statKey = 'complimentsReceived';
          xpAmount = 12;
          break;
        case 'motivation':
          statKey = 'motivationsGot';
          xpAmount = 18;
          break;
      }
      
      addXp(xpAmount);
      updateStats(statKey);
      
    } catch (error) {
      // Show error message to user
      const errorMessage = error.message.includes('Rate limit') 
        ? 'Please wait a moment before trying again.'
        : 'Unable to generate response. Please check your internet connection and try again.';
      
      setCurrentResponse(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FunTime AI Result',
        text: result,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(result);
      // You could add a toast notification here
    }
  };

  const currentMode = modes.find(m => m.id === mode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            AI Personality Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Let our AI analyze your vibe and give you exactly what you need - roasts, compliments, or motivation!
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
            <LanguageDemo category={mode} />
          </motion.div>
        </motion.div>

        {/* Mode Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {modes.map((modeOption) => (
            <motion.button
              key={modeOption.id}
              onClick={() => setMode(modeOption.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                mode === modeOption.id
                  ? `bg-gradient-to-r ${modeOption.color} text-white shadow-lg scale-105`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: mode === modeOption.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-2">{modeOption.emoji}</span>
              {modeOption.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content Warning for Roast Mode */}
        {mode === 'roast' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6 text-center"
          >
            <p className="text-red-400 text-sm">
              ⚠️ <strong>Adult Content Warning:</strong> Roasts may contain mild profanity and mature humor
            </p>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What's your name?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How are you feeling? (optional)
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Tired, excited, bored, confident..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <motion.button
              onClick={generateResponse}
              disabled={!name.trim() || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                !name.trim() || isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${currentMode.color} text-white hover:shadow-lg`
              }`}
              whileHover={!name.trim() || isLoading ? {} : { scale: 1.02 }}
              whileTap={!name.trim() || isLoading ? {} : { scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingAnimation size={24} />
                  <span className="ml-2">AI is thinking...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <currentMode.icon className="w-5 h-5 mr-2" />
                  Generate {currentMode.label.split(' ')[0]}
                </div>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`bg-gradient-to-r ${currentMode.color} p-8 rounded-2xl shadow-2xl`}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4 flex justify-center"
                >
                  {mode === 'roast' && <FireAnimation size={80} />}
                  {mode === 'compliment' && <HeartAnimation size={80} />}
                  {mode === 'motivation' && <LightningAnimation size={80} />}
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl font-medium mb-6 leading-relaxed"
                >
                  {result}
                </motion.p>

                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    onClick={shareResult}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </motion.button>
                  
                  <motion.button
                    onClick={generateResponse}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoastMe;