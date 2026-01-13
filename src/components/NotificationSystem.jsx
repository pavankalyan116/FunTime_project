import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, X, Zap } from 'lucide-react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Listen for custom events
  useEffect(() => {
    const handleAchievement = (event) => {
      const { achievement } = event.detail;
      addNotification({
        id: Date.now(),
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: achievement.title,
        icon: Trophy,
        color: 'from-yellow-500 to-orange-500',
        duration: 4000
      });
    };

    const handleLevelUp = (event) => {
      const { level } = event.detail;
      addNotification({
        id: Date.now() + 1,
        type: 'levelup',
        title: 'Level Up!',
        message: `You reached level ${level}!`,
        icon: Star,
        color: 'from-purple-500 to-pink-500',
        duration: 3000
      });
    };

    const handleXpGain = (event) => {
      const { amount } = event.detail;
      addNotification({
        id: Date.now() + 2,
        type: 'xp',
        title: `+${amount} XP`,
        message: 'Keep it up!',
        icon: Zap,
        color: 'from-blue-500 to-cyan-500',
        duration: 2000
      });
    };

    window.addEventListener('achievement-unlocked', handleAchievement);
    window.addEventListener('level-up', handleLevelUp);
    window.addEventListener('xp-gained', handleXpGain);

    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievement);
      window.removeEventListener('level-up', handleLevelUp);
      window.removeEventListener('xp-gained', handleXpGain);
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`bg-gradient-to-r ${notification.color} text-white p-4 rounded-xl shadow-2xl border border-white/20 max-w-sm min-w-[280px]`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm">{notification.title}</h3>
                  <p className="text-sm opacity-90">{notification.message}</p>
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;