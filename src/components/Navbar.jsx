import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic2, Flame, Rocket, Zap, Sparkles, Palette, Laugh, Menu, X } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) => (prev + 1) % themes.length);
  };

  const navItems = [
    { name: 'SingWith Me', path: '/sing-with-me', icon: Mic2 },
    { name: 'Destiny', path: '/destiny', icon: Flame },
    { name: 'Arcade', path: '/arcade', icon: Rocket },
    { name: 'Brainlock', path: '/brainlock', icon: Zap },
    { name: 'Admin Jokes', path: '/jokes', icon: Laugh },
  ];

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md text-white shadow-lg sticky top-0 z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-purple-500 group-hover:rotate-12 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
            </div>
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
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/30 scale-105'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:scale-105'
                    }`}
                    >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="ml-2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                    </Link>
                );
                })}
            </div>

            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-200 border border-gray-700/50"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 border border-gray-700/50"
                title={`Theme: ${themes[theme].name}`}
            >
                <div className="relative">
                  <Palette className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            id="mobile-nav"
            className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-xl"
          >
            <div className="px-4 py-3 flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-900/30'
                        : 'text-gray-200 hover:bg-gray-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
