import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Heart, Sparkles, Zap, Shield, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
    { name: 'Contact', href: 'mailto:support@funtime.com' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/funtime' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/funtime' }
  ];

  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              FunTime
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ultimate destination for endless entertainment. 
              Play games, sing karaoke, discover your destiny, 
              challenge your mind, and laugh with AI jokes.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Made with love</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/arcade" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  🎮 Arcade Games
                </Link>
              </li>
              <li>
                <Link 
                  to="/sing-with-me" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  🎤 Karaoke Studio
                </Link>
              </li>
              <li>
                <Link 
                  to="/jokes" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                >
                  😂 AI Jokes
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-300 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" />
                No Login Required
              </li>
              <li className="text-gray-300 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                Privacy First
              </li>
              <li className="text-gray-300 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                No Ads
              </li>
              <li className="text-gray-300 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-400" />
                Free Forever
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2 mb-6">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  {link.name === 'Contact' ? (
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {link.name}
                    </a>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 hover:scale-110"
                    title={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} FunTime. All rights reserved.
            </div>
            <div className="text-gray-400 text-sm">
              Built with 
              <span className="text-red-500 mx-1">❤️</span> 
              using 
              <span className="text-blue-400 mx-1">⚛️</span> 
              React & 
              <span className="text-purple-400 mx-1">✨</span> 
              Magic
            </div>
            <div className="text-gray-400 text-sm">
              <span className="text-green-400">🌍</span> Eco-friendly • 
              <span className="text-blue-400">🚀</span> Fast • 
              <span className="text-purple-400">🛡️</span> Secure
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
