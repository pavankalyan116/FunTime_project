import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Calculator, Send, Sparkles, Moon, Sun } from 'lucide-react';

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
  const [data, setData] = useState({ name1: '', sign1: '', name2: '', sign2: '' });
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);

  const getReading = async () => {
    setLoading(true);
    setReading('');
    
    const formatData = (name, sign, dob, time) => {
        let info = name;
        if (sign) info += ` (${sign})`;
        if (dob) info += ` born on ${dob}`;
        if (time) info += ` at ${time}`;
        return info;
    };

    const p1 = formatData(data.name1, data.sign1, data.dob1, data.time1);
    const p2 = formatData(data.name2, data.sign2, data.dob2, data.time2);

    const prompt = mode === 'single'
      ? `Give a fun, mystical astrology reading for ${p1}. Focus on love, luck, and destiny. Make it inspiring and detailed.`
      : `Give a relationship compatibility reading for ${p1} and ${p2}. Be witty and insightful about their cosmic connection.`;

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });
      const resData = await response.json();
      setReading(resData.content || "The stars are aligning in mysterious ways...");
    } catch (e) {
      setReading("Failed to consult the stars. Try again later.");
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Mode Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-6"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-700/50">
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="mode"
              checked={mode === 'single'}
              onChange={() => setMode('single')}
              className="form-radio text-purple-600"
            />
            <div className="flex items-center">
              <Moon className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm font-medium">Personal Reading</span>
            </div>
          </label>
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="radio"
              name="mode"
              checked={mode === 'couple'}
              onChange={() => setMode('couple')}
              className="form-radio text-purple-600"
            />
            <div className="flex items-center">
              <Sun className="w-4 h-4 mr-2 text-purple-400" />
              <span className="text-sm font-medium">Couple Compatibility</span>
            </div>
          </label>
        </div>
      </motion.div>

      {/* Input Forms */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Person 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50"
        >
          <h3 className="text-purple-400 font-semibold mb-4 flex items-center">
            <Stars className="w-5 h-5 mr-2" />
            {mode === 'couple' ? 'Your Details' : 'Your Details'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                value={data.name1}
                onChange={e => setData({...data, name1: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Zodiac Sign</label>
              <select
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                value={data.sign1}
                onChange={e => setData({...data, sign1: e.target.value})}
              >
                <option value="">Select your sign</option>
                <option value="Aries">♈ Aries (Mar 21 - Apr 19)</option>
                <option value="Taurus">♉ Taurus (Apr 20 - May 20)</option>
                <option value="Gemini">♊ Gemini (May 21 - Jun 20)</option>
                <option value="Cancer">♋ Cancer (Jun 21 - Jul 22)</option>
                <option value="Leo">♌ Leo (Jul 23 - Aug 22)</option>
                <option value="Virgo">♍ Virgo (Aug 23 - Sep 22)</option>
                <option value="Libra">♎ Libra (Sep 23 - Oct 22)</option>
                <option value="Scorpio">♏ Scorpio (Oct 23 - Nov 21)</option>
                <option value="Sagittarius">♐ Sagittarius (Nov 22 - Dec 21)</option>
                <option value="Capricorn">♑ Capricorn (Dec 22 - Jan 19)</option>
                <option value="Aquarius">♒ Aquarius (Jan 20 - Feb 18)</option>
                <option value="Pisces">♓ Pisces (Feb 19 - Mar 20)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Date of Birth</label>
                <input
                    type="date"
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                    value={data.dob1 || ''}
                    onChange={e => setData({...data, dob1: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Birth Time</label>
                <input
                    type="time"
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                    value={data.time1 || ''}
                    onChange={e => setData({...data, time1: e.target.value})}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Person 2 */}
        {mode === 'couple' && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-4 p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50"
           >
            <h3 className="text-purple-400 font-semibold mb-4 flex items-center">
              <Stars className="w-5 h-5 mr-2" />
              Partner's Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Partner's Name</label>
                <input
                  type="text"
                  placeholder="Enter partner's name"
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                  value={data.name2}
                  onChange={e => setData({...data, name2: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Partner's Zodiac Sign</label>
                <select
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                  value={data.sign2}
                  onChange={e => setData({...data, sign2: e.target.value})}
                >
                  <option value="">Select partner's sign</option>
                  <option value="Aries">♈ Aries</option>
                  <option value="Taurus">♉ Taurus</option>
                  <option value="Gemini">♊ Gemini</option>
                  <option value="Cancer">♋ Cancer</option>
                  <option value="Leo">♌ Leo</option>
                  <option value="Virgo">♍ Virgo</option>
                  <option value="Libra">♎ Libra</option>
                  <option value="Scorpio">♏ Scorpio</option>
                  <option value="Sagittarius">♐ Sagittarius</option>
                  <option value="Capricorn">♑ Capricorn</option>
                  <option value="Aquarius">♒ Aquarius</option>
                  <option value="Pisces">♓ Pisces</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Date of Birth</label>
                  <input
                      type="date"
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                      value={data.dob2 || ''}
                      onChange={e => setData({...data, dob2: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Birth Time</label>
                  <input
                      type="time"
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none transition-all text-lg backdrop-blur-sm"
                      value={data.time2 || ''}
                      onChange={e => setData({...data, time2: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reveal Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getReading}
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold text-lg shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="mr-2"
              >
                <Stars className="w-6 h-6 fill-current" />
              </motion.div>
              <span>Consulting the Cosmos...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Reveal Your Destiny</span>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Reading Display */}
      <AnimatePresence>
        {reading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-8 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-purple-900/80 rounded-2xl border border-purple-500/30 text-purple-100 leading-relaxed backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-yellow-400 mb-6 text-center"
            >
              <Stars className="w-12 h-12 mx-auto mb-4" />
            </motion.div>
            
            <div className="prose prose prose-invert max-w-none">
              <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
                {reading}
              </p>
            </div>
            
            <div className="mt-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block px-4 py-2 bg-purple-600/20 rounded-full text-sm font-medium"
              >
                ✨ Cosmic Guidance Revealed
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Destiny;
