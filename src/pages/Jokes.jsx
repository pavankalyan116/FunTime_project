import React, { useState, useEffect } from 'react';
import { Laugh, RefreshCw, Shield, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Jokes = () => {
  const [currentJoke, setCurrentJoke] = useState('');
  const [jokeHistory, setJokeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [is18Plus, setIs18Plus] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const cleanJokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why can't a bicycle stand up by itself? It's two tired!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "Why did the math book look so sad? It had too many problems!",
    "What do you call a fake noodle? An impasta!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
    "Why did the cookie go to the doctor? Because it felt crumbly!",
    "What do you call a bear that's stuck in the rain? A drizzly bear!",
    "Why did the student eat his homework? Because the teacher said it was a piece of cake!",
    "What do you call a dinosaur with a great vocabulary? A thesaurus!",
    "Why don't programmers like nature? It has too many bugs!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why did the coffee file a police report? It got mugged!",
    "What do you call a magical dog? A labracadabrador!",
    "Why don't eggs tell jokes? They'd crack up!",
    "What do you call a dinosaur that's a noisy sleeper? A bronto-snore-us!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why can't a leopard hide? Because he's always spotted!",
    "What do you call a dinosaur that's a police officer? A tricera-cops!",
    "Why did the cookie go to the doctor? Because it felt crumbly!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why don't scientists trust atoms? Because they make up everything!"
  ];

  const adultJokes = [
    "What's the difference between a G-spot and a golf ball? A guy will actually search for a golf ball!",
    "Why don't skeletons go to parties? They have no body to dance with!",
    "What's the difference between a tire and 365 used condoms? One's a Goodyear, the other's a great year!",
    "Why don't women blink during foreplay? They don't have enough time!",
    "What do you call a cheap circumcision? A rip-off!",
    "Why did the condom fly across the room? Because it was pissed off!",
    "What's the difference between a girlfriend and a wife? 45 pounds!",
    "What do you call a lesbian dinosaur? A lickalotopus!",
    "Why don't orphans play tennis? They don't know who their dad is!",
    "What's the difference between a job and a wife? After five years, the job still sucks!",
    "Why do women have orgasms? So they can have something else to moan about!",
    "What do you call a gay dinosaur? Megasoreass!",
    "Why don't bunnies make noise when they have sex? They have cotton balls!",
    "What's the difference between a boyfriend and a husband? About 30 minutes!",
    "Why did the snowman smile? He heard the snowblower was coming!",
    "What do you call a virgin on a waterbed? A cherry float!",
    "What's the difference between a hooker and a drug dealer? A hooker can wash her crack and sell it again!",
    "Why don't blind people skydive? It scares the hell out of their dogs!",
    "What do you call a truckload of vibrators? Toys for twats!",
    "Why don't chickens wear underwear? Because their peckers are on their faces!",
    "What's the difference between a girlfriend and a job? After 6 months, the job still sucks!",
    "Why did the condom fly across the room? It got pissed off!",
    "What do you call a nun in a wheelchair? Virgin mobile!",
    "Why don't ghosts like rain? It dampens their spirits!",
    "What's the difference between a wife and a job? After 10 years, the job still sucks!",
    "Why don't women play tennis? They're afraid of the net!",
    "What do you call a hooker with a runny nose? Full!",
    "Why did the snowman pull down his pants? He heard the snowblower was coming!"
  ];

  const generateRandomJoke = () => {
    setIsLoading(true);
    setShowWarning(false);
    
    setTimeout(() => {
      const jokes = is18Plus ? adultJokes : cleanJokes;
      const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
      setCurrentJoke(randomJoke);
      setJokeHistory(prev => [randomJoke, ...prev.slice(0, 9)]);
      setIsLoading(false);
    }, 800);
  };

  const toggle18Plus = () => {
    if (!is18Plus) {
      setShowWarning(true);
    } else {
      setIs18Plus(false);
      setCurrentJoke('');
    }
  };

  const confirm18Plus = () => {
    setIs18Plus(true);
    setShowWarning(false);
    setCurrentJoke('');
  };

  useEffect(() => {
    generateRandomJoke();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent leading-tight flex items-center justify-center"
          >
            <Laugh className="w-12 h-12 mr-4" />
            AI Jokes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Get your daily dose of humor with AI-generated jokes. Click next for a new one every time!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* 18+ Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                {is18Plus ? <ShieldOff className="w-5 h-5 mr-2 text-red-500" /> : <Shield className="w-5 h-5 mr-2 text-green-500" />}
                Content Filter
              </h3>
              <div className="space-y-4">
                <button
                  onClick={toggle18Plus}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    is18Plus 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {is18Plus ? '🔞 18+ Mode ON' : '👶 All Ages Mode'}
                </button>
                {is18Plus && (
                  <p className="text-sm text-red-400 text-center">
                    ⚠️ Adult content enabled
                  </p>
                )}
                {!is18Plus && (
                  <p className="text-sm text-green-400 text-center">
                    ✅ Family-friendly content
                  </p>
                )}
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
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Today's Joke</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {is18Plus ? '🔞 18+' : '👶 All Ages'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-6 min-h-[200px] flex items-center justify-center mb-6">
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
                      <p className="text-gray-400 mt-4">AI is thinking...</p>
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

      {/* Age Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
            >
              <div className="text-center space-y-6">
                <ShieldOff className="w-16 h-16 text-red-500 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Age Verification</h3>
                <p className="text-gray-300">
                  You're about to enable 18+ content that may contain adult humor and themes. 
                  Please confirm you are 18 years or older.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowWarning(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirm18Plus}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    I'm 18+
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jokes;
