import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { getLanguageExample } from '../utils/languageExamples';

const LanguageDemo = ({ category = 'jokes' }) => {
  const { language } = useLanguage();
  
  const example = getLanguageExample(category, language);
  
  return (
    <motion.div
      key={language} // This will trigger re-animation when language changes
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50"
    >
      <div className="text-xs text-gray-400 mb-2 flex items-center">
        <span className="mr-2">Preview in {language}:</span>
        <span className="px-2 py-1 bg-purple-600/20 rounded-full text-purple-300">
          {language === 'english' ? '🇺🇸' : '🇮🇳'} {language}
        </span>
      </div>
      <div className="text-sm text-gray-200 italic">
        "{example}"
      </div>
    </motion.div>
  );
};

export default LanguageDemo;