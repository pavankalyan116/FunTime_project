import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Zap } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const FloatingXpDisplay = () => {
  const { user, getLevelProgress } = useGame();
  const progress = getLevelProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-20 right-2 sm:right-4 z-40"
    >
      <Link to="/profile">
        <motion.div 
          className="flex items-center space-x-2 sm:space-x-3 bg-gray-900/90 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer shadow-2xl hover:shadow-purple-500/20"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Level Badge */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Star className="w-4 h-4 text-yellow-400" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-yellow-400">
                Lv.{user.level}
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="flex flex-col">
            <div className="w-16 sm:w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1 text-center">
              {progress.current}/{progress.required}
            </div>
          </div>

          {/* Total XP */}
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400">
              {user.totalXp}
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default FloatingXpDisplay;