import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Flame, Rocket, Zap, Laugh } from 'lucide-react';
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-8">
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
            className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent leading-tight"
          >
            Welcome to FunTime
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Kill time, have fun, and explore new activities. Whether you're at home, office, or traveling, we've got something for you. No login required!
          </motion.p>
          
          {/* Stats Pills */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4 mt-8"
          >
            <div className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700">
              🎮 8+ Games
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700">
              🎤 Karaoke Studio
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700">
              🔮 AI Quizzes
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700">
              😂 AI Jokes
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-full text-sm text-gray-300 border border-gray-700">
              ✨ No Login
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              whileHover={{ y: -5 }}
            >
              <Link to={feature.path}>
                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${feature.color} hover:scale-105 transition-all duration-300 shadow-2xl cursor-pointer group relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-white/10 transform rotate-45 translate-x-1/2 translate-y-1/2 w-32 h-32"></div>
                  
                  <div className="relative z-10">
                    <feature.icon className="w-12 h-12 mb-4 text-white group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg" />
                    <h2 className="text-3xl font-bold mb-2">{feature.title}</h2>
                    <p className="text-white/90 text-lg">{feature.description}</p>
                    
                    {/* Hover indicator */}
                    <div className="mt-4 text-white/80 text-sm font-medium flex items-center">
                      Explore 
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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
