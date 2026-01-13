import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('funtime-user');
    return saved ? JSON.parse(saved) : {
      name: '',
      level: 1,
      xp: 0,
      totalXp: 0,
      achievements: [],
      gamesPlayed: 0,
      streak: 0,
      lastPlayDate: null,
      stats: {
        roastsGenerated: 0,
        complimentsReceived: 0,
        motivationsGot: 0,
        jokesHeard: 0,
        songsPlayed: 0,
        quizzesTaken: 0,
        gamesWon: 0
      }
    };
  });

  // XP thresholds for each level
  const getXpForLevel = (level) => level * 100;

  // Achievement definitions
  const achievements = [
    {
      id: 'first_roast',
      title: 'Roast Rookie',
      description: 'Generated your first AI roast',
      icon: '🔥',
      xp: 10,
      condition: (stats) => stats.roastsGenerated >= 1
    },
    {
      id: 'roast_master',
      title: 'Roast Master',
      description: 'Generated 10 AI roasts',
      icon: '🌶️',
      xp: 50,
      condition: (stats) => stats.roastsGenerated >= 10
    },
    {
      id: 'compliment_collector',
      title: 'Compliment Collector',
      description: 'Received 5 AI compliments',
      icon: '💖',
      xp: 25,
      condition: (stats) => stats.complimentsReceived >= 5
    },
    {
      id: 'motivation_seeker',
      title: 'Motivation Seeker',
      description: 'Got motivated 3 times',
      icon: '⚡',
      xp: 20,
      condition: (stats) => stats.motivationsGot >= 3
    },
    {
      id: 'joke_lover',
      title: 'Joke Lover',
      description: 'Heard 20 AI jokes',
      icon: '😂',
      xp: 30,
      condition: (stats) => stats.jokesHeard >= 20
    },
    {
      id: 'karaoke_star',
      title: 'Karaoke Star',
      description: 'Played 5 songs',
      icon: '🎤',
      xp: 40,
      condition: (stats) => stats.songsPlayed >= 5
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Completed 10 quizzes',
      icon: '🧠',
      xp: 60,
      condition: (stats) => stats.quizzesTaken >= 10
    },
    {
      id: 'game_champion',
      title: 'Game Champion',
      description: 'Won 15 games',
      icon: '🏆',
      xp: 100,
      condition: (stats) => stats.gamesWon >= 15
    },
    {
      id: 'level_5',
      title: 'Rising Star',
      description: 'Reached level 5',
      icon: '⭐',
      xp: 50,
      condition: (stats, level) => level >= 5
    },
    {
      id: 'level_10',
      title: 'FunTime Legend',
      description: 'Reached level 10',
      icon: '👑',
      xp: 100,
      condition: (stats, level) => level >= 10
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Played for 7 days straight',
      icon: '🔥',
      xp: 75,
      condition: (stats, level, streak) => streak >= 7
    }
  ];

  // Save user data to localStorage
  useEffect(() => {
    localStorage.setItem('funtime-user', JSON.stringify(user));
  }, [user]);

  // Add XP and check for level ups and achievements
  const addXp = (amount, activity = '') => {
    setUser(prevUser => {
      const newXp = prevUser.xp + amount;
      const newTotalXp = prevUser.totalXp + amount;
      let newLevel = prevUser.level;
      let leveledUp = false;

      // Check for level up
      while (newXp >= getXpForLevel(newLevel)) {
        newLevel++;
        leveledUp = true;
      }

      const finalXp = leveledUp ? newXp - getXpForLevel(newLevel - 1) : newXp;

      const updatedUser = {
        ...prevUser,
        xp: finalXp,
        totalXp: newTotalXp,
        level: newLevel
      };

      // Check for new achievements
      const newAchievements = achievements.filter(achievement => 
        !prevUser.achievements.includes(achievement.id) &&
        achievement.condition(updatedUser.stats, updatedUser.level, updatedUser.streak)
      );

      if (newAchievements.length > 0) {
        updatedUser.achievements = [...prevUser.achievements, ...newAchievements.map(a => a.id)];
        // Add bonus XP for achievements
        const bonusXp = newAchievements.reduce((sum, a) => sum + a.xp, 0);
        updatedUser.totalXp += bonusXp;
        updatedUser.xp += bonusXp;

        // Dispatch achievement events
        newAchievements.forEach(achievement => {
          window.dispatchEvent(new CustomEvent('achievement-unlocked', {
            detail: { achievement }
          }));
        });
      }

      // Dispatch level up event
      if (leveledUp) {
        window.dispatchEvent(new CustomEvent('level-up', {
          detail: { level: newLevel }
        }));
      }

      // Dispatch XP gain event
      window.dispatchEvent(new CustomEvent('xp-gained', {
        detail: { amount }
      }));

      return updatedUser;
    });

    return { leveledUp: false, newAchievements: [] }; // You can enhance this to return actual values
  };

  // Update specific stats
  const updateStats = (statKey, increment = 1) => {
    setUser(prevUser => ({
      ...prevUser,
      stats: {
        ...prevUser.stats,
        [statKey]: prevUser.stats[statKey] + increment
      },
      gamesPlayed: prevUser.gamesPlayed + (statKey.includes('games') ? increment : 0)
    }));
  };

  // Update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    setUser(prevUser => {
      const lastPlay = prevUser.lastPlayDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      let newStreak = prevUser.streak;
      
      if (!lastPlay) {
        newStreak = 1;
      } else if (lastPlay === yesterday.toDateString()) {
        newStreak = prevUser.streak + 1;
      } else if (lastPlay !== today) {
        newStreak = 1;
      }

      return {
        ...prevUser,
        streak: newStreak,
        lastPlayDate: today
      };
    });
  };

  // Get user's current level progress
  const getLevelProgress = () => {
    const currentLevelXp = getXpForLevel(user.level);
    const progress = (user.xp / currentLevelXp) * 100;
    return {
      current: user.xp,
      required: currentLevelXp,
      progress: Math.min(progress, 100)
    };
  };

  // Get available achievements
  const getAvailableAchievements = () => {
    return achievements.filter(achievement => 
      !user.achievements.includes(achievement.id)
    );
  };

  // Get earned achievements
  const getEarnedAchievements = () => {
    return achievements.filter(achievement => 
      user.achievements.includes(achievement.id)
    );
  };

  const value = {
    user,
    setUser,
    addXp,
    updateStats,
    updateStreak,
    getLevelProgress,
    getAvailableAchievements,
    getEarnedAchievements,
    achievements
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};