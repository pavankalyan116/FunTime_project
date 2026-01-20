import React from 'react';
import Lottie from 'lottie-react';

// You can replace these with actual Lottie JSON files from LottieFiles
// For now, I'll create simple animated components using CSS animations as placeholders

export const CelebrationAnimation = ({ size = 100 }) => {
  // Placeholder celebration animation
  const celebrationData = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 90,
    w: size,
    h: size,
    nm: "Celebration",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Confetti",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { 
            a: 1, 
            k: [
              { t: 0, s: [0] },
              { t: 90, s: [360] }
            ]
          },
          p: { a: 0, k: [size/2, size/2, 0] },
          s: { 
            a: 1,
            k: [
              { t: 0, s: [0, 0, 100] },
              { t: 30, s: [120, 120, 100] },
              { t: 60, s: [100, 100, 100] },
              { t: 90, s: [0, 0, 100] }
            ]
          }
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "el",
                p: { a: 0, k: [0, 0] },
                s: { a: 0, k: [20, 20] }
              },
              {
                ty: "fl",
                c: { a: 0, k: [1, 0.8, 0, 1] },
                o: { a: 0, k: 100 }
              }
            ]
          }
        ],
        ip: 0,
        op: 90,
        st: 0
      }
    ]
  };

  return (
    <div className="inline-block">
      <Lottie
        animationData={celebrationData}
        loop={true}
        autoplay={true}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export const LoadingAnimation = ({ size = 60 }) => {
  // Simple CSS-based loading animation
  return (
    <div className="inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="relative">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-pink-600 rounded-full animate-spin animate-reverse"></div>
      </div>
    </div>
  );
};

export const HeartAnimation = ({ size = 80 }) => {
  return (
    <div className="inline-block animate-pulse" style={{ width: size, height: size }}>
      <div className="text-pink-500 text-6xl flex items-center justify-center h-full">
        💖
      </div>
    </div>
  );
};

export const FireAnimation = ({ size = 80 }) => {
  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      <div className="text-orange-500 text-6xl flex items-center justify-center h-full animate-bounce">
        🔥
      </div>
    </div>
  );
};

export const LightningAnimation = ({ size = 80 }) => {
  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      <div className="text-blue-500 text-6xl flex items-center justify-center h-full animate-pulse">
        ⚡
      </div>
    </div>
  );
};

export const StarAnimation = ({ size = 80 }) => {
  return (
    <div className="inline-block animate-spin" style={{ width: size, height: size }}>
      <div className="text-yellow-500 text-6xl flex items-center justify-center h-full">
        ⭐
      </div>
    </div>
  );
};

export const TrophyAnimation = ({ size = 80 }) => {
  return (
    <div className="inline-block animate-bounce" style={{ width: size, height: size }}>
      <div className="text-yellow-600 text-6xl flex items-center justify-center h-full">
        🏆
      </div>
    </div>
  );
};

// Mood-based animations
export const MoodAnimations = {
  happy: ({ size = 60 }) => (
    <div className="animate-bounce" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">😊</div>
    </div>
  ),
  excited: ({ size = 60 }) => (
    <div className="animate-pulse" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">🤩</div>
    </div>
  ),
  tired: ({ size = 60 }) => (
    <div className="animate-pulse" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">😴</div>
    </div>
  ),
  stressed: ({ size = 60 }) => (
    <div className="animate-bounce" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">😤</div>
    </div>
  ),
  confident: ({ size = 60 }) => (
    <div className="animate-pulse" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">😎</div>
    </div>
  ),
  bored: ({ size = 60 }) => (
    <div style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">😑</div>
    </div>
  ),
  creative: ({ size = 60 }) => (
    <div className="animate-spin" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">🎨</div>
    </div>
  ),
  focused: ({ size = 60 }) => (
    <div className="animate-pulse" style={{ width: size, height: size }}>
      <div className="text-4xl flex items-center justify-center h-full">🎯</div>
    </div>
  )
};

// Instructions for adding real Lottie files:
/*
To add real Lottie animations from LottieFiles:

1. Go to https://lottiefiles.com/
2. Find animations you like (celebration, loading, etc.)
3. Download the JSON file
4. Import it like this:

import celebrationData from '../assets/lottie/celebration.json';

5. Replace the placeholder data with the imported JSON:

export const CelebrationAnimation = ({ size = 100 }) => {
  return (
    <Lottie
      animationData={celebrationData}
      loop={true}
      autoplay={true}
      style={{ width: size, height: size }}
    />
  );
};

Popular Lottie animations to look for:
- Celebration/Confetti
- Loading spinners
- Success checkmarks
- Error animations
- Heart/Like animations
- Fire effects
- Lightning bolts
- Trophy/Achievement
- Mood faces
- Game icons
*/