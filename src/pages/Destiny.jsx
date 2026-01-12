import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Sparkles, Moon, Sun } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Destiny = () => {
  const [activeTab, setActiveTab] = useState('flames');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-purple-900/20 to-gray-950 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Discover Your Destiny
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Unveil the mysteries of your future with ancient wisdom and cosmic guidance
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('flames')}
            className={`flex items-center px-4 md:px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'flames'
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-pink-500/30 ring-2 ring-pink-500/20'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700'
            }`}
          >
            <Heart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="hidden md:inline">FLAMES</span>
            <span className="md:hidden">❤️</span>
          </button>
          <button
            onClick={() => setActiveTab('astrology')}
            className={`flex items-center px-4 md:px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === 'astrology'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/20'
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700'
            }`}
          >
            <Stars className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            <span className="hidden md:inline">Astrology</span>
            <span className="md:hidden">⭐</span>
          </button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-gray-800 shadow-2xl">
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
        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [{
                    role: "user",
                    content: `Write a short, romantic, or funny one-line dedication for a couple named ${name1} and ${name2} who got the result "${outcome}" in the FLAMES game. Max 20 words.`
                }]
            })
        });
        const data = await response.json();
        if (data.content) dedication = data.content;
    } catch (e) {
        console.error("AI Dedication failed", e);
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
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
          ❤️ FLAMES Compatibility Calculator
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          Discover your relationship destiny with the mystical FLAMES algorithm
        </p>
      </div>
      
      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <label className="text-sm font-medium text-gray-300 mb-2 block">Your Name</label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-center text-lg backdrop-blur-sm"
            placeholder="Enter your name..."
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <label className="text-sm font-medium text-gray-300 mb-2 block">Partner's Name</label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-center text-lg backdrop-blur-sm"
            placeholder="Enter partner's name..."
          />
        </motion.div>
      </div>

      {/* Calculate Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={calculateFlames}
          disabled={loading || !name1 || !name2}
          className="px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 rounded-full font-bold text-lg shadow-lg shadow-pink-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="mr-2"
              >
                <Heart className="w-6 h-6 fill-current" />
              </motion.div>
              <span>Calculating Destiny...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Reveal Your Destiny</span>
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
            className={`p-8 rounded-3xl bg-gradient-to-br ${result.color} text-white shadow-2xl backdrop-blur-sm border border-white/10`}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl md:text-6xl font-black mb-4 text-center"
            >
              {result.outcome}
            </motion.div>
            
            <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-white/50 to-white/80 rounded-full"
              />
            </div>
            <p className="text-lg md:text-xl font-serif italic text-center mb-2">
              "{result.dedication}"
            </p>
            <div className="text-sm opacity-80 text-center">
              <span className="inline-block px-3 py-1 bg-white/10 rounded-full">
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
      ? `As a learned Vedic astrologer well-versed in Jyotish Shastra, provide a detailed astrological reading for ${p1}. 

      Use authentic Vedic astrology concepts including:
      - Rashi (Moon sign) characteristics and planetary influences
      - Nakshatra qualities and the ruling deity's blessings
      - Pancha Mahabhuta (five elements) influence
      - Karma and Dharma insights
      - Dasha periods and planetary transits
      - Remedies using mantras, gemstones, or rituals
      
      Focus on:
      • Swabhava (natural temperament) and Prakriti (constitution)
      • Career prospects (Karma Bhava analysis)
      • Relationships and marriage compatibility (7th house insights)
      • Health and longevity (Ayurvedic constitution)
      • Spiritual growth and moksha path
      • Lucky colors, numbers, and directions
      • Favorable days and times
      
      Write in an inspiring, mystical tone using Sanskrit terminology where appropriate. Make it detailed (200-300 words) and include specific Vedic remedies.`
      
      : `As a Vedic astrology expert in Jyotish Shastra, analyze the compatibility between ${p1} and ${p2}.

      Perform a comprehensive Kundali Milan (horoscope matching) covering:
      
      **Ashtakoot Guna Milan (8-fold compatibility):**
      1. Varna (spiritual compatibility)
      2. Vashya (mutual attraction) 
      3. Tara (birth star compatibility)
      4. Yoni (sexual compatibility)
      5. Graha Maitri (planetary friendship)
      6. Gana (temperament matching)
      7. Bhakoot (love and affection)
      8. Nadi (health and progeny)
      
      **Additional Analysis:**
      - Mangal Dosha (Mars affliction) effects
      - Chandra Rashi compatibility 
      - Nakshatra Koota analysis
      - Planetary Dasha compatibility
      - 7th house lord placement
      - Venus and Jupiter influences
      
      **Relationship Insights:**
      • Emotional harmony and understanding
      • Physical and mental compatibility  
      • Financial prosperity together
      • Children and family happiness
      • Spiritual growth as a couple
      • Challenges and remedial measures
      
      Provide specific Vedic remedies like:
      - Mantras for harmony (like "Om Shri Ganeshaya Namaha")
      - Gemstone recommendations
      - Puja and ritual suggestions
      - Favorable muhurat for marriage
      
      Write in traditional Vedic style with Sanskrit terms, making it detailed and authentic (300-400 words).`;

    try {
      console.log('Making Vedic Astrology API call to:', API_URL);
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: vedicPrompt }],
          temperature: 0.8,
          top_p: 0.9
        })
      });

      console.log('Vedic Astrology API Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Vedic Astrology API Error:', errorText);
        throw new Error(`API failed: ${response.status}`);
      }

      const resData = await response.json();
      console.log('Vedic Astrology API Response:', resData);
      
      const reading = resData.content || resData.reading || "The cosmic energies are aligning... Please consult again.";
      setReading(reading);
    } catch (e) {
      console.error('Error in Vedic Astrology API call:', e);
      setReading("The planetary positions are not favorable for consultation at this moment. Please try again when the cosmic energies align better.");
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
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
          🕉️ Vedic Jyotish Consultation
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Ancient wisdom of Bharatiya Jyotish Shastra • Cosmic guidance through Rashi, Nakshatra & Planetary influences
        </p>
        <div className="flex justify-center space-x-4 mt-4 text-xs text-purple-300">
          <span className="px-3 py-1 bg-purple-900/30 rounded-full">🌙 Chandra Rashi</span>
          <span className="px-3 py-1 bg-purple-900/30 rounded-full">⭐ Janma Nakshatra</span>
          <span className="px-3 py-1 bg-purple-900/30 rounded-full">🔮 Kundali Milan</span>
        </div>
      </motion.div>

      {/* Mode Toggle with Vedic Terms */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-8"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-2 border border-gray-700/50">
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('single')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'single' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 mr-2" />
              Vyakti Jyotish (Personal)
            </button>
            <button
              onClick={() => setMode('couple')}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === 'couple' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 mr-2" />
              Kundali Milan (Compatibility)
            </button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Input Forms with Vedic Elements */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Person 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 p-6 bg-gradient-to-br from-purple-900/20 via-indigo-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/30"
        >
          <h3 className="text-purple-300 font-semibold mb-4 flex items-center">
            <Stars className="w-5 h-5 mr-2" />
            {mode === 'couple' ? 'प्रथम व्यक्ति (First Person)' : 'आपकी जानकारी (Your Details)'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">नाम (Name)</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                value={data.name1}
                onChange={e => setData({...data, name1: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">चन्द्र राशि (Chandra Rashi - Moon Sign)</label>
              <select
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                value={data.rashi1}
                onChange={e => setData({...data, rashi1: e.target.value})}
              >
                <option value="">Select your Rashi</option>
                {vedic_rashis.map((rashi, index) => (
                  <option key={index} value={rashi.sanskrit}>
                    {rashi.symbol} {rashi.sanskrit} ({rashi.english}) - {rashi.lord}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">जन्म नक्षत्र (Janma Nakshatra - Birth Star)</label>
              <select
                className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                value={data.nakshatra1}
                onChange={e => setData({...data, nakshatra1: e.target.value})}
              >
                <option value="">Select your Nakshatra</option>
                {nakshatras.map((nakshatra, index) => (
                  <option key={index} value={nakshatra.name}>
                    {nakshatra.name} - {nakshatra.deity} ({nakshatra.nature})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">जन्म तिथि (Birth Date)</label>
                <input
                    type="date"
                    className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                    value={data.dob1 || ''}
                    onChange={e => setData({...data, dob1: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">जन्म समय (Birth Time)</label>
                <input
                    type="time"
                    className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
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
             className="space-y-4 p-6 bg-gradient-to-br from-pink-900/20 via-rose-900/20 to-pink-900/20 backdrop-blur-sm rounded-2xl border border-pink-500/30"
           >
            <h3 className="text-pink-300 font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              द्वितीय व्यक्ति (Partner's Details)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">साथी का नाम (Partner's Name)</label>
                <input
                  type="text"
                  placeholder="Enter partner's name"
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                  value={data.name2}
                  onChange={e => setData({...data, name2: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">चन्द्र राशि (Chandra Rashi)</label>
                <select
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                  value={data.rashi2}
                  onChange={e => setData({...data, rashi2: e.target.value})}
                >
                  <option value="">Select partner's Rashi</option>
                  {vedic_rashis.map((rashi, index) => (
                    <option key={index} value={rashi.sanskrit}>
                      {rashi.symbol} {rashi.sanskrit} ({rashi.english}) - {rashi.lord}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">जन्म नक्षत्र (Janma Nakshatra)</label>
                <select
                  className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                  value={data.nakshatra2}
                  onChange={e => setData({...data, nakshatra2: e.target.value})}
                >
                  <option value="">Select partner's Nakshatra</option>
                  {nakshatras.map((nakshatra, index) => (
                    <option key={index} value={nakshatra.name}>
                      {nakshatra.name} - {nakshatra.deity} ({nakshatra.nature})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">जन्म तिथि (Birth Date)</label>
                  <input
                      type="date"
                      className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
                      value={data.dob2 || ''}
                      onChange={e => setData({...data, dob2: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">जन्म समय (Birth Time)</label>
                  <input
                      type="time"
                      className="w-full bg-gray-800/50 border border-pink-500/30 rounded-xl px-4 py-3 focus:border-pink-400 focus:outline-none transition-all text-lg backdrop-blur-sm"
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
          className="px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 rounded-full font-bold text-lg shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 border border-purple-400/30"
        >
          {loading ? (
            <div className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mr-3"
              >
                🕉️
              </motion.div>
              <span>ज्योतिष परामर्श... (Consulting the Stars)</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              <span>{mode === 'single' ? 'भविष्य जानें (Know Your Destiny)' : 'मिलान करें (Check Compatibility)'}</span>
            </div>
          )}
        </motion.button>
        
        {/* Validation message */}
        {(!data.name1 || !data.rashi1) && (
          <p className="text-sm text-gray-400 mt-2">
            कृपया नाम और राशि भरें (Please fill name and rashi)
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
            className="mt-8 p-8 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-purple-900/40 rounded-3xl border border-purple-400/30 backdrop-blur-sm shadow-2xl"
          >
            {/* Vedic Header */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="text-center mb-8"
            >
              <div className="text-6xl mb-4">🕉️</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                {mode === 'single' ? 'व्यक्तिगत ज्योतिष फल' : 'कुंडली मिलान फल'}
              </h3>
              <p className="text-purple-300 text-sm">
                {mode === 'single' ? 'Personal Astrological Reading' : 'Horoscope Compatibility Analysis'}
              </p>
            </motion.div>
            
            {/* Reading Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <div className="text-purple-100 leading-relaxed whitespace-pre-wrap text-lg">
                {reading}
              </div>
            </div>
            
            {/* Vedic Footer */}
            <div className="mt-8 pt-6 border-t border-purple-400/20 text-center">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-flex items-center space-x-4 px-6 py-3 bg-purple-600/20 rounded-full text-sm font-medium text-purple-200"
              >
                <span>🌟</span>
                <span>सर्वे भवन्तु सुखिनः (May All Be Happy)</span>
                <span>🌟</span>
              </motion.div>
              <p className="text-xs text-purple-400 mt-3">
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
