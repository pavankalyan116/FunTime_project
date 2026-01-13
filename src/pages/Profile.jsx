import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Zap, Target, Calendar, Flame, Award } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const Profile = () => {
  const { user, getLevelProgress, getEarnedAchievements, getAvailableAchievements } = useGame();
  const progress = getLevelProgress();
  const earnedAchievements = getEarnedAchievements();
  const availableAchievements = getAvailableAchievements();

  const statCards = [
    { label: 'Roasts Generated', value: user.stats.roastsGenerated, icon: '🔥', color: 'from-red-500 to-orange-500' },
    { label: 'Compliments Received', value: user.stats.complimentsReceived, icon: '💖', color: 'from-pink-500 to-rose-500' },
    { label: 'Motivations Got', value: user.stats.motivationsGot, icon: '⚡', color: 'from-blue-500 to-purple-500' },
    { label: 'Jokes Heard', value: user.stats.jokesHeard, icon: '😂', color: 'from-yellow-500 to-orange-500' },
    { label: 'Songs Played', value: user.stats.songsPlayed, icon: '🎤', color: 'from-green-500 to-emerald-500' },
    { label: 'Quizzes Taken', value: user.stats.quizzesTaken, icon: '🧠', color: 'from-indigo-500 to-purple-500' },
    { label: 'Games Won', value: user.stats.gamesWon, icon: '🏆', color: 'from-amber-500 to-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 sm:p-6 lg:p-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Your FunTime Profile
          </h1>
          <p className="text-lg text-gray-300">
            Track your progress and unlock achievements!
          </p>
        </motion.div>

        {/* Level & XP Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <Star className="w-8 h-8 text-yellow-400" />
                <h2 className="text-3xl font-bold text-yellow-400">Level {user.level}</h2>
              </div>
              <p className="text-gray-300 mb-2">Total XP: {user.totalXp}</p>
              <p className="text-gray-400">Games Played: {user.gamesPlayed}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-semibold">{user.streak} day streak</span>
              </div>
            </div>
            
            <div className="w-full lg:w-80">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress to Level {user.level + 1}</span>
                <span>{progress.current}/{progress.required} XP</span>
              </div>
              <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index + 0.5 }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-xl text-center`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Earned Achievements */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl font-bold">Achievements Unlocked</h3>
              <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
                {earnedAchievements.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {earnedAchievements.length > 0 ? (
                earnedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.7 }}
                    className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg"
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-400">{achievement.title}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    <div className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded">
                      +{achievement.xp} XP
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No achievements yet. Keep playing to unlock them!</p>
              )}
            </div>
          </motion.div>

          {/* Available Achievements */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-gray-400" />
              <h3 className="text-2xl font-bold">Available Achievements</h3>
              <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded-full text-sm font-bold">
                {availableAchievements.length}
              </span>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableAchievements.slice(0, 8).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.9 }}
                  className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
                >
                  <div className="text-2xl grayscale">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-300">{achievement.title}</h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                  <div className="text-xs bg-gray-600/50 text-gray-400 px-2 py-1 rounded">
                    +{achievement.xp} XP
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;