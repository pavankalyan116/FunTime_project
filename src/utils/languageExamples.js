// Language examples for testing and demonstration

export const languageExamples = {
  jokes: {
    english: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't eggs tell jokes? They'd crack each other up!"
    ],
    teglish: [
      "Arre bro, scientists enduku atoms ni trust avvaru? Because they make up everything ra!",
      "Nenu na wife ki cheppa, eyebrows chala high ga draw chestunnav ani. She looked surprised andi!",
      "Eggs enduku jokes cheppavu yaar? They'd crack each other up avthai kada!"
    ],
    higlish: [
      "Yaar, scientists kyun nahi trust karte atoms ko? Kyunki they make up everything!",
      "Maine apni wife ko kaha, eyebrows bahut high draw kar rahi hai. She looked surprised yaar!",
      "Eggs kyun nahi jokes bolte bhai? They'd crack each other up ho jaayenge na!"
    ]
  },
  
  roasts: {
    english: [
      "You're like a software update - nobody wants you, but you keep showing up anyway!",
      "I'd roast you but my ethics won't let me burn trash!",
      "You're proof that even AI makes mistakes sometimes!"
    ],
    teglish: [
      "Nuvvu software update laga unnav - evaru kavali anukoru, kani nuvvu vasthune untav!",
      "Ninnu roast cheyali anipistundi kani na ethics trash ni burn cheyyakunda!",
      "Nuvvu proof that even AI makes mistakes sometimes ra!"
    ],
    higlish: [
      "Tu software update jaisa hai yaar - koi nahi chahta, but tu aata rehta hai!",
      "Tujhe roast karna chahta hun but meri ethics trash ko burn nahi karne deti!",
      "Tu proof hai ki even AI makes mistakes sometimes bhai!"
    ]
  },
  
  compliments: {
    english: [
      "You're like perfectly optimized code - efficient, elegant, and absolutely brilliant!",
      "If you were a programming language, you'd be Python - simple, powerful, and loved by everyone!",
      "You're the human equivalent of a successful deployment!"
    ],
    teglish: [
      "Nuvvu perfectly optimized code laga unnav - efficient, elegant, and absolutely brilliant!",
      "Nuvvu programming language aithe Python avutav - simple, powerful, and andaru love chestaru!",
      "Nuvvu successful deployment ki human equivalent ra!"
    ],
    higlish: [
      "Tu perfectly optimized code jaisa hai yaar - efficient, elegant, aur absolutely brilliant!",
      "Agar tu programming language hota toh Python hota - simple, powerful, aur sabko pasand!",
      "Tu successful deployment ka human equivalent hai bhai!"
    ]
  },
  
  astrology: {
    english: [
      "Your planetary alignment suggests a period of growth and prosperity ahead.",
      "The cosmic energies are favorable for new beginnings in your career.",
      "Your birth star indicates strong leadership qualities and creative potential."
    ],
    teglish: [
      "Mee planetary alignment chala bagundi, growth and prosperity vastundi ahead lo.",
      "Cosmic energies chala favorable ga unnai new beginnings kosam career lo.",
      "Mee birth star strong leadership qualities and creative potential ni indicate chestundi."
    ],
    higlish: [
      "Aapka planetary alignment bahut accha hai, growth aur prosperity aane wali hai ahead mein.",
      "Cosmic energies bahut favorable hain new beginnings ke liye career mein.",
      "Aapka birth star strong leadership qualities aur creative potential ko indicate karta hai."
    ]
  }
};

export const getLanguageExample = (category, language) => {
  if (languageExamples[category] && languageExamples[category][language]) {
    const examples = languageExamples[category][language];
    return examples[Math.floor(Math.random() * examples.length)];
  }
  return languageExamples[category]?.english?.[0] || "Example not available";
};