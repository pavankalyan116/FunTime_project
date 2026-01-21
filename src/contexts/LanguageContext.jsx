import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  const languages = {
    english: {
      code: 'english',
      name: 'English',
      flag: '🇺🇸',
      description: 'Pure English'
    },
    teglish: {
      code: 'teglish',
      name: 'Teglish',
      flag: '🇮🇳',
      description: 'Telugu + English'
    },
    higlish: {
      code: 'higlish',
      name: 'Higlish',
      flag: '🇮🇳',
      description: 'Hindi + English'
    }
  };

  const getLanguagePrompt = (basePrompt, contentType = 'general') => {
    const languageInstructions = {
      english: "Respond in pure English only.",
      teglish: `Respond in Teglish (Telugu-English mix). Mix 65% Telugu with 35% English naturally.
      Use Telugu words: arre, bro, ra, yaar, undi, chala, baaga, enti, enduku, nuvvu, nenu, etc.
      Example: "Arre bro, idi chala funny undi ra!"`,
      higlish: `Respond in Higlish (Hindi-English mix). Mix 65% Hindi with 35% English naturally.
      Use Hindi words: yaar, bhai, kya, hai, bahut, mast, arre, aur, kyun, etc.
      Example: "Yaar, yeh joke bahut funny hai!"`
    };

    if (language === 'english') {
      return basePrompt;
    }

    return `${basePrompt}

LANGUAGE: ${languageInstructions[language]}

MANDATORY: Must contain ${language === 'teglish' ? 'Telugu' : 'Hindi'} words mixed with English.`;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      languages,
      getLanguagePrompt
    }}>
      {children}
    </LanguageContext.Provider>
  );
};