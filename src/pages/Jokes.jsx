import { useState } from 'react';
import { Laugh, RefreshCw, Copy, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import indianPromptManager, { 
  processJokeResponse,
  isJokeDuplicate 
} from '../utils/indianPromptSystem.js';
import { secureApiCall, API_ENDPOINTS, rateLimiter, RATE_LIMITS } from '../config/api.js';

const Jokes = () => {
  const { addXp, updateStats } = useGame();
  
  const [currentJoke, setCurrentJoke] = useState('');
  const [jokeHistory, setJokeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('family');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateAIJoke = async (category) => {
    // Only block API calls during SSR
    if (typeof window === 'undefined') {
      return null;
    }
    
    // Check rate limiting
    if (!rateLimiter.isAllowed(API_ENDPOINTS.CHAT, RATE_LIMITS.JOKES_PER_MINUTE)) {
      return null;
    }
    
    try {
      // Generate Indian cultural prompt with session tracking
      const selectedPrompt = indianPromptManager.generateDiversePrompt(category);
      
      const response = await secureApiCall(API_ENDPOINTS.CHAT, {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: selectedPrompt
            }
          ],
          // Add some randomness to model parameters
          temperature: 0.9 + Math.random() * 0.1, // 0.9-1.0
          top_p: 0.9 + Math.random() * 0.1 // 0.9-1.0
        })
      });

      const data = await response.json();
      
      let aiJoke = data.content || '';
      
      // Use enhanced response cleaning
      aiJoke = processJokeResponse(aiJoke, category, []).cleanedJoke;
      
      if (!aiJoke || aiJoke.length < 10) {
        console.error('No valid joke content in response');
        return null;
      }
      
      return aiJoke;
    } catch (error) {
      console.error('Error in generateAIJoke:', error.message);
      return null;
    }
  };

  const generateNewJoke = async () => {
    setIsLoading(true);
    
    try {
      let aiJoke = await generateAIJoke(selectedCategory);
      
      if (!aiJoke) {
        setCurrentJoke("Sorry, couldn't generate a joke right now. Please try again!");
        return;
      }
      
      // Use enhanced joke processing pipeline
      let processedResult = processJokeResponse(aiJoke, selectedCategory, jokeHistory);
      
      let tries = 0;
      const maxTries = 3;
      
      // Retry if joke is duplicate or low quality
      while (tries < maxTries && (!processedResult.isValid || processedResult.isDuplicate)) {
        aiJoke = await generateAIJoke(selectedCategory);
        if (!aiJoke) break;
        
        processedResult = processJokeResponse(aiJoke, selectedCategory, jokeHistory);
        tries++;
      }
      
      if (processedResult.isValid && !processedResult.isDuplicate) {
        const finalJoke = processedResult.cleanedJoke;
        setCurrentJoke(finalJoke);
        setJokeHistory(prev => [finalJoke, ...prev.slice(0, 5)]);
        
        // Award XP for generating a joke
        addXp(8);
        updateStats('jokesHeard');
      } else {
        // If strict validation fails, try with more lenient criteria
        if (processedResult.cleanedJoke && 
            processedResult.cleanedJoke.length > 10 && 
            !processedResult.isDuplicate) {
          
          const finalJoke = processedResult.cleanedJoke;
          setCurrentJoke(finalJoke);
          setJokeHistory(prev => [finalJoke, ...prev.slice(0, 5)]);
          
          // Award XP for generating a joke
          addXp(8);
          updateStats('jokesHeard');
        } else {
          setCurrentJoke("Sorry, couldn't generate a unique, culturally relevant joke right now. Please try again!");
        }
      }
    } catch (error) {
      console.error('Error in generateNewJoke:', error);
      setCurrentJoke("Failed to generate joke. Please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const copyJoke = async (joke, index) => {
    try {
      await navigator.clipboard.writeText(joke);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const clearHistory = () => {
    setJokeHistory([]);
    setCurrentJoke('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-60 right-1/3 w-36 h-36 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-tight flex items-center justify-center"
          >
            <Laugh className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mr-3 sm:mr-4" />
            Indian Jokes
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ml-3 sm:ml-4 text-yellow-400" />
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Get your daily dose of culturally relevant Indian humor! Jokes that every Indian can relate to.
          </motion.p>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Select Joke Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedCategory('family')}
                className={`p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === 'family'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white ring-4 ring-green-400/50 shadow-lg shadow-green-500/25'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/30'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <span className="text-lg">Family Friendly</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">
                  School, family, cricket, Bollywood & daily life
                </div>
              </button>
              <button
                onClick={() => setSelectedCategory('spicy')}
                className={`p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === 'spicy'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white ring-4 ring-red-400/50 shadow-lg shadow-red-500/25'
                    : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border border-gray-600/30'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🌶️</span>
                  <span className="text-lg">18+ Jokes</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">
                  Politics, work pressure, relationships & social life
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Joke Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">
                  {selectedCategory === 'family' ? '👨‍👩‍👧‍👦' : '🌶️'}
                </span>
                {selectedCategory === 'family' ? 'Family Joke' : '18+ Joke'}
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  🇮🇳 Indian
                </span>
                <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                  {selectedCategory === 'family' ? 'Clean' : 'Spicy'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-2xl p-6 sm:p-8 min-h-[200px] sm:min-h-[250px] flex items-center justify-center mb-6 border border-gray-700/30">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                      </div>
                      <p className="text-gray-400 text-lg">Crafting an Indian joke...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="joke"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-xl sm:text-2xl text-gray-100 leading-relaxed text-center font-medium"
                  >
                    {currentJoke || "Click 'Generate New Joke' to get started!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={generateNewJoke}
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:via-gray-700 disabled:to-gray-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-3 shadow-lg"
            >
              <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Generating...' : 'Generate New Joke'}
            </button>
          </div>
        </motion.div>

        {/* Joke History */}
        {jokeHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">📚</span>
                Recent Jokes ({jokeHistory.length}/6)
              </h3>
              <button
                onClick={clearHistory}
                className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {jokeHistory.map((joke, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full mr-2">
                          #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          {index === 0 ? 'Just now' : `${index + 1} clicks ago`}
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">{joke}</p>
                    </div>
                    <button
                      onClick={() => copyJoke(joke, index)}
                      className="ml-3 p-2 bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-all duration-200 group relative"
                      title="Copy joke"
                    >
                      <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {copiedIndex === index && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-8 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Jokes;