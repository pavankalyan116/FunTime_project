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
      english: "Respond in pure English only. Do not mix any other languages.",
      teglish: `Respond in Teglish (Telugu-English mix). This is MANDATORY - you MUST mix Telugu and English naturally like how Telugu people speak with friends. Examples: 
      - "Arre bro, idi chala funny undi ra!"
      - "Nuvvu cheppina joke super ga undi yaar!"
      - "Baaga laugh chesanu, next joke cheppu!"
      Use Telugu words like: arre, bro, ra, yaar, undi, chala, baaga, enti, enduku, nuvvu, nenu, etc. mixed with English.`,
      higlish: `Respond in Higlish (Hindi-English mix). This is MANDATORY - you MUST mix Hindi and English naturally like how Hindi speakers talk with friends. Examples:
      - "Yaar, yeh joke bahut funny hai!"
      - "Kya baat hai bro, mast joke tha!"
      - "Arre yaar, aur sunao jokes!"
      Use Hindi words like: yaar, bhai, kya, hai, bahut, mast, arre, aur, sunao, etc. mixed with English.`
    };

    const specificInstructions = {
      joke: {
        english: "Generate a funny Indian joke in pure English only.",
        teglish: `Generate a funny Indian joke in Teglish (Telugu-English mix). IMPORTANT: You MUST use Telugu words mixed with English. Example style: "Arre yaar, Indian parents enduku late ga call chestaru? Kyunki they want to disturb mana peaceful time ra!" Use words like: arre, yaar, enduku, chestaru, mana, ra, undi, chala, baaga, etc.`,
        higlish: `Generate a funny Indian joke in Higlish (Hindi-English mix). IMPORTANT: You MUST use Hindi words mixed with English. Example style: "Yaar, Indian traffic mein kyun sab log expert drivers ban jaate hain? Kyunki everyone thinks ki main hi sabse accha driver hun!" Use words like: yaar, kyun, mein, sab, ban jaate hain, ki, main, hun, etc.`
      },
      roast: {
        english: "Generate a roast in pure English only.",
        teglish: "Generate a roast in Teglish (Telugu-English mix). Mix Telugu and English naturally like friends talking.",
        higlish: "Generate a roast in Higlish (Hindi-English mix). Mix Hindi and English naturally like friends talking."
      },
      compliment: {
        english: "Generate a compliment in pure English only.",
        teglish: "Generate a compliment in Teglish (Telugu-English mix). Mix Telugu and English naturally.",
        higlish: "Generate a compliment in Higlish (Hindi-English mix). Mix Hindi and English naturally."
      },
      astrology: {
        english: "Provide astrological reading in pure English only.",
        teglish: "Provide astrological reading in Teglish (Telugu-English mix). Mix Telugu and English naturally.",
        higlish: "Provide astrological reading in Higlish (Hindi-English mix). Mix Hindi and English naturally."
      }
    };

    const specificInstruction = specificInstructions[contentType]?.[language] || languageInstructions[language];
    
    return `${basePrompt}

CRITICAL LANGUAGE REQUIREMENT: ${specificInstruction}

${language !== 'english' ? `MANDATORY: Your response MUST contain ${language === 'teglish' ? 'Telugu' : 'Hindi'} words mixed with English. Do NOT respond in pure English. This is a strict requirement.` : ''}`;
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