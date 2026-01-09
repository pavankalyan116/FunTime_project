import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SingWithMe from './pages/SingWithMe';
import Destiny from './pages/Destiny';
import Arcade from './pages/Arcade';
import Brainlock from './pages/Brainlock';

function App() {
  return (
    <Router basename="/FunTime_project">
      <div className="min-h-screen bg-gray-950 font-sans text-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sing-with-me" element={<SingWithMe />} />
          <Route path="/destiny" element={<Destiny />} />
          <Route path="/arcade" element={<Arcade />} />
          <Route path="/brainlock" element={<Brainlock />} />

          {/* ✅ fallback route (IMPORTANT) */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
