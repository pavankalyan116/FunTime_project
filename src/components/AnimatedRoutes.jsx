import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './PageTransition';
import Home from '../pages/Home';
import SingWithMe from '../pages/SingWithMe';
import Destiny from '../pages/Destiny';
import Arcade from '../pages/Arcade';
import Brainlock from '../pages/Brainlock';
import Jokes from '../pages/Jokes';
import RoastMe from '../pages/RoastMe';
import Profile from '../pages/Profile';
import MoodDetector from '../pages/MoodDetector';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/sing-with-me" element={<PageTransition><SingWithMe /></PageTransition>} />
        <Route path="/destiny" element={<PageTransition><Destiny /></PageTransition>} />
        <Route path="/arcade" element={<PageTransition><Arcade /></PageTransition>} />
        <Route path="/brainlock" element={<PageTransition><Brainlock /></PageTransition>} />
        <Route path="/jokes" element={<PageTransition><Jokes /></PageTransition>} />
        <Route path="/roast-me" element={<PageTransition><RoastMe /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/mood-detector" element={<PageTransition><MoodDetector /></PageTransition>} />
        <Route path="*" element={<PageTransition><Home /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;