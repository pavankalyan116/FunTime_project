import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Sparkles, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import LanguageDemo from '../components/LanguageDemo';
import { getText } from '../utils/languageText';

const API_URL = import.meta.env.VITE_API_URL;

const Destiny = () => {
  const [activeTab, setActiveTab] = useState('flames');
  const { language } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-purple-900/20 to-gray-950 p-3 sm:p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-2 sm:px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-3 sm:mb-4">
            Discover Your Destiny
          </h1>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 mb-6">
            Unveil the mysteries of your future with ancient wisdom and cosmic guidance
          </p>
          
          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <LanguageSelector />
          </motion.div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-6 sm:mb-8 px-2">
          <button
            onClick={() => setActiveTab('flames')}
            className={`flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'flames'
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-pink-500/30 ring-2 ring-pink-500/20'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700'
            }`}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">FLAMES</span>
            <span className="sm:hidden">❤️</span>
          </button>
          <button
            onClick={() => setActiveTab('astrology')}
            className={`flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'astrology'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/20'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700'
            }`}
          >
            <Stars className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Astrology</span>
            <span className="sm:hidden">⭐</span>
          </button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-800 shadow-2xl">
          <AnimatePresence mode="wait">
            {activeTab === 'flames' ? <FlamesGame key="flames" /> : <AstrologyReader key="astrology" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const FlamesGame = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getLanguagePrompt } = useLanguage();

  const calculateFlames = async () => {
    if (!name1 || !name2) return;
    setLoading(true);
    setResult(null);

    // Simulation delay for effect
    await new Promise(r => setTimeout(r, 1500));

    const n1 = name1.toLowerCase().replace(/\s/g, '').split('');
    const n2 = name2.toLowerCase().replace(/\s/g, '').split('');

    const common = [];
    n1.forEach((char, index) => {
      const i = n2.indexOf(char);
      if (i > -1) {
        common.push(char);
        n2.splice(i, 1);
        n1[index] = null; // Mark for removal
      }
    });

    const remainingCount = n1.filter(c => c).length + n2.length;
    
    const flames = ['Friends', 'Lovers', 'Affection', 'Marriage', 'Enemy', 'Siblings'];
    const flamesColors = {
      'Friends': 'from-yellow-400 via-orange-500 to-yellow-600',
      'Lovers': 'from-red-500 via-pink-500 to-pink-600',
      'Affection': 'from-pink-400 via-rose-500 to-rose-600',
      'Marriage': 'from-purple-500 via-indigo-500 to-indigo-600',
      'Enemy': 'from-gray-600 via-gray-700 to-gray-800',
      'Siblings': 'from-blue-400 via-cyan-500 to-cyan-600'
    };
    
    // Simple flames logic
    let index = 0;
    const list = [...flames];
    while (list.length > 1) {
      index = (index + remainingCount - 1) % list.length;
      list.splice(index, 1);
    }
    
    const outcome = list[0];
    
    // Generate AI dedication
    let dedication = "A match made in heaven!";
    try {
        const basePrompt = `Write a short, romantic, or funny one-line dedication for a couple named ${name1} and ${name2} who got the result "${outcome}" in the FLAMES game. Max 20 words.`;
        const languageAwarePrompt = getLanguagePrompt(basePrompt, 'dedication');
        
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: languageAwarePrompt
                }]
            })
        });
        const data = await response.json();
        if (data.content) dedication = data.content;
    } catch (e) {
        // Silently fail - dedication is optional
    }

    setResult({
      outcome,
      color: flamesColors[outcome],
      dedication,
      percentage: Math.floor(Math.random() * 40) + 60 // Fake probability for fun
    });
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 text-center"
    >
      {/* Title */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-3 sm:mb-4">
          ❤️ FLAMES Compatibility Calculator
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-md mx-auto px-4">
          Discover your relationship destiny with the mystical FLAMES algorithm
        </p>
      </div>
      
      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 sm:space-y-4"
        >
          <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">Your Name</label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-center text-base sm:text-lg backdrop-blur-sm"
            placeholder="Enter your name..."
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 sm:space-y-4"
        >
          <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">Partner's Name</label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-center text-base sm:text-lg backdrop-blur-sm"
            placeholder="Enter partner's name..."
          />
        </motion.div>
      </div>

      {/* Calculate Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6 sm:mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={calculateFlames}
          disabled={loading || !name1 || !name2}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-600 to-red-600 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-pink-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="mr-2"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              </motion.div>
              <span className="text-sm sm:text-base">Calculating Destiny...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Reveal Your Destiny</span>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Result Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${result.color} text-white shadow-2xl backdrop-blur-sm border border-white/10`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-3 sm:mb-4 text-center"
            >
              {result.outcome}
            </motion.div>
            
            <div className="w-full bg-white/10 rounded-full h-2 sm:h-3 mb-3 sm:mb-4 overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-white/50 to-white/80 rounded-full"
              />
            </div>
            <p className="text-base sm:text-lg md:text-xl font-serif italic text-center mb-2 px-2">
              "{result.dedication}"
            </p>
            <div className="text-xs sm:text-sm opacity-80 text-center">
              <span className="inline-block px-2 sm:px-3 py-1 bg-white/10 rounded-full">
                {result.percentage}% Compatibility
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AstrologyReader = () => {
  const [mode, setMode] = useState('single');
  const [data, setData] = useState({ 
    name1: '', rashi1: '', nakshatra1: '', 
    name2: '', rashi2: '', nakshatra2: '' 
  });
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const { getLanguagePrompt, language } = useLanguage();

  // Vedic Rashis (Moon Signs) with Sanskrit names
  const vedic_rashis = [
    { sanskrit: 'Mesha', english: 'Aries', symbol: '♈', element: 'Agni (Fire)', lord: 'Mangal (Mars)' },
    { sanskrit: 'Vrishabha', english: 'Taurus', symbol: '♉', element: 'Prithvi (Earth)', lord: 'Shukra (Venus)' },
    { sanskrit: 'Mithuna', english: 'Gemini', symbol: '♊', element: 'Vayu (Air)', lord: 'Budh (Mercury)' },
    { sanskrit: 'Karka', english: 'Cancer', symbol: '♋', element: 'Jal (Water)', lord: 'Chandra (Moon)' },
    { sanskrit: 'Simha', english: 'Leo', symbol: '♌', element: 'Agni (Fire)', lord: 'Surya (Sun)' },
    { sanskrit: 'Kanya', english: 'Virgo', symbol: '♍', element: 'Prithvi (Earth)', lord: 'Budh (Mercury)' },
    { sanskrit: 'Tula', english: 'Libra', symbol: '♎', element: 'Vayu (Air)', lord: 'Shukra (Venus)' },
    { sanskrit: 'Vrishchika', english: 'Scorpio', symbol: '♏', element: 'Jal (Water)', lord: 'Mangal (Mars)' },
    { sanskrit: 'Dhanu', english: 'Sagittarius', symbol: '♐', element: 'Agni (Fire)', lord: 'Guru (Jupiter)' },
    { sanskrit: 'Makara', english: 'Capricorn', symbol: '♑', element: 'Prithvi (Earth)', lord: 'Shani (Saturn)' },
    { sanskrit: 'Kumbha', english: 'Aquarius', symbol: '♒', element: 'Vayu (Air)', lord: 'Shani (Saturn)' },
    { sanskrit: 'Meena', english: 'Pisces', symbol: '♓', element: 'Jal (Water)', lord: 'Guru (Jupiter)' }
  ];

  // 27 Nakshatras with their ruling deities and characteristics
  const nakshatras = [
    { name: 'Ashwini', deity: 'Ashwini Kumaras', nature: 'Swift, Healing', pada: 4 },
    { name: 'Bharani', deity: 'Yama', nature: 'Transformation, Restraint', pada: 4 },
    { name: 'Krittika', deity: 'Agni', nature: 'Purification, Sharp', pada: 4 },
    { name: 'Rohini', deity: 'Brahma', nature: 'Growth, Beauty', pada: 4 },
    { name: 'Mrigashira', deity: 'Soma', nature: 'Searching, Gentle', pada: 4 },
    { name: 'Ardra', deity: 'Rudra', nature: 'Destruction, Renewal', pada: 4 },
    { name: 'Punarvasu', deity: 'Aditi', nature: 'Renewal, Motherly', pada: 4 },
    { name: 'Pushya', deity: 'Brihaspati', nature: 'Nourishment, Spiritual', pada: 4 },
    { name: 'Ashlesha', deity: 'Nagas', nature: 'Mystical, Coiling', pada: 4 },
    { name: 'Magha', deity: 'Pitrs', nature: 'Ancestral, Royal', pada: 4 },
    { name: 'Purva Phalguni', deity: 'Bhaga', nature: 'Enjoyment, Creative', pada: 4 },
    { name: 'Uttara Phalguni', deity: 'Aryaman', nature: 'Partnership, Generous', pada: 4 },
    { name: 'Hasta', deity: 'Savitar', nature: 'Skillful, Crafty', pada: 4 },
    { name: 'Chitra', deity: 'Tvashtar', nature: 'Artistic, Brilliant', pada: 4 },
    { name: 'Swati', deity: 'Vayu', nature: 'Independent, Flexible', pada: 4 },
    { name: 'Vishakha', deity: 'Indra-Agni', nature: 'Determined, Forked', pada: 4 },
    { name: 'Anuradha', deity: 'Mitra', nature: 'Friendship, Devotion', pada: 4 },
    { name: 'Jyeshtha', deity: 'Indra', nature: 'Eldest, Protective', pada: 4 },
    { name: 'Mula', deity: 'Nirriti', nature: 'Root, Destruction', pada: 4 },
    { name: 'Purva Ashadha', deity: 'Apas', nature: 'Invincible, Purifying', pada: 4 },
    { name: 'Uttara Ashadha', deity: 'Vishvedevas', nature: 'Victory, Universal', pada: 4 },
    { name: 'Shravana', deity: 'Vishnu', nature: 'Learning, Listening', pada: 4 },
    { name: 'Dhanishtha', deity: 'Vasus', nature: 'Wealthy, Musical', pada: 4 },
    { name: 'Shatabhisha', deity: 'Varuna', nature: 'Healing, Mysterious', pada: 4 },
    { name: 'Purva Bhadrapada', deity: 'Aja Ekapada', nature: 'Passionate, Transformative', pada: 4 },
    { name: 'Uttara Bhadrapada', deity: 'Ahir Budhnya', nature: 'Deep, Mystical', pada: 4 },
    { name: 'Revati', deity: 'Pushan', nature: 'Nourishing, Protective', pada: 4 }
  ];

  const getVedicReading = async () => {
    setLoading(true);
    setReading('');
    
    const formatVedicData = (name, rashi, nakshatra, dob, time) => {
        let info = `${name}`;
        if (rashi) {
          const rashiData = vedic_rashis.find(r => r.sanskrit === rashi || r.english === rashi);
          if (rashiData) {
            info += ` with Chandra (Moon) in ${rashiData.sanskrit} Rashi (${rashiData.english}), ruled by ${rashiData.lord}`;
          }
        }
        if (nakshatra) {
          const nakshatraData = nakshatras.find(n => n.name === nakshatra);
          if (nakshatraData) {
            info += ` and Janma Nakshatra ${nakshatra}, blessed by ${nakshatraData.deity}`;
          }
        }
        if (dob) info += ` born on ${dob}`;
        if (time) info += ` at ${time}`;
        return info;
    };

    const p1 = formatVedicData(data.name1, data.rashi1, data.nakshatra1, data.dob1, data.time1);
    const p2 = formatVedicData(data.name2, data.rashi2, data.nakshatra2, data.dob2, data.time2);

    const vedicPrompt = mode === 'single'
      ? `As a learned Vedic astrologer and master of Jyotish Shastra, provide a mystical and detailed astrological reading for ${p1}. 

      BE CREATIVE WITH FORMAT - Choose one approach:
      1. NARRATIVE STYLE: "In the cosmic dance of planets, your soul's journey reveals..."
      2. DIALOGUE STYLE: "The ancient rishis whisper: 'This soul carries the blessing of...'"
      3. POETIC STYLE: "Like a lotus blooming in celestial waters, your destiny unfolds..."
      4. PROPHETIC STYLE: "The stars have written your story across the cosmic canvas..."
      5. CONVERSATIONAL STYLE: "Let me tell you what the planets revealed about your path..."

      Use authentic Vedic astrology concepts creatively:
      - Rashi (Moon sign) characteristics and planetary influences
      - Nakshatra qualities and the ruling deity's blessings
      - Pancha Mahabhuta (five elements) influence
      - Karma and Dharma insights from past lives
      - Dasha periods and cosmic timing
      - Sacred remedies and spiritual practices

      CREATIVE SECTIONS TO INCLUDE:
      • Soul Purpose: Your dharmic path in this lifetime
      • Cosmic Gifts: Natural talents blessed by the planets
      • Life Challenges: Karmic lessons to master
      • Career Destiny: Professional path written in stars
      • Love & Relationships: Heart's journey through cosmic connections
      • Health & Vitality: Ayurvedic constitution and wellness
      • Spiritual Evolution: Path to moksha and enlightenment
      • Divine Timing: Favorable periods and cosmic windows
      • Sacred Remedies: Mantras, gems, and rituals for harmony

      CREATIVE ELEMENTS:
      - Use Sanskrit terms poetically
      - Include mystical imagery and metaphors
      - Reference ancient wisdom and cosmic principles
      - Make it personal and deeply meaningful
      - Write 250-350 words with inspiring, mystical tone`
      
      : `As a master of Vedic Jyotish and cosmic compatibility, analyze the soul connection between ${p1} and ${p2}.

      BE CREATIVE WITH FORMAT - Choose one approach:
      1. COSMIC LOVE STORY: "In the tapestry of time, two souls were destined to meet..."
      2. DIVINE DIALOGUE: "The cosmic forces speak of this union..."
      3. MYSTICAL ANALYSIS: "Through the lens of ancient wisdom, this partnership reveals..."
      4. PROPHETIC VISION: "The stars foretell a journey of two hearts..."
      5. SACRED CONSULTATION: "Let the ancient rishis guide this sacred union..."

      **Enhanced Ashtakoot Guna Milan with Creative Insights:**
      1. Varna (spiritual harmony) - "Your souls dance in similar frequencies..."
      2. Vashya (magnetic attraction) - "The cosmic pull between your energies..."
      3. Tara (stellar blessings) - "Your birth stars sing in harmony..."
      4. Yoni (intimate connection) - "The sacred union of complementary forces..."
      5. Graha Maitri (planetary friendship) - "Your ruling planets embrace..."
      6. Gana (temperamental balance) - "Your natures create perfect equilibrium..."
      7. Bhakoot (love's flowering) - "Affection blooms like sacred lotus..."
      8. Nadi (life force compatibility) - "Your pranas merge in cosmic rhythm..."

      CREATIVE COMPATIBILITY SECTIONS:
      • Cosmic Chemistry: How your energies dance together
      • Soul Recognition: Past life connections and karmic bonds
      • Love Languages: How planets influence your affection
      • Growth Together: Spiritual evolution as a couple
      • Life Challenges: Obstacles that strengthen your bond
      • Divine Timing: Best periods for major decisions
      • Sacred Rituals: Ceremonies to enhance harmony
      • Future Vision: Your destiny as cosmic partners

      MYSTICAL REMEDIES:
      - Couple mantras for harmony ("Om Shri Radha Krishnaya Namaha")
      - Gemstone combinations for love and understanding
      - Sacred timing for marriage and important decisions
      - Vedic rituals to strengthen the cosmic bond

      Write 300-450 words in mystical, romantic Vedic style with Sanskrit wisdom.`;

    const languageAwarePrompt = getLanguagePrompt(vedicPrompt, 'astrology');

    try {

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: languageAwarePrompt }],
          temperature: 0.8,
          top_p: 0.9
        })
      });


      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API failed: ${response.status}`);
      }

      const resData = await response.json();

      const reading = resData.content || resData.reading || "The cosmic energies are aligning... Please consult again.";
      setReading(reading);
    } catch (e) {
      setReading("Unable to generate reading. Please check your internet connection and try again.");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Enhanced Header with Vedic Elements */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
          🕉️ Vedic Jyotish Consultation
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-4 mb-4">
          Ancient wisdom of Bharatiya Jyotish Shastra • Cosmic guidance through Rashi, Nakshatra & Planetary influences
        </p>
        
        {/* Language Selector for Astrology Results */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-purple-900/30 rounded-full p-2">
            <LanguageSelector />
          </div>
        </motion.div>
        
        {/* Language Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md mx-auto mb-4"
        >
          <LanguageDemo category="astrology" />
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-3 sm:mt-4 text-xs text-purple-300">
          <span className="px-2 sm:px-3 py-1 bg-purple-900/30 rounded-full">🌙 Chandra Rashi</span>
          <span className="px-2 sm:px-3 py-1 bg-purple-900/30 rounded-full">⭐ Janma Nakshatra</span>
          <span className="px-2 sm:px-3 py-1 bg-purple-900/30 rounded-full">🔮 Kundali Milan</span>
        </div>
      </motion.div>

      {/* Mode Toggle with Vedic Terms */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6 sm:mb-8 px-2"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 sm:p-2 border border-gray-700/50">
          <div className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                mode === 'single' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Vyakti Jyotish (Personal)</span>
              <span className="sm:hidden">Personal</span>
            </button>
            <button
              onClick={() => setMode('couple')}
              className={`flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                mode === 'couple' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Kundali Milan (Compatibility)</span>
              <span className="sm:hidden">Compatibility</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Input Forms with Vedic Elements */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Person 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30"
        >
          <h3 className="text-purple-300 font-semibold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
            <Stars className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {mode === 'couple' ? getText('yourDetails', language) : getText('yourDetails', language)}
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('name', language)}</label>
              <input
                type="text"
                placeholder={getText('namePlaceholderAstro', language)}
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-purple-400 focus:outline-none transition-all text-base sm:text-lg backdrop-blur-sm"
                value={data.name1}
                onChange={e => setData({...data, name1: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('moonSign', language)}</label>
              <select
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-purple-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                value={data.rashi1}
                onChange={e => setData({...data, rashi1: e.target.value})}
              >
                <option value="">{getText('selectRashi', language)}</option>
                {vedic_rashis.map((rashi, index) => (
                  <option key={index} value={rashi.sanskrit}>
                    {rashi.symbol} {rashi.sanskrit} ({rashi.english}) - {rashi.lord}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('birthStar', language)}</label>
              <select
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-purple-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                value={data.nakshatra1}
                onChange={e => setData({...data, nakshatra1: e.target.value})}
              >
                <option value="">{getText('selectNakshatra', language)}</option>
                {nakshatras.map((nakshatra, index) => (
                  <option key={index} value={nakshatra.name}>
                    {nakshatra.name} - {nakshatra.deity} ({nakshatra.nature})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('birthDate', language)}</label>
                <input
                    type="date"
                    className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-2 sm:px-4 py-2 sm:py-3 focus:border-purple-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                    value={data.dob1 || ''}
                    onChange={e => setData({...data, dob1: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('birthTime', language)}</label>
                <input
                    type="time"
                    className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-2 sm:px-4 py-2 sm:py-3 focus:border-purple-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                    value={data.time1 || ''}
                    onChange={e => setData({...data, time1: e.target.value})}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Person 2 - Only for couple mode */}
        {mode === 'couple' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-gradient-to-br from-pink-900/20 via-rose-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl border border-pink-500/30"
           >
            <h3 className="text-pink-300 font-semibold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              {getText('partnerDetails', language)}
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('partnerName', language)}</label>
                <input
                  type="text"
                  placeholder={getText('partnerNamePlaceholder', language)}
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-pink-400 focus:outline-none transition-all text-base sm:text-lg backdrop-blur-sm"
                  value={data.name2}
                  onChange={e => setData({...data, name2: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('moonSign', language)}</label>
                <select
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-pink-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                  value={data.rashi2}
                  onChange={e => setData({...data, rashi2: e.target.value})}
                >
                  <option value="">{getText('selectPartnerRashi', language)}</option>
                  {vedic_rashis.map((rashi, index) => (
                    <option key={index} value={rashi.sanskrit}>
                      {rashi.symbol} {rashi.sanskrit} ({rashi.english}) - {rashi.lord}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('birthStar', language)}</label>
                <select
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:border-pink-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                  value={data.nakshatra2}
                  onChange={e => setData({...data, nakshatra2: e.target.value})}
                >
                  <option value="">{getText('selectPartnerNakshatra', language)}</option>
                  {nakshatras.map((nakshatra, index) => (
                    <option key={index} value={nakshatra.name}>
                      {nakshatra.name} - {nakshatra.deity} ({nakshatra.nature})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('birthDate', language)}</label>
                  <input
                      type="date"
                      className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-2 sm:px-4 py-2 sm:py-3 focus:border-pink-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                      value={data.dob2 || ''}
                      onChange={e => setData({...data, dob2: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-300 mb-2 block">{getText('birthTime', language)}</label>
                  <input
                      type="time"
                      className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-2 sm:px-4 py-2 sm:py-3 focus:border-pink-400 focus:outline-none transition-all text-sm sm:text-base backdrop-blur-sm"
                      value={data.time2 || ''}
                      onChange={e => setData({...data, time2: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Reveal Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getVedicReading}
          disabled={loading || !data.name1 || !data.rashi1}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-full font-bold text-base sm:text-lg shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 border border-purple-400/30"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mr-2 sm:mr-3"
              >
                🕉️
              </motion.div>
              <span className="text-sm sm:text-base">{getText('consulting', language)}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">{mode === 'single' ? getText('knowDestiny', language) : getText('checkCompatibility', language)}</span>
            </div>
          )}
        </motion.button>
        
        {/* Validation message */}
        {(!data.name1 || !data.rashi1) && (
          <p className="text-xs sm:text-sm text-gray-400 mt-2 px-4">
            {getText('fillRequired', language)}
          </p>
        )}
      </motion.div>

      {/* Enhanced Reading Display with Vedic Styling */}
      <AnimatePresence>
        {reading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-purple-900/40 rounded-3xl border border-purple-400/30 backdrop-blur-sm shadow-2xl"
          >
            {/* Vedic Header */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-center mb-6 sm:mb-8"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">🕉️</div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                {mode === 'single' ? 'व्यक्तिगत ज्योतिष फल' : 'कुंडली मिलान फल'}
              </h3>
              <p className="text-purple-300 text-xs sm:text-sm">
                {mode === 'single' ? 'Personal Astrological Reading' : 'Horoscope Compatibility Analysis'}
              </p>
            </motion.div>
            
            {/* Reading Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-purple-100 leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg">
                {reading}
              </div>
            </div>
            
            {/* Vedic Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-purple-400/20 text-center">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-flex items-center space-x-2 sm:space-x-4 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600/20 rounded-full text-xs sm:text-sm font-medium text-purple-200"
              >
                <span>🌟</span>
                <span>सर्वे भवन्तु सुखिनः (May All Be Happy)</span>
                <span>🌟</span>
              </motion.div>
              <p className="text-xs text-purple-400 mt-2 sm:mt-3 px-4">
                Based on ancient Vedic Jyotish principles • For entertainment and guidance purposes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Destiny;
