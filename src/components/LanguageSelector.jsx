import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = ({ className = "" }) => {
  const { language, setLanguage, languages } = useLanguage();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="w-4 h-4 text-gray-400" />
      <div className="flex space-x-1">
        {Object.values(languages).map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              language === lang.code
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={lang.description}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;