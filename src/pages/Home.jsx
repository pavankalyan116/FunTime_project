import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Flame, Rocket, Zap } from 'lucide-react';
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            Welcome to FunTime
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Kill time, have fun, and explore new activities. Whether you're at home, office, or traveling, we've got something for you. No login required!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <Link to={feature.path}>
                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${feature.color} hover:scale-105 transition-transform duration-300 shadow-xl cursor-pointer group`}>
                  <feature.icon className="w-12 h-12 mb-4 text-white group-hover:rotate-12 transition-transform duration-300" />
                  <h2 className="text-3xl font-bold mb-2">{feature.title}</h2>
                  <p className="text-white/90 text-lg">{feature.description}</p>
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
