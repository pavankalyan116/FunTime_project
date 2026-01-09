import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Stars, Calculator, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Destiny = () => {
  const [activeTab, setActiveTab] = useState('flames');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('flames')}
            className={`flex items-center px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeTab === 'flames'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Heart className="w-5 h-5 mr-2" />
            FLAMES
          </button>
          <button
            onClick={() => setActiveTab('astrology')}
            className={`flex items-center px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
              activeTab === 'astrology'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Stars className="w-5 h-5 mr-2" />
            Astrology
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
      'Friends': 'from-yellow-400 to-orange-500',
      'Lovers': 'from-red-500 to-pink-600',
      'Affection': 'from-pink-400 to-rose-400',
      'Marriage': 'from-purple-500 to-indigo-600',
      'Enemy': 'from-gray-600 to-gray-800',
      'Siblings': 'from-blue-400 to-cyan-500'
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
    <div className="space-y-8 text-center">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
        Check Your Compatibility
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Your Name</label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-center text-lg"
            placeholder="Enter name..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Partner's Name</label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-center text-lg"
            placeholder="Enter name..."
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={calculateFlames}
        disabled={loading || !name1 || !name2}
        className="px-8 py-4 bg-gradient-to-r from-pink-600 to-red-600 rounded-full font-bold text-lg shadow-lg shadow-pink-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        ) : (
          "Calculate Destiny"
        )}
      </motion.button>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-2xl bg-gradient-to-br ${result.color} text-white shadow-xl`}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl font-black mb-2"
          >
            {result.outcome}
          </motion.div>
          
          <div className="w-full bg-black/20 rounded-full h-4 mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white/50"
            />
          </div>
          <p className="text-sm font-mono opacity-80 mb-4">{result.percentage}% Compatibility Probability</p>
          
          <p className="text-xl font-serif italic">"{result.dedication}"</p>
        </motion.div>
      )}
    </div>
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
      ? `Give a fun, mystical astrology reading for ${p1}. Focus on love, luck, and kill-time activities.`
      : `Give a relationship compatibility reading for ${p1} and ${p2}. Be witty and fun.`;

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });
      const resData = await response.json();
      setReading(resData.content || " The stars are cloudy today...");
    } catch (e) {
      setReading("Failed to consult the stars. Try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4 mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={mode === 'single'}
            onChange={() => setMode('single')}
            className="form-radio text-purple-600"
          />
          <span>Single Reading</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            checked={mode === 'couple'}
            onChange={() => setMode('couple')}
            className="form-radio text-purple-600"
          />
          <span>Couple Compatibility</span>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Person 1 */}
        <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-purple-400 font-semibold">{mode === 'couple' ? 'Your Details' : 'Your Details'}</h3>
            <input
            type="text"
            placeholder="Name"
            className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
            value={data.name1}
            onChange={e => setData({...data, name1: e.target.value})}
            />
            <input
            type="text"
            placeholder="Zodiac Sign (Optional)"
            className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
            value={data.sign1}
            onChange={e => setData({...data, sign1: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Date of Birth</label>
                    <input
                        type="date"
                        className="w-full bg-gray-800 p-2 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-sm"
                        value={data.dob1 || ''}
                        onChange={e => setData({...data, dob1: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Birth Time</label>
                    <input
                        type="time"
                        className="w-full bg-gray-800 p-2 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-sm"
                        value={data.time1 || ''}
                        onChange={e => setData({...data, time1: e.target.value})}
                    />
                </div>
            </div>
        </div>

        {/* Person 2 */}
        {mode === 'couple' && (
           <div className="space-y-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h3 className="text-purple-400 font-semibold">Partner's Details</h3>
            <input
              type="text"
              placeholder="Partner's Name"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
              value={data.name2}
              onChange={e => setData({...data, name2: e.target.value})}
            />
            <input
              type="text"
              placeholder="Partner's Zodiac Sign (Optional)"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700 focus:border-purple-500 outline-none"
              value={data.sign2}
              onChange={e => setData({...data, sign2: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Date of Birth</label>
                    <input
                        type="date"
                        className="w-full bg-gray-800 p-2 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-sm"
                        value={data.dob2 || ''}
                        onChange={e => setData({...data, dob2: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-gray-400">Birth Time</label>
                    <input
                        type="time"
                        className="w-full bg-gray-800 p-2 rounded-lg border border-gray-700 focus:border-purple-500 outline-none text-sm"
                        value={data.time2 || ''}
                        onChange={e => setData({...data, time2: e.target.value})}
                    />
                </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={getReading}
        disabled={loading}
        className="w-full py-3 bg-purple-600 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 mt-4"
      >
        {loading ? "Consulting the Stars..." : "Reveal Destiny"}
      </button>

      {reading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 bg-gray-800/50 rounded-xl border border-purple-500/30 text-purple-100 leading-relaxed"
        >
          <Stars className="w-8 h-8 text-yellow-400 mb-4 mx-auto" />
          {reading}
        </motion.div>
      )}
    </div>
  );
};

export default Destiny;
