import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic2, Flame, Rocket, Zap, Sparkles, Palette } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(0);

  const themes = [
    { name: 'Cyber', hue: 0 },
    { name: 'Ocean', hue: 45 },
    { name: 'Nature', hue: 100 },
    { name: 'Sunset', hue: 320 },
    { name: 'Toxic', hue: 280 },
  ];

  useEffect(() => {
    document.documentElement.style.filter = `hue-rotate(${themes[theme].hue}deg)`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev + 1) % themes.length);
  };

  const navItems = [
    { name: 'SingWith Me', path: '/sing-with-me', icon: Mic2 },
    { name: 'Destiny', path: '/destiny', icon: Flame },
    { name: 'Arcade', path: '/arcade', icon: Rocket },
    { name: 'Brainlock', path: '/brainlock', icon: Zap },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Sparkles className="w-8 h-8 text-purple-500 group-hover:rotate-12 transition-transform" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              FunTime
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
                {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                    <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                        ? 'bg-gray-800 text-purple-400 shadow-md shadow-purple-900/20'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    </Link>
                );
                })}
            </div>

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                title={`Theme: ${themes[theme].name}`}
            >
                <Palette className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
