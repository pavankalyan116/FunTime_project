import { useState, useEffect } from 'react';
import { Laugh, RefreshCw, Copy, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import LanguageDemo from '../components/LanguageDemo';
import { getText } from '../utils/languageText';
import { secureApiCall, API_ENDPOINTS, rateLimiter, RATE_LIMITS, checkApiHealth } from '../config/api.js';

const Jokes = () => {
  const { addXp, updateStats } = useGame();
  const { language } = useLanguage();
  
  const [currentJoke, setCurrentJoke] = useState('');
  const [jokeHistory, setJokeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('family');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'online', 'offline'

  // Auto-adjust font size based on joke length
  const getJokeFontSize = (joke) => {
    if (!joke) return 'text-xl sm:text-2xl';
    
    const length = joke.length;
    if (length <= 100) return 'text-2xl sm:text-3xl lg:text-4xl'; // Short jokes - larger font
    if (length <= 200) return 'text-xl sm:text-2xl lg:text-3xl'; // Medium jokes
    if (length <= 350) return 'text-lg sm:text-xl lg:text-2xl'; // Long jokes
    return 'text-base sm:text-lg lg:text-xl'; // Very long jokes - smaller font
  };

  // Check API status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isHealthy = await checkApiHealth();
        setApiStatus(isHealthy ? 'online' : 'offline');
      } catch (error) {
        setApiStatus('offline');
      }
    };
    
    checkStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateAIJoke = async (category) => {
    // Only block API calls during SSR
    if (typeof window === 'undefined') {
      throw new Error('API not available during SSR');
    }
    
    // Check rate limiting
    if (!rateLimiter.isAllowed(API_ENDPOINTS.CHAT, RATE_LIMITS.JOKES_PER_MINUTE)) {
      throw new Error('Rate limit exceeded. Please wait before requesting another joke.');
    }
    
    try {
      // Create language-specific prompt
      let prompt = `Generate a funny Indian ${category} joke`;
      
      if (language === 'teglish') {
        prompt = `Generate a funny Indian ${category} joke in Teglish (Telugu-English mix). Use MAXIMUM Telugu words and expressions. Be creative with the format:

FORMAT OPTIONS (choose one randomly):
1. Conversation between two people:
   Person A: "Enti bro, office lo promotion vachinda?"
   Person B: "Ledu ra, boss ki Telugu raadu ani cheppanu!"

2. Story format:
   "Oka roju oka Telugu guy interview ki velladu. HR person adigindi..."

3. Question-Answer format:
   "Telugu people enduku biryani ni antha istam padutaru? Endukante..."

4. Character-based (like Raju, Ramesh, Sita, etc.):
   "Raju garu epudu antaru..."

5. Situation comedy:
   "Telugu parents valla pillala friends ni meet chestunte..."

ENHANCED LANGUAGE MIXING RULES (USE MORE TELUGU):
- Use 70% Telugu and 30% English (heavily favor Telugu)
- Telugu words to use frequently: enti, enduku, ela, epudu, ekkada, evaru, emi, ledu, vachindi, cheppanu, antaru, chestunte, padutaru, istam, bagundi, manchidi, etc.
- Telugu expressions: "arre yaar", "aiyo rama", "baboi", "abbo", "ayya", "amma", "anna", "akka"
- Telugu grammar patterns: "chestunte", "antunna", "vellipoyindi", "vachesindi", "chustunte"
- Use English only for: modern tech terms, office words, brand names
- Telugu sentence structures: "Enti ra idi?", "Ela unnav?", "Enduku late?", "Bagundi kada?"

CONTENT THEMES for ${category}:
${category === 'family' ? 
  '- Family situations, school/college life, food, festivals, movies, cricket, technology' :
  '- Adult relationships, workplace drama, dating struggles, marriage humor, social drinking, mild profanity, sexual innuendos, adult life problems, mature social situations'
}

LANGUAGE GUIDELINES for ${category}:
${category === 'family' ? 
  '- Keep it completely clean and appropriate for all ages' :
  '- You can use mild bad words like "damn", "hell", "crap", "shit" when appropriate\n- Include adult themes like relationships, intimacy (tastefully), drinking, adult responsibilities\n- Use mature humor about dating, marriage, work stress, adult life struggles\n- Keep it spicy but not vulgar or offensive'
}

Make it sound like authentic Telugu conversation with heavy Telugu usage. Return ONLY the joke text.`;
      } else if (language === 'higlish') {
        prompt = `Generate a funny Indian ${category} joke in Higlish (Hindi-English mix). Use MAXIMUM Hindi words and expressions. Be creative with the format:

FORMAT OPTIONS (choose one randomly):
1. Conversation between two friends:
   Rahul: "Yaar, tere ghar mein WiFi password kya hai?"
   Amit: "Bhai, 'mummykaphone123' - kyunki mummy hamesha bhool jaati hai!"

2. Story format:
   "Ek baar ek Delhi wala Bangalore gaya. Wahan auto driver se bola..."

3. Question-Answer format:
   "Indian parents ko WhatsApp forwards kyun itna pasand hai? Kyunki..."

4. Character-based (like Sharma ji, Gupta aunty, etc.):
   "Sharma ji ka beta hamesha kehta hai..."

5. Situation comedy:
   "Jab Indian family restaurant mein jaati hai..."

ENHANCED LANGUAGE MIXING RULES (USE MORE HINDI):
- Use 70% Hindi and 30% English (heavily favor Hindi)
- Hindi words to use frequently: kyunki, lekin, phir, kya, kaise, kahan, kab, kaun, kuch, sab, hamesha, kabhi, bilkul, bahut, etc.
- Hindi expressions: "arre yaar", "hai na", "kya baat hai", "sach mein", "are bhai", "yaar", "boss", "dude"
- Hindi grammar patterns: "kar raha hai", "ho gaya", "aa gaya", "ja raha hai", "dekh raha hai"
- Use English only for: modern tech terms, office words, brand names
- Hindi sentence structures: "Kya baat hai?", "Kaise ho?", "Kyun late?", "Accha hai na?"

CONTENT THEMES for ${category}:
${category === 'family' ? 
  '- Family situations, school life, food, festivals, Bollywood, cricket, technology' :
  '- Adult relationships, office politics, dating disasters, marriage comedy, drinking stories, mild profanity, sexual humor (tasteful), adult life struggles, mature social situations'
}

LANGUAGE GUIDELINES for ${category}:
${category === 'family' ? 
  '- Keep it completely clean and appropriate for all ages' :
  '- You can use mild bad words like "damn", "hell", "crap", "shit" when appropriate\n- Include adult themes like relationships, intimacy (tastefully), drinking, adult responsibilities\n- Use mature humor about dating, marriage, work stress, adult life struggles\n- Keep it spicy but not vulgar or offensive'
}

Make it sound like authentic Hindi conversation with heavy Hindi usage. Return ONLY the joke text.`;
      } else {
        prompt = `Generate a funny Indian ${category} joke in English. Be creative with the format:

FORMAT OPTIONS (choose one randomly):
1. Conversation between characters:
   "Mom: 'Beta, why are you always on your phone?'
   Son: 'I'm learning, Mom!'
   Mom: 'Learning what?'
   Son: 'How to avoid your calls!'"

2. Story format:
   "An Indian student went to America for higher studies. On his first day..."

3. Question-Answer format:
   "Why don't Indian parents trust GPS? Because..."

4. Character-based scenarios:
   "Every Indian mom thinks her cooking is..."

5. Observational humor:
   "You know you're Indian when..."

CONTENT THEMES for ${category}:
${category === 'family' ? 
  '- Family dynamics, education, food culture, festivals, technology, generational gaps' :
  '- Adult relationships, workplace drama, dating life, marriage humor, drinking culture, mature social situations, adult responsibilities, relationship struggles, sexual humor (tasteful)'
}

LANGUAGE GUIDELINES for ${category}:
${category === 'family' ? 
  '- Keep it completely clean and appropriate for all ages' :
  '- You can use mild profanity like "damn", "hell", "crap", "shit" when it adds to the humor\n- Include adult themes like dating disasters, marriage problems, work stress, drinking stories\n- Use mature humor about relationships, intimacy (tastefully), adult life struggles\n- Keep it edgy and spicy but not offensive or vulgar'
}

Make it relatable to Indian culture and genuinely funny. Return ONLY the joke text.`;
      }
      
      const response = await secureApiCall(API_ENDPOINTS.CHAT, {
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.9,
          top_p: 0.9
        })
      });

      const data = await response.json();
      
      let aiJoke = data.content || '';
      
      if (!aiJoke || aiJoke.length < 10) {
        throw new Error('Invalid joke response from API');
      }
      
      // Clean the response
      aiJoke = aiJoke
        .replace(/^here'?s[^:]*:?\s*/i, '')
        .replace(/^here\s+is[^:]*:?\s*/i, '')
        .replace(/^\s*(joke|answer|setup|punchline|response|output|result)\s*:?\s*/i, '')
        .replace(/^(sure|okay|alright|certainly|absolutely)[^:]*:?\s*/i, '')
        .replace(/^["'`\s]+|["'`\s]+$/g, '')
        .replace(/^\*\*|^\*|\*\*$|\*$/g, '')
        .replace(/^\s*[-•*]+\s*/, '')
        .replace(/^\s*\d+\.\s*/, '')
        .replace(/\s*\n\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      return aiJoke;
    } catch (error) {
      throw error;
    }
  };

  const generateNewJoke = async () => {
    setIsLoading(true);
    
    try {
      // First check if API is available
      const isApiHealthy = await checkApiHealth();
      if (!isApiHealthy) {
        throw new Error('API service is currently unavailable. Please try again later.');
      }
      
      const aiJoke = await generateAIJoke(selectedCategory);
      
      // Check for duplicates
      const isDuplicate = jokeHistory.some(historyJoke => {
        const normalizeJoke = (joke) => {
          return joke.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
        };
        return normalizeJoke(aiJoke) === normalizeJoke(historyJoke);
      });
      
      if (isDuplicate) {
        // Try one more time for a different joke
        const retryJoke = await generateAIJoke(selectedCategory);
        const isRetryDuplicate = jokeHistory.some(historyJoke => {
          const normalizeJoke = (joke) => {
            return joke.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
          };
          return normalizeJoke(retryJoke) === normalizeJoke(historyJoke);
        });
        
        if (!isRetryDuplicate) {
          setCurrentJoke(retryJoke);
          setJokeHistory(prev => [retryJoke, ...prev.slice(0, 5)]);
          addXp(8);
          updateStats('jokesHeard');
        } else {
          // If still duplicate, show the original joke anyway
          setCurrentJoke(aiJoke);
          setJokeHistory(prev => [aiJoke, ...prev.slice(0, 5)]);
          addXp(8);
          updateStats('jokesHeard');
        }
      } else {
        setCurrentJoke(aiJoke);
        setJokeHistory(prev => [aiJoke, ...prev.slice(0, 5)]);
        addXp(8);
        updateStats('jokesHeard');
      }
    } catch (error) {
      // Show specific error messages based on the type of error
      let errorMessage = 'Unable to generate joke. Please try again.';
      
      if (error.message.includes('Rate limit')) {
        errorMessage = 'Please wait a moment before requesting another joke.';
      } else if (error.message.includes('API service is currently unavailable')) {
        errorMessage = 'Joke service is temporarily unavailable. Please try again in a few minutes.';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Please check your internet connection and try again.';
      }
      
      setCurrentJoke(errorMessage);
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
      // Silently fail - copying is not critical functionality
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
            {getText('jokesTitle', language)}
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ml-3 sm:ml-4 text-yellow-400" />
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light mb-6"
          >
            {getText('jokesSubtitle', language)}
          </motion.p>
          
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
            <LanguageDemo category="jokes" />
          </motion.div>
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
                  <span className="text-lg">{getText('familyFriendly', language)}</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">
                  {getText('familyDesc', language)}
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
                  <span className="text-lg">{getText('spicyJokes', language)}</span>
                </div>
                <div className="text-xs text-gray-300 mt-2">
                  {getText('spicyDesc', language)}
                </div>
                <div className="text-xs text-red-400 mt-1 font-medium">
                  ⚠️ Contains mild profanity & adult themes
                </div>
                <div className="text-xs text-gray-400 mt-1 italic">
                  Examples: Dating disasters, work stress, relationship humor
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
                  {selectedCategory === 'family' ? '👨‍👩‍👧‍�' : '🌶️'}
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
                <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${
                  apiStatus === 'online' ? 'bg-green-500/20 text-green-400' :
                  apiStatus === 'offline' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    apiStatus === 'online' ? 'bg-green-400' :
                    apiStatus === 'offline' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`}></div>
                  <span>
                    {apiStatus === 'online' ? 'Online' :
                     apiStatus === 'offline' ? 'Offline' :
                     'Checking...'}
                  </span>
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
                    className={`text-gray-100 leading-relaxed text-center font-medium ${getJokeFontSize(currentJoke)}`}
                  >
                    {currentJoke || "Click 'Generate New Joke' to get started!"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={generateNewJoke}
              disabled={isLoading || apiStatus === 'offline'}
              className={`w-full px-8 py-4 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center space-x-3 shadow-lg ${
                apiStatus === 'offline' 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : isLoading
                    ? 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800'
                    : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600'
              }`}
            >
              <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
              {apiStatus === 'offline' 
                ? 'Service Unavailable' 
                : isLoading 
                  ? getText('generating', language) 
                  : getText('generateJoke', language)
              }
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