import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Flame, Rocket, Zap, Laugh, MessageCircle, Trophy, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      title: "SingWith Me",
      description: "Upload, Sing, Record. Your personal karaoke studio.",
      icon: Mic2,
      path: "/sing-with-me",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Destiny",
      description: "Discover your fate. FLAMES, Astrology, and more.",
      icon: Flame,
      path: "/destiny",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Arcade",
      description: "Classic games to kill time. Snake, Tic-Tac-Toe.",
      icon: Rocket,
      path: "/arcade",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Brainlock",
      description: "Challenge your mind with AI-generated quizzes.",
      icon: Zap,
      path: "/brainlock",
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "AI Jokes",
      description: "Get your daily laugh with AI-generated humor.",
      icon: Laugh,
      path: "/jokes",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Roast Me",
      description: "AI roasts, compliments, and motivation on demand.",
      icon: MessageCircle,
      path: "/roast-me",
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Mood Detective",
      description: "AI analyzes your mood and suggests activities.",
      icon: Brain,
      path: "/mood-detector",
      color: "from-cyan-500 to-purple-500"
    },
    {
      title: "Profile",
      description: "Track your progress and unlock achievements.",
      icon: Trophy,
      path: "/profile",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-tight"
          >
            Welcome to FunTime
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Kill time, have fun, and explore new activities. Whether you're at home, office, or traveling, we've got something for you. No login required!
          </motion.p>
          
          {/* Stats Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6 sm:mt-8"
          >
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              🎮 12+ Games
            </div>
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              🎤 Karaoke Studio
            </div>
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              🧠 AI Mood Detection
            </div>
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              🔮 AI Quizzes
            </div>
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              😂 AI Jokes
            </div>
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              🔥 AI Roasts
            </div>
            <div className="bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-gray-300 border border-gray-700">
              ✨ No Login
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={feature.path}>
                <div className={`h-full p-5 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-br ${feature.color} hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden`}>
                  {/* Animated Background Pattern */}
                  <motion.div 
                    className="absolute inset-0 bg-white/10 transform rotate-45 translate-x-1/2 translate-y-1/2 w-32 h-32"
                    whileHover={{ rotate: 90, scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                          y: [-10, -30, -10],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-3 sm:mb-4 text-white drop-shadow-lg" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{feature.title}</h2>
                    <p className="text-white/90 text-sm sm:text-base lg:text-lg">{feature.description}</p>
                  
                    {/* Enhanced Hover indicator */}
                    <motion.div 
                      className="mt-4 text-white/80 text-sm font-medium flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      Explore 
                      <motion.svg 
                        className="w-4 h-4 ml-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
