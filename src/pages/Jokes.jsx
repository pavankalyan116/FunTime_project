import React, { useState, useEffect } from 'react';
import { Laugh, RefreshCw, Shield, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Jokes = () => {
  const [currentJoke, setCurrentJoke] = useState('');
  const [jokeHistory, setJokeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('mixed');

  const generateAIJoke = async (category) => {
    try {
      const categoryPrompts = {
        mixed: "Tell me a random funny joke that's appropriate for all audiences",
        clean: "Tell me a clean, family-friendly joke that's safe for work",
        spicy: "Tell me a slightly edgy adult joke that's still appropriate and clever",
        education: "Tell me a funny joke about school, teachers, students, or education",
        politics: "Tell me a clever political joke that's not offensive to any specific party",
        science: "Tell me a funny science joke about physics, chemistry, biology, or technology",
        entertainment: "Tell me a funny joke about movies, music, TV shows, or entertainment"
      };

      const prompt = categoryPrompts[category] || categoryPrompts.mixed;
      
      // Replace with your actual AI API endpoint
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate joke');
      }

      const data = await response.json();
      const aiJoke = data.choices[0].message.content.trim();
      
      return aiJoke;
    } catch (error) {
      console.error('Error generating joke:', error);
      // Fallback jokes if API fails
      const fallbackJokes = {
        mixed: "Why don't scientists trust atoms? Because they make up everything!",
        clean: "Why did the scarecrow win an award? He was outstanding in his field!",
        spicy: "My dating life is like my WiFi - unstable and I'm not sure who's connected!",
        education: "Teacher: Why is your homework wet? Student: Because you said it was a fluid assignment!",
        politics: "Why don't politicians play hide and seek? Because good luck finding them when you need them!",
        science: "Why did the atom break up with the electron? It had too much negativity!",
        entertainment: "Why don't skeletons like horror movies? They don't have the guts for it!"
      };
      return fallbackJokes[category] || fallbackJokes.mixed;
    }
  };

  const generateRandomJoke = async () => {
    setIsLoading(true);
    
    try {
      const aiJoke = await generateAIJoke(selectedCategory);
      setCurrentJoke(aiJoke);
      setJokeHistory(prev => [aiJoke, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error in generateRandomJoke:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateRandomJoke();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-tight flex items-center justify-center"
          >
            <Laugh className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mr-3 sm:mr-4" />
             Jokes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Get your daily dose of humor from Admin! Choose a category or enjoy mixed jokes. Click next for a new one every time!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Category Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Joke Categories
              </h3>
              <div className="space-y-2">
                {[
                  { value: 'mixed', label: '🎭 Mixed', color: 'bg-purple-600 hover:bg-purple-700' },
                  { value: 'clean', label: '👶 Clean', color: 'bg-green-600 hover:bg-green-700' },
                  { value: 'spicy', label: '🌶️ Spicy', color: 'bg-red-600 hover:bg-red-700' },
                  { value: 'education', label: '📚 Education', color: 'bg-blue-600 hover:bg-blue-700' },
                  { value: 'politics', label: '🏛️ Politics', color: 'bg-orange-600 hover:bg-orange-700' },
                  { value: 'science', label: '🔬 Science', color: 'bg-teal-600 hover:bg-teal-700' },
                  { value: 'entertainment', label: '🎬 Entertainment', color: 'bg-pink-600 hover:bg-pink-700' }
                ].map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === cat.value
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                        : ''
                    } ${cat.color} text-white`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Joke Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 sm:p-6 lg:p-8 border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {selectedCategory === 'mixed' ? "Today's Joke" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Joke`}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    🎭 Admin
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 sm:p-6 min-h-[180px] sm:min-h-[200px] flex items-center justify-center mb-6">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center"
                    >
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-yellow-500"></div>
                      <p className="text-gray-400 mt-4">Admin is telling jokes...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="joke"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-lg text-gray-100 leading-relaxed text-center"
                    >
                      {currentJoke || "Click 'Next Joke' to get started!"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={generateRandomJoke}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Generating...' : 'Next Joke'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Joke History */}
        {jokeHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-lg font-bold text-white mb-4">Recent Jokes</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
              {jokeHistory.map((joke, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-900/50 rounded-lg p-4 text-gray-300 text-sm border border-gray-700/30"
                >
                  <p>{joke}</p>
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
