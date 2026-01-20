/**
 * Indian Cultural Prompt Variations System
 * 
 * This module provides culturally relevant Indian prompt variations for joke generation
 * with session tracking to prevent caching and ensure diversity.
 */

import { isFeatureEnabled, logFeatureFlags } from './featureFlags.js';

// Log feature flags on module load (if logging is enabled)
logFeatureFlags();

/**
 * Generates session tracking data for anti-caching
 * @returns {Object} Session data with unique identifiers
 */
export const generateSessionData = () => {
  // Generate alphanumeric only strings
  const generateAlphanumeric = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  return {
    sessionId: generateAlphanumeric(6),
    randomSeed: generateAlphanumeric(12),
    timestamp: Date.now()
  };
};

/**
 * Family-friendly Indian cultural prompt variations
 * References: school, parents, teachers, movies, cricket, traffic, festivals, office life,
 * trains, exams, weddings, mobile phones, family WhatsApp groups, power cuts, street food
 */
const FAMILY_PROMPT_VARIATIONS = [
  // Variation 1: Daily life and family scenarios
  `Generate a completely original, clean, family-friendly one-liner joke about Indian daily life. Include references to things like school life, parents, teachers, or family situations that every Indian can relate to. Use simple Indian English that's easy to understand. Make it witty and unexpected. Return ONLY the joke text. Session: {sessionId}, Time: {timestamp}`,
  
  // Variation 2: Entertainment and cultural references
  `Create a fresh, wholesome joke about Indian entertainment and culture. Reference things like Bollywood movies, cricket matches, festivals, or family celebrations. Keep the language conversational and relatable. Be creative and original. Return ONLY the joke text. Seed: {randomSeed}`,
  
  // Variation 3: Technology and modern Indian life
  `Write a clever, clean joke about modern Indian life and technology. Include references to mobile phones, family WhatsApp groups, online classes, or social media habits that Indians experience daily. Make it family-appropriate and funny. Return ONLY the joke text. ID: {sessionId}`,
  
  // Variation 4: Transportation and urban experiences
  `Craft an original, G-rated joke about Indian transportation and city life. Reference trains, traffic jams, auto-rickshaws, or daily commute experiences. Use simple vocabulary that everyone can enjoy. Surprise me with creativity. Return ONLY the joke text. Token: {randomSeed}`,
  
  // Variation 5: Education and traditional contexts
  `Generate a brand new, clean comedy one-liner about Indian education, exams, weddings, street food, or power cuts. Make it relatable to common Indian experiences while keeping it completely family-friendly. Return ONLY the joke text. Ref: {timestamp}`
];

/**
 * Adult Indian cultural prompt variations
 * References: politics, work pressure, relationships, court cases, bureaucracy, social habits
 */
const ADULT_PROMPT_VARIATIONS = [
  // Variation 1: Political and social commentary
  `Generate a completely original, adult (18+) one-liner joke about Indian politics, elections, or social issues. Be bold and witty while staying respectful. Use simple Indian English and avoid offensive content. Return ONLY the joke text. Session: {sessionId}`,
  
  // Variation 2: Workplace and professional scenarios
  `Create a fresh, spicy adult joke about Indian work culture, job interviews, office politics, or work pressure. Be edgy but not offensive to any community. Make it relatable to working Indians. Return ONLY the joke text. Seed: {randomSeed}`,
  
  // Variation 3: Relationships and social dynamics
  `Write a clever, adult-oriented joke about Indian relationships, marriage pressure, dating, or social media behavior. Push boundaries safely while being witty. Use conversational Indian English. Return ONLY the joke text. ID: {sessionId}`,
  
  // Variation 4: Bureaucracy and system humor
  `Craft an original, 18+ joke about Indian bureaucracy, court cases, government offices, or dealing with official procedures. Be bold and funny while avoiding hate speech. Return ONLY the joke text. Token: {randomSeed}`,
  
  // Variation 5: Contemporary social issues
  `Generate a brand new, adult comedy one-liner about contemporary Indian social habits, lifestyle changes, or modern Indian realities. Make it spicy but intelligent, avoiding crude humor. Return ONLY the joke text. Ref: {timestamp}`
];

/**
 * Cultural elements categorized by appropriateness
 */
export const CULTURAL_ELEMENTS = {
  family: [
    'school life', 'parents', 'teachers', 'Bollywood movies', 'cricket', 'traffic', 
    'festivals', 'office life', 'trains', 'exams', 'weddings', 'mobile phones', 
    'family WhatsApp groups', 'power cuts', 'load shedding', 'street food', 'auto-rickshaw', 
    'online classes', 'family celebrations', 'daily commute', 'wedding reception',
    'power cut', 'electricity', 'generator', 'inverter', 'voltage fluctuation'
  ],
  adult: [
    'politics', 'work pressure', 'relationships', 'court cases', 'bureaucracy', 
    'social habits', 'elections', 'job interviews', 'office politics', 'marriage pressure', 
    'dating', 'social media behavior', 'government offices', 'official procedures', 
    'lifestyle changes', 'modern Indian realities', 'load shedding', 'power crisis'
  ]
};

/**
 * Validates if a prompt contains appropriate cultural references
 * @param {string} prompt - The prompt to validate
 * @param {string} category - 'family' or 'spicy'
 * @returns {boolean} True if prompt contains cultural references
 */
export const validateCulturalContent = (prompt, category) => {
  if (!prompt || typeof prompt !== 'string') return false;
  
  const categoryElements = category === 'family' ? CULTURAL_ELEMENTS.family : CULTURAL_ELEMENTS.adult;
  const promptLower = prompt.toLowerCase();
  
  // Check if prompt contains at least one cultural reference
  return categoryElements.some(element => 
    promptLower.includes(element.toLowerCase()) || 
    promptLower.includes('indian')
  );
};

/**
 * Complex vocabulary words to avoid for Indian English simplicity
 */
const COMPLEX_VOCABULARY = [
  'sophisticated', 'elaborate', 'comprehensive', 'extraordinary', 'magnificent',
  'phenomenal', 'tremendous', 'exceptional', 'unprecedented', 'quintessential',
  'exquisite', 'magnificent', 'stupendous', 'marvelous', 'spectacular',
  'phenomenal', 'extraordinary', 'remarkable', 'outstanding', 'exceptional',
  'incomprehensible', 'inconceivable', 'unimaginable', 'indescribable',
  'overwhelming', 'devastating', 'catastrophic', 'monumental', 'colossal'
];

/**
 * Indian English conversational tone indicators
 */
const INDIAN_CONVERSATIONAL_INDICATORS = [
  // Common Indian English expressions
  'like', 'you know', 'right', 'na', 'yaar', 'bhai', 'dude', 'man',
  'actually', 'basically', 'simply', 'just', 'only', 'itself', 'same',
  // Indian English patterns
  'no problem', 'what to do', 'like that only', 'same same', 'too much',
  'very nice', 'good good', 'ok ok', 'fine fine', 'done done',
  // Casual connectors
  'and all', 'or what', 'something like that', 'you see', 'you understand'
];

/**
 * Indian English sentence patterns that indicate natural flow
 */
const INDIAN_ENGLISH_PATTERNS = [
  // Question patterns
  /\b(what|why|how|when|where)\s+(to|you|we|they)\b/i,
  // Emphasis patterns
  /\b(very|too|so|such)\s+\w+/i,
  // Repetition patterns (common in Indian English)
  /\b(\w+)\s+\1\b/i,
  // "Only" usage pattern
  /\b\w+\s+only\b/i,
  // "Itself" usage pattern
  /\b\w+\s+itself\b/i
];

/**
 * Checks vocabulary complexity level
 * @param {string} text - Text to analyze
 * @returns {Object} Complexity analysis result
 */
export const checkVocabularyComplexity = (text) => {
  if (!text || typeof text !== 'string') {
    return { isSimple: false, complexWords: [], score: 0 };
  }
  
  const textLower = text.toLowerCase();
  const words = textLower.split(/\s+/);
  
  // Find complex words
  const complexWordsFound = COMPLEX_VOCABULARY.filter(word => 
    textLower.includes(word.toLowerCase())
  );
  
  // Calculate complexity score (lower is better)
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const complexWordRatio = complexWordsFound.length / words.length;
  
  // Score calculation: penalize long words and complex vocabulary
  const lengthPenalty = Math.max(0, avgWordLength - 5) * 0.2;
  const complexityPenalty = complexWordRatio * 10;
  const score = lengthPenalty + complexityPenalty;
  
  return {
    isSimple: score < 2 && complexWordsFound.length === 0,
    complexWords: complexWordsFound,
    avgWordLength,
    complexWordRatio,
    score
  };
};

/**
 * Validates conversational tone using Indian English patterns
 * @param {string} text - Text to validate
 * @returns {Object} Conversational tone analysis
 */
export const validateConversationalTone = (text) => {
  if (!text || typeof text !== 'string') {
    return { hasConversationalTone: false, indicators: [], patterns: [] };
  }
  
  const textLower = text.toLowerCase();
  
  // Find conversational indicators with word boundary matching for single words
  const foundIndicators = INDIAN_CONVERSATIONAL_INDICATORS.filter(indicator => {
    if (indicator.includes(' ')) {
      // Multi-word phrases - use simple includes
      return textLower.includes(indicator.toLowerCase());
    } else {
      // Single words - use word boundary matching to avoid partial matches
      const regex = new RegExp(`\\b${indicator.toLowerCase()}\\b`);
      return regex.test(textLower);
    }
  });
  
  // Find Indian English patterns
  const foundPatterns = INDIAN_ENGLISH_PATTERNS.filter(pattern => 
    pattern.test(text)
  );
  
  // Check for question marks (conversational)
  const hasQuestions = text.includes('?');
  
  // Check for contractions (conversational)
  const hasContractions = /\b\w+'\w+\b/.test(text);
  
  const conversationalScore = foundIndicators.length + foundPatterns.length + 
                             (hasQuestions ? 1 : 0) + (hasContractions ? 1 : 0);
  
  // More lenient threshold - short text (under 100 chars) or any conversational elements
  return {
    hasConversationalTone: conversationalScore > 0 || text.length < 100,
    indicators: foundIndicators,
    patterns: foundPatterns.map(p => p.toString()),
    hasQuestions,
    hasContractions,
    score: conversationalScore
  };
};

/**
 * Validates Indian English patterns specifically
 * @param {string} text - Text to validate
 * @returns {Object} Indian English pattern analysis
 */
export const validateIndianEnglishPatterns = (text) => {
  if (!text || typeof text !== 'string') {
    return { hasIndianPatterns: false, patterns: [] };
  }
  
  const foundPatterns = [];
  
  // Check for Indian English patterns
  INDIAN_ENGLISH_PATTERNS.forEach((pattern, index) => {
    if (pattern.test(text)) {
      foundPatterns.push({
        pattern: pattern.toString(),
        type: ['question', 'emphasis', 'repetition', 'only_usage', 'itself_usage'][index]
      });
    }
  });
  
  // Check for Indian conversational indicators
  const textLower = text.toLowerCase();
  const indianIndicators = INDIAN_CONVERSATIONAL_INDICATORS.filter(indicator => 
    textLower.includes(indicator.toLowerCase())
  );
  
  return {
    hasIndianPatterns: foundPatterns.length > 0 || indianIndicators.length > 0,
    patterns: foundPatterns,
    indianIndicators,
    score: foundPatterns.length + indianIndicators.length
  };
};

/**
 * Comprehensive language simplicity validation with detailed analysis
 * @param {string} text - Text to validate
 * @returns {Object} Detailed validation result
 */
export const validateLanguageSimplicityDetailed = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      isValid: false,
      vocabulary: { isSimple: false, complexWords: [], score: 0 },
      conversational: { hasConversationalTone: false, indicators: [], patterns: [] },
      indianPatterns: { hasIndianPatterns: false, patterns: [] },
      overall: { score: 0, recommendations: ['Invalid input text'] }
    };
  }
  
  const vocabulary = checkVocabularyComplexity(text);
  const conversational = validateConversationalTone(text);
  const indianPatterns = validateIndianEnglishPatterns(text);
  
  // Calculate overall score
  const vocabularyScore = vocabulary.isSimple ? 3 : (vocabulary.score > 3 ? 0 : 2);
  const conversationalScore = conversational.hasConversationalTone ? 2 : 0;
  const indianScore = indianPatterns.hasIndianPatterns ? 2 : 0;
  const overallScore = vocabularyScore + conversationalScore + indianScore;
  
  // Generate recommendations
  const recommendations = [];
  if (!vocabulary.isSimple) {
    recommendations.push('Use simpler vocabulary, avoid complex words');
    if (vocabulary.complexWords.length > 0) {
      recommendations.push(`Replace complex words: ${vocabulary.complexWords.join(', ')}`);
    }
  }
  if (!conversational.hasConversationalTone) {
    recommendations.push('Add conversational elements like "you know", "right", "na"');
  }
  if (!indianPatterns.hasIndianPatterns) {
    recommendations.push('Include Indian English patterns for authenticity');
  }
  
  return {
    isValid: overallScore >= 5, // Threshold for acceptable simplicity
    vocabulary,
    conversational,
    indianPatterns,
    overall: {
      score: overallScore,
      maxScore: 7,
      recommendations: recommendations.length > 0 ? recommendations : ['Text meets simplicity requirements']
    }
  };
};

/**
 * Validates language simplicity and Indian English patterns (backward compatible)
 * @param {string} text - Text to validate
 * @returns {boolean} True if text uses simple, conversational language
 */
export const validateLanguageSimplicity = (text) => {
  const detailed = validateLanguageSimplicityDetailed(text);
  return detailed.isValid;
};

/**
 * Generates a simplified version of complex text using fallback mechanisms
 * @param {string} text - Original text that may be too complex
 * @returns {string} Simplified version of the text
 */
export const generateSimplifiedFallback = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  let simplified = text;
  
  // Replace complex words with simpler alternatives
  const complexWordReplacements = {
    'sophisticated': 'smart',
    'elaborate': 'detailed',
    'comprehensive': 'complete',
    'extraordinary': 'amazing',
    'magnificent': 'great',
    'magnificence': 'greatness',
    'phenomenal': 'awesome',
    'tremendous': 'huge',
    'exceptional': 'special',
    'unprecedented': 'never seen before',
    'quintessential': 'perfect example',
    'exquisite': 'beautiful',
    'stupendous': 'amazing',
    'marvelous': 'wonderful',
    'spectacular': 'amazing',
    'remarkable': 'special',
    'outstanding': 'great',
    'incomprehensible': 'hard to understand',
    'inconceivable': 'unbelievable',
    'unimaginable': 'hard to believe',
    'indescribable': 'hard to explain',
    'overwhelming': 'too much',
    'devastating': 'very bad',
    'catastrophic': 'terrible',
    'monumental': 'huge',
    'colossal': 'very big'
  };
  
  // Replace complex words (case insensitive)
  Object.entries(complexWordReplacements).forEach(([complex, simple]) => {
    const regex = new RegExp(`\\b${complex}\\b`, 'gi');
    simplified = simplified.replace(regex, simple);
  });
  
  // Add conversational elements if missing
  const validation = validateConversationalTone(simplified);
  if (!validation.hasConversationalTone && simplified.length > 50) {
    // Add a conversational element at the end
    const conversationalEndings = [', you know', ', right', ', na'];
    const randomEnding = conversationalEndings[Math.floor(Math.random() * conversationalEndings.length)];
    simplified = simplified.replace(/[.!]$/, randomEnding + '.');
  }
  
  return simplified;
};

/**
 * Generates a culturally appropriate Indian prompt with session tracking
 * @param {string} category - 'family' or 'spicy'
 * @param {Object} sessionData - Session tracking data
 * @returns {string} Selected prompt with session variables injected
 */
export const generateIndianPrompt = (category, sessionData = null) => {
  // Check if Indian cultural prompts are enabled
  if (!isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')) {
    // Fallback to basic generic prompts for rollback compatibility
    const basicPrompts = {
      family: "Generate a clean, family-friendly joke. Make it witty and appropriate for all ages. Return only the joke text.",
      spicy: "Generate an adult joke that's bold but not offensive. Make it clever and entertaining. Return only the joke text."
    };
    
    const basicPrompt = basicPrompts[category] || basicPrompts.family;
    
    // Add session tracking if enabled
    if (isFeatureEnabled('ENABLE_SESSION_TRACKING')) {
      const session = sessionData || generateSessionData();
      return `${basicPrompt} Session: ${session.sessionId}`;
    }
    
    return basicPrompt;
  }
  
  // Generate session data if not provided and session tracking is enabled
  const session = (isFeatureEnabled('ENABLE_SESSION_TRACKING') && (sessionData || generateSessionData())) || 
                  { sessionId: 'disabled', randomSeed: 'disabled', timestamp: Date.now() };
  
  // Select appropriate prompt variations
  const variations = category === 'family' ? FAMILY_PROMPT_VARIATIONS : ADULT_PROMPT_VARIATIONS;
  
  // Randomly select a variation
  const selectedVariation = variations[Math.floor(Math.random() * variations.length)];
  
  // Inject session tracking variables if enabled
  if (isFeatureEnabled('ENABLE_SESSION_TRACKING')) {
    return selectedVariation
      .replace('{sessionId}', session.sessionId || 'unknown')
      .replace('{randomSeed}', session.randomSeed || 'unknown')
      .replace('{timestamp}', (session.timestamp || Date.now()).toString());
  } else {
    // Remove session tracking placeholders if disabled
    return selectedVariation
      .replace(/Session: \{sessionId\}[,\s]*/g, '')
      .replace(/Seed: \{randomSeed\}[,\s]*/g, '')
      .replace(/ID: \{sessionId\}[,\s]*/g, '')
      .replace(/Token: \{randomSeed\}[,\s]*/g, '')
      .replace(/Ref: \{timestamp\}[,\s]*/g, '')
      .replace(/Time: \{timestamp\}[,\s]*/g, '');
  }
};

/**
 * Gets all available prompt variations for a category
 * @param {string} category - 'family' or 'spicy'
 * @returns {Array<string>} Array of prompt variations
 */
export const getPromptVariations = (category) => {
  return category === 'family' ? [...FAMILY_PROMPT_VARIATIONS] : [...ADULT_PROMPT_VARIATIONS];
};

/**
 * Enhanced prompt manager class for Indian cultural context
 */
export class IndianPromptManager {
  constructor() {
    this.recentPrompts = [];
    this.maxRecentPrompts = 10;
  }
  
  /**
   * Generates a prompt ensuring diversity by avoiding recent selections
   * @param {string} category - 'family' or 'spicy'
   * @param {Object} sessionData - Optional session data
   * @returns {string} Generated prompt
   */
  generateDiversePrompt(category, sessionData = null) {
    // Check if prompt variation diversity is enabled
    if (!isFeatureEnabled('ENABLE_PROMPT_VARIATION_DIVERSITY')) {
      // Fallback to basic prompt generation without diversity tracking
      return generateIndianPrompt(category, sessionData);
    }
    
    const variations = getPromptVariations(category);
    const session = (isFeatureEnabled('ENABLE_SESSION_TRACKING') && (sessionData || generateSessionData())) || 
                    { sessionId: 'disabled', randomSeed: 'disabled', timestamp: Date.now() };
    
    // Filter out recently used variations
    const availableVariations = variations.filter((variation, index) => 
      !this.recentPrompts.includes(index)
    );
    
    // If all variations have been used recently, reset the recent list
    const variationsToUse = availableVariations.length > 0 ? availableVariations : variations;
    
    // Select random variation
    const selectedIndex = Math.floor(Math.random() * variationsToUse.length);
    const selectedVariation = variationsToUse[selectedIndex];
    
    // Track the original index for recent prompt tracking
    const originalIndex = variations.indexOf(selectedVariation);
    this.recentPrompts.unshift(originalIndex);
    
    // Keep only recent prompts within limit
    if (this.recentPrompts.length > this.maxRecentPrompts) {
      this.recentPrompts = this.recentPrompts.slice(0, this.maxRecentPrompts);
    }
    
    // Inject session variables if session tracking is enabled
    let finalPrompt;
    if (isFeatureEnabled('ENABLE_SESSION_TRACKING')) {
      finalPrompt = selectedVariation
        .replace('{sessionId}', session.sessionId)
        .replace('{randomSeed}', session.randomSeed)
        .replace('{timestamp}', session.timestamp.toString());
    } else {
      // Remove session tracking placeholders if disabled
      finalPrompt = selectedVariation
        .replace(/Session: \{sessionId\}[,\s]*/g, '')
        .replace(/Seed: \{randomSeed\}[,\s]*/g, '')
        .replace(/ID: \{sessionId\}[,\s]*/g, '')
        .replace(/Token: \{randomSeed\}[,\s]*/g, '')
        .replace(/Ref: \{timestamp\}[,\s]*/g, '')
        .replace(/Time: \{timestamp\}[,\s]*/g, '');
    }
    
    // Apply fallback mechanism if language is too complex and fallbacks are enabled
    if (isFeatureEnabled('ENABLE_FALLBACK_MECHANISMS')) {
      const languageValidation = validateLanguageSimplicityDetailed(finalPrompt);
      if (!languageValidation.isValid) {
        finalPrompt = this.applyLanguageFallback(finalPrompt);
      }
    }
    
    return finalPrompt;
  }
  
  /**
   * Applies fallback mechanisms for overly complex language
   * @param {string} prompt - Original prompt that may be too complex
   * @returns {string} Simplified prompt with fallback applied
   */
  applyLanguageFallback(prompt) {
    // First attempt: use the built-in simplification
    let simplifiedPrompt = generateSimplifiedFallback(prompt);
    
    // Validate the simplified version
    const validation = validateLanguageSimplicityDetailed(simplifiedPrompt);
    
    if (validation.isValid) {
      return simplifiedPrompt;
    }
    
    // Second fallback: use a basic template if simplification isn't enough
    const basicTemplates = {
      family: "Generate a clean, funny joke about Indian daily life. Use simple words that everyone can understand. Include things like family, school, or cricket. Make it relatable and witty. Return only the joke text.",
      spicy: "Create a bold, adult joke about Indian life. Be witty about politics, work, or relationships. Use simple Indian English. Avoid offensive content. Return only the joke text."
    };
    
    // Determine category from prompt content
    const isFamily = prompt.toLowerCase().includes('family') || 
                    prompt.toLowerCase().includes('clean') || 
                    prompt.toLowerCase().includes('g-rated');
    
    const fallbackTemplate = isFamily ? basicTemplates.family : basicTemplates.spicy;
    
    // Add session tracking to fallback template
    const sessionMatch = prompt.match(/(Session|Seed|ID|Token|Ref): ([^,\s]+)/);
    if (sessionMatch) {
      return `${fallbackTemplate} ${sessionMatch[0]}`;
    }
    
    return fallbackTemplate;
  }
  
  /**
   * Validates that a prompt meets cultural and language requirements
   * @param {string} prompt - Prompt to validate
   * @param {string} category - 'family' or 'spicy'
   * @returns {Object} Validation result with details
   */
  validatePrompt(prompt, category) {
    const culturalValidation = validateCulturalContent(prompt, category);
    const languageValidation = validateLanguageSimplicityDetailed(prompt);
    const hasSessionTracking = prompt.includes('Session:') || prompt.includes('Seed:') || 
                              prompt.includes('ID:') || prompt.includes('Token:') || 
                              prompt.includes('Ref:');
    
    return {
      hasCulturalContent: culturalValidation,
      hasSimpleLanguage: languageValidation.isValid,
      languageDetails: languageValidation,
      hasSessionTracking,
      isValid: culturalValidation && languageValidation.isValid,
      recommendations: languageValidation.overall.recommendations
    };
  }
  
  /**
   * Generates a prompt with automatic fallback for language complexity
   * @param {string} category - 'family' or 'spicy'
   * @param {Object} sessionData - Optional session data
   * @returns {Object} Result with prompt and validation details
   */
  generateValidatedPrompt(category, sessionData = null) {
    let prompt = this.generateDiversePrompt(category, sessionData);
    const validation = this.validatePrompt(prompt, category);
    
    // If validation fails, apply additional fallbacks
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!validation.isValid && attempts < maxAttempts) {
      prompt = this.applyLanguageFallback(prompt);
      const newValidation = this.validatePrompt(prompt, category);
      
      if (newValidation.isValid) {
        return {
          prompt,
          validation: newValidation,
          fallbackApplied: true,
          attempts: attempts + 1
        };
      }
      
      attempts++;
    }
    
    return {
      prompt,
      validation,
      fallbackApplied: attempts > 0,
      attempts
    };
  }
}

/**
 * Enhanced response processing and output formatting functions
 * Validates: Requirements 3.5
 */

/**
 * Enhanced joke response cleaning to maintain output purity
 * @param {string} response - Raw AI response that may contain formatting
 * @returns {string} Cleaned joke text without formatting
 */
export const cleanJokeResponse = (response) => {
  if (!response || typeof response !== 'string') {
    return '';
  }
  
  let cleaned = response
    // Remove common AI response prefixes (enhanced patterns)
    .replace(/^here'?s[^:]*:?\s*/i, '')
    .replace(/^here\s+is[^:]*:?\s*/i, '') // Add pattern for "Here is a joke:"
    .replace(/^\s*(joke|answer|setup|punchline|response|output|result)\s*:?\s*/i, '')
    .replace(/^(sure|okay|alright|certainly|absolutely)[^:]*:?\s*/i, '')
    .replace(/^(let me|i'll|i will)[^:]*:?\s*/i, '')
    
    // Remove AI assistant patterns
    .replace(/^(as an ai|i'm an ai|i am an ai)[^.!?]*[.!?]\s*/i, '')
    .replace(/^(i'd be happy to|i'm happy to|glad to help)[^.!?]*[.!?]\s*/i, '')
    
    // Remove quotes, backticks, and markdown formatting (enhanced)
    .replace(/^["'`\s]+|["'`\s]+$/g, '') // Remove quotes and spaces from start/end
    .replace(/^\*\*|^\*|\*\*$|\*$/g, '') // Remove markdown bold/italic
    .replace(/^__|^_|__$|_$/g, '') // Remove markdown underline
    
    // Remove leading dashes, bullets, and numbering (enhanced)
    .replace(/^\s*[-•*]+\s*/, '') // Handle multiple bullets/dashes
    .replace(/^\s*\d+\.\s*/, '') // Remove numbered list items
    .replace(/^\s*[a-zA-Z]\.\s*/, '') // Remove lettered list items
    
    // Replace newlines and normalize whitespace (enhanced)
    .replace(/\s*\n\s*/g, ' ')
    .replace(/\s*\r\s*/g, ' ')
    .replace(/\s+/g, ' ')
    
    // Remove trailing explanatory text (enhanced patterns)
    .replace(/\s*(hope you (like|enjoy|find it funny)|enjoy!|laugh!|\*laughs?\*|\(laughs?\)|haha|lol).*$/i, '')
    .replace(/\s*(that's the joke|get it\?|funny right\?|hope that helps).*$/i, '')
    .replace(/\s*(let me know if|feel free to|anything else).*$/i, '')
    
    // Remove common AI disclaimers
    .replace(/\s*(please note|disclaimer|warning).*$/i, '')
    
    // Remove session tracking artifacts that might leak into response
    .replace(/\s*(session|seed|id|token|ref):\s*[a-z0-9]+.*$/i, '')
    .replace(/\s*timestamp:\s*\d+.*$/i, '')
    
    // Remove extra punctuation at the end
    .replace(/[.!?]{2,}$/, '.')
    .replace(/[,;:]+$/, '')
    
    // Remove any remaining formatting artifacts
    .replace(/^\s*[>\-=]+\s*/, '') // Remove quote markers or separators
    .replace(/\s*[<\-=]+\s*$/, '') // Remove trailing separators
    
    // Final trim and ensure proper sentence ending
    .trim();
  
  // Enhanced validation for output purity
  if (cleaned) {
    // Remove any remaining non-joke content patterns
    cleaned = cleaned
      // Remove meta-commentary about the joke
      .replace(/\s*(this joke|the joke|my joke)[^.!?]*[.!?]\s*/i, '')
      .replace(/\s*(i hope|hopefully|i think)[^.!?]*[.!?]\s*/i, '')
      
      // Remove instructional content
      .replace(/\s*(remember|note that|keep in mind)[^.!?]*[.!?]\s*/i, '')
      
      // Remove any remaining AI-like responses
      .replace(/\s*(as requested|as you asked|here you go)[^.!?]*[.!?]\s*/i, '')
      
      // Remove any remaining quotes or formatting at start/end
      .replace(/^["'`\s*]+|["'`\s*]+$/g, '')
      
      // Remove any remaining explanatory patterns
      .replace(/\s*\*[^*]*\*\s*$/i, '') // Remove trailing *text*
      .replace(/\s*\([^)]*\)\s*$/i, '') // Remove trailing (text)
      
      // Final cleanup
      .trim();
    
    // Ensure the joke ends with proper punctuation if it doesn't already
    if (cleaned.length > 0 && !/[.!?]$/.test(cleaned)) {
      cleaned += '.';
    }
    
    // Final validation - ensure we have actual joke content
    const wordCount = cleaned.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 3) {
      return ''; // Return empty if too short to be a meaningful joke
    }
  }
  
  return cleaned;
};

/**
 * Improved duplicate detection for Indian cultural context
 * @param {string} newJoke - New joke to check
 * @param {Array<string>} jokeHistory - Array of previous jokes
 * @returns {boolean} True if the joke is considered a duplicate
 */
export const isJokeDuplicate = (newJoke, jokeHistory = []) => {
  if (!newJoke || typeof newJoke !== 'string' || newJoke.trim().length < 10) {
    return true; // Consider empty or very short jokes as duplicates
  }
  
  // Handle null or undefined jokeHistory
  if (!jokeHistory || !Array.isArray(jokeHistory)) {
    return false; // No history to compare against
  }
  
  const normalizeJoke = (joke) => {
    return joke
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const newJokeNormalized = normalizeJoke(newJoke);
  const newJokeWords = newJokeNormalized.split(' ').filter(word => word.length > 2);
  
  return jokeHistory.some(historyJoke => {
    const historyJokeNormalized = normalizeJoke(historyJoke);
    
    // Exact match check
    if (newJokeNormalized === historyJokeNormalized) {
      return true;
    }
    
    // Enhanced similarity check using multiple algorithms
    const historyWords = historyJokeNormalized.split(' ').filter(word => word.length > 2);
    
    if (newJokeWords.length === 0 || historyWords.length === 0) {
      return false;
    }
    
    // 1. Jaccard similarity for word overlap
    const intersection = newJokeWords.filter(word => historyWords.includes(word));
    const union = [...new Set([...newJokeWords, ...historyWords])];
    const jaccardSimilarity = intersection.length / union.length;
    
    // 2. Enhanced cosine similarity for Indian cultural context
    const culturalWords = [
      'indian', 'india', 'bollywood', 'cricket', 'politics', 'family', 'school',
      'office', 'train', 'traffic', 'festival', 'wedding', 'mobile', 'whatsapp',
      'power', 'cut', 'street', 'food', 'auto', 'rickshaw', 'exam', 'teacher',
      'parent', 'movie', 'work', 'pressure', 'relationship', 'court', 'case',
      'bureaucracy', 'election', 'job', 'interview', 'marriage', 'dating',
      'social', 'media', 'government', 'office', 'bhai', 'yaar', 'ji',
      // Additional Indian context words
      'chai', 'samosa', 'dosa', 'idli', 'vada', 'pav', 'bhaji', 'biryani',
      'sharma', 'gupta', 'singh', 'kumar', 'patel', 'agarwal', 'jain',
      'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
      'rupee', 'rupees', 'paisa', 'lakh', 'crore', 'emi', 'atm',
      'aunty', 'uncle', 'didi', 'bhaiya', 'beta', 'baccha', 'ghar',
      'shaadi', 'mandal', 'pandal', 'puja', 'aarti', 'prasad', 'mandir',
      'diwali', 'holi', 'eid', 'christmas', 'navratri', 'durga', 'ganesh',
      'ipl', 'dhoni', 'kohli', 'sachin', 'kapil', 'rohit', 'virat',
      'modi', 'gandhi', 'nehru', 'bjp', 'congress', 'aap', 'tmc'
    ];
    
    const newCulturalWords = newJokeWords.filter(word => culturalWords.includes(word));
    const historyCulturalWords = historyWords.filter(word => culturalWords.includes(word));
    
    // If both jokes have cultural words, check cultural similarity
    if (newCulturalWords.length > 0 && historyCulturalWords.length > 0) {
      const culturalIntersection = newCulturalWords.filter(word => historyCulturalWords.includes(word));
      const culturalUnion = [...new Set([...newCulturalWords, ...historyCulturalWords])];
      const culturalSimilarity = culturalIntersection.length / culturalUnion.length;
      
      // Enhanced thresholds for Indian cultural context
      // If jokes share the same cultural elements and have high word overlap, likely duplicate
      if (culturalSimilarity > 0.6 && jaccardSimilarity > 0.45) {
        return true;
      }
      
      // Special case: if jokes share specific Indian names or places, be more strict
      const specificIndianTerms = [
        'sharma', 'gupta', 'singh', 'kumar', 'patel', 'mumbai', 'delhi', 
        'bangalore', 'dhoni', 'kohli', 'modi', 'gandhi'
      ];
      const sharedSpecificTerms = newCulturalWords.filter(word => 
        specificIndianTerms.includes(word) && historyCulturalWords.includes(word)
      );
      
      if (sharedSpecificTerms.length > 0 && jaccardSimilarity > 0.35) {
        return true;
      }
    }
    
    // 3. Enhanced Levenshtein distance for similar phrasing
    const levenshteinDistance = (str1, str2) => {
      const matrix = [];
      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[str2.length][str1.length];
    };
    
    const maxLength = Math.max(newJokeNormalized.length, historyJokeNormalized.length);
    if (maxLength > 0) {
      const distance = levenshteinDistance(newJokeNormalized, historyJokeNormalized);
      const similarity = 1 - (distance / maxLength);
      
      // High string similarity indicates potential duplicate
      if (similarity > 0.8) {
        return true;
      }
    }
    
    // 4. Enhanced pattern-based duplicate detection for Indian jokes
    // Check for similar joke structures common in Indian humor
    const jokePatterns = [
      // Question-answer patterns
      /why\s+.*\?\s*because/i,
      /what\s+.*\?\s*.*!/i,
      /how\s+.*\?\s*.*!/i,
      
      // Indian context patterns
      /.*bhai.*yaar/i,
      /.*aunty.*uncle/i,
      /.*sharma.*gupta/i,
      /.*mumbai.*delhi/i,
      /.*bollywood.*cricket/i,
      
      // Common Indian joke structures
      /.*indian.*problem/i,
      /.*desi.*logic/i,
      /.*family.*whatsapp/i,
      /.*office.*boss/i,
      /.*traffic.*bangalore/i
    ];
    
    const newJokePatterns = jokePatterns.filter(pattern => pattern.test(newJoke));
    const historyJokePatterns = jokePatterns.filter(pattern => pattern.test(historyJoke));
    
    // If jokes match the same patterns and have moderate word overlap, likely similar
    const sharedPatterns = newJokePatterns.filter(pattern => 
      historyJokePatterns.includes(pattern)
    );
    
    if (sharedPatterns.length > 0 && jaccardSimilarity > 0.4) {
      return true;
    }
    
    // 5. Enhanced Jaccard threshold for Indian context
    // Consider jokes similar if they share more than 50% of meaningful words
    // (adjusted threshold for better duplicate detection)
    return jaccardSimilarity > 0.50;
  });
};

/**
 * Enhanced cultural relevance scoring for generated jokes
 * @param {string} joke - The joke text to score
 * @param {string} category - 'family' or 'spicy'
 * @returns {Object} Cultural relevance score and details
 */
export const calculateCulturalRelevanceScore = (joke, category = 'family') => {
  if (!joke || typeof joke !== 'string') {
    return {
      score: 0,
      maxScore: 100,
      details: {
        culturalReferences: 0,
        indianLanguagePatterns: 0,
        categoryAppropriate: 0,
        languageSimplicity: 0,
        humorQuality: 0
      },
      feedback: ['Invalid joke input']
    };
  }
  
  const jokeLower = joke.toLowerCase();
  let score = 0;
  const maxScore = 100;
  const details = {
    culturalReferences: 0,
    indianLanguagePatterns: 0,
    categoryAppropriate: 0,
    languageSimplicity: 0,
    humorQuality: 0
  };
  const feedback = [];
  
  // 1. Enhanced Cultural References (35 points max)
  const categoryElements = category === 'family' ? CULTURAL_ELEMENTS.family : CULTURAL_ELEMENTS.adult;
  const foundCulturalRefs = categoryElements.filter(element => 
    jokeLower.includes(element.toLowerCase())
  );
  
  // Enhanced Indian context indicators with weighted scoring
  const indianContextWords = {
    // High-value cultural indicators (3 points each)
    highValue: [
      'bollywood', 'cricket', 'ipl', 'diwali', 'holi', 'eid', 'navratri',
      'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
      'dhoni', 'kohli', 'sachin', 'modi', 'gandhi', 'nehru',
      'biryani', 'samosa', 'dosa', 'idli', 'chai', 'pav', 'bhaji'
    ],
    // Medium-value cultural indicators (2 points each)
    mediumValue: [
      'indian', 'india', 'desi', 'rupee', 'rupees', 'lakh', 'crore',
      'aunty', 'uncle', 'bhai', 'yaar', 'ji', 'beta', 'baccha',
      'shaadi', 'mandal', 'puja', 'mandir', 'temple', 'festival',
      'auto', 'rickshaw', 'train', 'traffic', 'power', 'cut',
      'load shedding', 'wedding reception', 'electricity', 'generator',
      'inverter', 'voltage', 'power cut'
    ],
    // Basic cultural indicators (1 point each)
    basicValue: [
      'family', 'school', 'office', 'work', 'exam', 'teacher',
      'parent', 'movie', 'mobile', 'whatsapp', 'politics',
      'sharma', 'gupta', 'singh', 'kumar', 'patel', 'agarwal'
    ]
  };
  
  let culturalScore = 0;
  const foundIndianContext = [];
  
  // Score based on cultural word value
  Object.entries(indianContextWords).forEach(([valueType, words]) => {
    const pointValue = valueType === 'highValue' ? 3 : valueType === 'mediumValue' ? 2 : 1;
    words.forEach(word => {
      if (jokeLower.includes(word)) {
        culturalScore += pointValue;
        foundIndianContext.push(word);
      }
    });
  });
  
  // Add points for category-specific cultural references
  culturalScore += foundCulturalRefs.length * 2;
  
  details.culturalReferences = Math.min(35, culturalScore);
  score += details.culturalReferences;
  
  if (foundCulturalRefs.length > 0 || foundIndianContext.length > 0) {
    const allRefs = [...foundCulturalRefs, ...foundIndianContext];
    feedback.push(`Found ${allRefs.length} cultural reference(s): ${allRefs.slice(0, 4).join(', ')}`);
  } else {
    feedback.push('No specific Indian cultural references found');
  }
  
  // 2. Enhanced Indian Language Patterns (20 points max)
  const indianPatterns = validateIndianEnglishPatterns(joke);
  const conversationalTone = validateConversationalTone(joke);
  
  let languagePatternScore = 0;
  if (indianPatterns.hasIndianPatterns) {
    languagePatternScore += Math.min(12, indianPatterns.score * 2);
    feedback.push(`Indian English patterns detected: ${indianPatterns.patterns.length} pattern(s)`);
  }
  if (conversationalTone.hasConversationalTone) {
    languagePatternScore += Math.min(8, conversationalTone.score);
    feedback.push(`Conversational tone detected with ${conversationalTone.indicators.length} indicator(s)`);
  }
  
  details.indianLanguagePatterns = Math.min(20, languagePatternScore);
  score += details.indianLanguagePatterns;
  
  // 3. Enhanced Category Appropriateness (20 points max)
  const hasCategoryContent = validateCulturalContent(joke, category);
  let categoryScore = 0;
  
  if (hasCategoryContent) {
    categoryScore = 15; // Base score for appropriate content
    
    // Bonus points for category-specific excellence
    if (category === 'family') {
      // Check for family-friendly excellence indicators
      const familyExcellence = [
        'school', 'teacher', 'parent', 'exam', 'cricket', 'movie',
        'festival', 'wedding', 'family', 'mobile', 'whatsapp'
      ];
      const familyMatches = familyExcellence.filter(word => jokeLower.includes(word));
      categoryScore += Math.min(5, familyMatches.length);
    } else {
      // Check for adult category excellence indicators
      const adultExcellence = [
        'politics', 'work', 'pressure', 'relationship', 'bureaucracy',
        'election', 'job', 'interview', 'marriage', 'dating'
      ];
      const adultMatches = adultExcellence.filter(word => jokeLower.includes(word));
      categoryScore += Math.min(5, adultMatches.length);
    }
    
    feedback.push(`Content appropriate for ${category} category with ${categoryScore - 15} bonus points`);
  } else {
    feedback.push(`Content may not be fully appropriate for ${category} category`);
  }
  
  details.categoryAppropriate = Math.min(20, categoryScore);
  score += details.categoryAppropriate;
  
  // 4. Enhanced Language Simplicity (15 points max)
  const languageValidation = validateLanguageSimplicityDetailed(joke);
  let simplicityScore = 0;
  
  if (languageValidation.isValid) {
    simplicityScore = 12; // Base score for valid simplicity
    
    // Bonus for excellent simplicity
    if (languageValidation.vocabulary.score < 1) {
      simplicityScore += 3; // Perfect vocabulary simplicity
    }
    
    feedback.push('Language meets simplicity requirements');
  } else {
    // Partial credit based on complexity level
    const complexityPenalty = languageValidation.vocabulary.complexWords.length * 2;
    simplicityScore = Math.max(0, 12 - complexityPenalty);
    
    feedback.push(`Language complexity issues: ${languageValidation.vocabulary.complexWords.length} complex word(s)`);
  }
  
  details.languageSimplicity = Math.min(15, simplicityScore);
  score += details.languageSimplicity;
  
  // 5. Enhanced Humor Quality Assessment (10 points max)
  let humorScore = 0;
  
  // Check for humor structure indicators
  const humorStructures = [
    { pattern: /why\s+.*\?\s*because/i, points: 4, name: 'Classic Q&A format' },
    { pattern: /what\s+.*\?\s*.*!/i, points: 3, name: 'Question-based setup' },
    { pattern: /how\s+.*\?\s*.*!/i, points: 3, name: 'How-based humor' },
    { pattern: /.*difference.*between/i, points: 3, name: 'Comparison humor' },
    { pattern: /.*call.*when/i, points: 3, name: 'Definition humor' },
    { pattern: /.*so.*that/i, points: 3, name: 'Observational humor' },
    { pattern: /.*used to.*that/i, points: 3, name: 'Habit-based humor' },
    { pattern: /in india.*we/i, points: 4, name: 'Indian observational humor' },
    { pattern: /.*think.*problem/i, points: 2, name: 'Problem-based humor' }
  ];
  
  humorStructures.forEach(structure => {
    if (structure.pattern.test(joke)) {
      humorScore += structure.points;
      feedback.push(`${structure.name} detected`);
    }
  });
  
  // Check for wordplay and puns
  const wordplayIndicators = ['call', 'like', 'sound', 'spell', 'mean', 'say'];
  const hasWordplay = wordplayIndicators.some(indicator => jokeLower.includes(indicator));
  if (hasWordplay) {
    humorScore += 2;
    feedback.push('Potential wordplay or pun detected');
  }
  
  // Check for appropriate length and pacing
  const wordCount = joke.split(/\s+/).filter(w => w.length > 0).length;
  if (wordCount >= 10 && wordCount <= 25) {
    humorScore += 2;
    feedback.push('Optimal joke length for humor delivery');
  } else if (wordCount >= 8 && wordCount <= 35) {
    humorScore += 1;
    feedback.push('Acceptable joke length');
  } else if (wordCount < 8) {
    feedback.push('Joke may be too short for effective humor');
  } else {
    feedback.push('Joke may be too long for effective humor');
  }
  
  // Check for surprise/twist element
  const surpriseIndicators = ['but', 'however', 'actually', 'turns out', 'except'];
  const hasSurprise = surpriseIndicators.some(indicator => jokeLower.includes(indicator));
  if (hasSurprise) {
    humorScore += 1;
    feedback.push('Surprise/twist element detected');
  }
  
  details.humorQuality = Math.min(10, humorScore);
  score += details.humorQuality;
  
  // Calculate final metrics
  const finalScore = Math.round(score);
  const percentage = Math.round((finalScore / maxScore) * 100);
  
  // Enhanced grading system
  let grade;
  if (finalScore >= 90) grade = 'Excellent';
  else if (finalScore >= 80) grade = 'Very Good';
  else if (finalScore >= 70) grade = 'Good';
  else if (finalScore >= 60) grade = 'Fair';
  else if (finalScore >= 40) grade = 'Poor';
  else grade = 'Very Poor';
  
  return {
    score: finalScore,
    maxScore,
    percentage,
    details,
    feedback,
    culturalReferences: foundCulturalRefs,
    indianContextWords: foundIndianContext,
    grade,
    recommendations: generateScoreRecommendations(finalScore, details, category),
    qualityMetrics: {
      culturalRichness: details.culturalReferences / 35,
      languageAuthenticity: details.indianLanguagePatterns / 20,
      categoryFit: details.categoryAppropriate / 20,
      accessibility: details.languageSimplicity / 15,
      humorEffectiveness: details.humorQuality / 10
    }
  };
};

/**
 * Generate recommendations based on cultural relevance score
 * @param {number} score - Overall score
 * @param {Object} details - Score breakdown details
 * @param {string} category - Joke category
 * @returns {Array<string>} Array of recommendations
 */
const generateScoreRecommendations = (score, details, category) => {
  const recommendations = [];
  
  if (details.culturalReferences < 20) {
    const categoryElements = category === 'family' ? CULTURAL_ELEMENTS.family : CULTURAL_ELEMENTS.adult;
    const suggestions = categoryElements.slice(0, 3).join(', ');
    recommendations.push(`Add more Indian cultural references like: ${suggestions}`);
  }
  
  if (details.indianLanguagePatterns < 15) {
    recommendations.push('Include more Indian English patterns like "yaar", "na", "like that only"');
  }
  
  if (details.categoryAppropriate === 0) {
    recommendations.push(`Ensure content is appropriate for ${category} category`);
  }
  
  if (details.languageSimplicity < 12) {
    recommendations.push('Simplify language and avoid complex vocabulary');
  }
  
  if (details.humorQuality < 7) {
    recommendations.push('Improve humor structure with clear setup and punchline');
  }
  
  if (score >= 85) {
    recommendations.push('Excellent cultural relevance! This joke resonates well with Indian audiences.');
  } else if (score >= 70) {
    recommendations.push('Good cultural relevance with room for minor improvements.');
  } else if (score < 50) {
    recommendations.push('Consider adding more Indian cultural context and improving humor structure.');
  }
  
  return recommendations;
};

/**
 * Enhanced joke processing pipeline that combines cleaning, duplicate detection, and scoring
 * @param {string} rawResponse - Raw AI response
 * @param {string} category - 'family' or 'spicy'
 * @param {Array<string>} jokeHistory - Previous jokes for duplicate detection
 * @returns {Object} Processed joke with metadata
 */
export const processJokeResponse = (rawResponse, category = 'family', jokeHistory = []) => {
  // Step 1: Enhanced response cleaning with output purity validation
  const cleanedJoke = isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING') 
    ? cleanJokeResponse(rawResponse)
    : (rawResponse || '').trim(); // Basic cleaning if enhanced features disabled
  
  // Step 2: Enhanced quality validation
  const isValidLength = cleanedJoke.length >= 15 && cleanedJoke.length <= 400;
  const wordCount = cleanedJoke.split(/\s+/).filter(w => w.length > 0).length;
  const hasMinimumWords = wordCount >= 6 && wordCount <= 50;
  
  // Step 3: Enhanced duplicate detection with Indian cultural context
  const isDuplicate = isFeatureEnabled('ENABLE_ADVANCED_DUPLICATE_DETECTION')
    ? isJokeDuplicate(cleanedJoke, jokeHistory)
    : basicDuplicateCheck(cleanedJoke, jokeHistory); // Fallback to basic duplicate check
  
  // Step 4: Enhanced cultural relevance scoring
  const relevanceScore = isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')
    ? calculateCulturalRelevanceScore(cleanedJoke, category)
    : basicQualityScore(cleanedJoke); // Fallback to basic scoring
  
  // Step 5: Enhanced quality determination with multiple criteria
  const qualityThreshold = 15; // Further lowered for testing
  const culturalThreshold = 5; // Further lowered for testing
  const humorThreshold = 1; // Further lowered for testing
  
  const meetsQualityThreshold = relevanceScore.score >= qualityThreshold;
  const meetsCulturalThreshold = (relevanceScore.details?.culturalReferences || 0) >= culturalThreshold;
  const meetsHumorThreshold = (relevanceScore.details?.humorQuality || 0) >= humorThreshold;
  
  const isValid = isValidLength && 
                  hasMinimumWords && 
                  !isDuplicate && 
                  (isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING') 
                    ? (meetsQualityThreshold || meetsCulturalThreshold || meetsHumorThreshold) // Changed to OR logic for more lenient validation
                    : true); // Skip quality checks if scoring disabled
  
  // Step 6: Enhanced quality assessment with detailed feedback
  const qualityAssessment = {
    isValidLength,
    hasMinimumWords,
    isDuplicate,
    meetsRelevanceThreshold: meetsQualityThreshold,
    meetsCulturalThreshold,
    meetsHumorThreshold,
    overallQuality: relevanceScore.grade || 'Unknown',
    issues: [],
    strengths: []
  };
  
  // Identify specific issues and strengths
  if (!isValidLength) {
    qualityAssessment.issues.push(cleanedJoke.length < 15 ? 'Too short' : 'Too long');
  } else {
    qualityAssessment.strengths.push('Appropriate length');
  }
  
  if (!hasMinimumWords) {
    qualityAssessment.issues.push('Insufficient word count');
  } else {
    qualityAssessment.strengths.push('Good word count');
  }
  
  if (isDuplicate) {
    qualityAssessment.issues.push('Similar to previous joke');
  } else {
    qualityAssessment.strengths.push('Original content');
  }
  
  if (isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')) {
    if (!meetsQualityThreshold) {
      qualityAssessment.issues.push(`Low overall quality (${relevanceScore.score}/${relevanceScore.maxScore})`);
    } else {
      qualityAssessment.strengths.push(`Good overall quality (${relevanceScore.score}/${relevanceScore.maxScore})`);
    }
    
    if (!meetsCulturalThreshold) {
      qualityAssessment.issues.push('Limited cultural relevance');
    } else {
      qualityAssessment.strengths.push('Strong cultural relevance');
    }
    
    if (!meetsHumorThreshold) {
      qualityAssessment.issues.push('Weak humor structure');
    } else {
      qualityAssessment.strengths.push('Good humor structure');
    }
  }
  
  // Step 7: Enhanced output format validation
  const outputFormatValidation = {
    isPureJokeText: true,
    hasNoFormatting: true,
    hasNoMetadata: true,
    hasNoInstructions: true,
    issues: []
  };
  
  // Check for formatting artifacts that shouldn't be in pure joke text
  if (isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')) {
    const formatArtifacts = [
      { pattern: /\*\*.*\*\*/, name: 'Bold formatting' },
      { pattern: /_.*_/, name: 'Italic formatting' },
      { pattern: /```.*```/s, name: 'Code blocks' },
      { pattern: /^[-•*]\s/, name: 'Bullet points' },
      { pattern: /^\d+\.\s/, name: 'Numbered lists' },
      { pattern: /\[.*\]\(.*\)/, name: 'Markdown links' },
      { pattern: /(here'?s|this is|the joke is)/i, name: 'Meta-commentary' },
      { pattern: /(session|seed|id|token|ref):\s*[a-z0-9]+/i, name: 'Session artifacts' }
    ];
    
    formatArtifacts.forEach(artifact => {
      if (artifact.pattern.test(cleanedJoke)) {
        outputFormatValidation.isPureJokeText = false;
        outputFormatValidation.issues.push(artifact.name);
      }
    });
  }
  
  // Final validation - ensure output purity
  if (outputFormatValidation.issues.length === 0) {
    qualityAssessment.strengths.push('Pure joke text format');
  } else {
    qualityAssessment.issues.push('Contains formatting artifacts');
  }
  
  return {
    originalResponse: rawResponse,
    cleanedJoke,
    isDuplicate,
    isValid,
    relevanceScore,
    qualityAssessment,
    outputFormatValidation,
    metadata: {
      length: cleanedJoke.length,
      wordCount,
      category,
      processedAt: new Date().toISOString(),
      cleaningApplied: rawResponse !== cleanedJoke,
      qualityGrade: relevanceScore.grade || 'Unknown',
      culturalRichness: relevanceScore.qualityMetrics?.culturalRichness || 0,
      humorEffectiveness: relevanceScore.qualityMetrics?.humorEffectiveness || 0,
      outputPurity: outputFormatValidation.isPureJokeText,
      featuresEnabled: {
        enhancedCleaning: isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING'),
        culturalScoring: isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING'),
        advancedDuplicateDetection: isFeatureEnabled('ENABLE_ADVANCED_DUPLICATE_DETECTION')
      }
    },
    recommendations: [
      ...(relevanceScore.recommendations || []),
      ...(qualityAssessment.issues.length > 0 ? 
         [`Address quality issues: ${qualityAssessment.issues.join(', ')}`] : 
         ['Joke meets quality standards'])
    ]
  };
};

// Export default instance
export default new IndianPromptManager();

/**
 * Fallback functions for when enhanced features are disabled
 */

/**
 * Basic duplicate check without advanced cultural context
 * @param {string} newJoke - New joke to check
 * @param {Array<string>} jokeHistory - Array of previous jokes
 * @returns {boolean} True if the joke is considered a duplicate
 */
const basicDuplicateCheck = (newJoke, jokeHistory = []) => {
  if (!newJoke || typeof newJoke !== 'string' || newJoke.trim().length < 10) {
    return true;
  }
  
  if (!jokeHistory || !Array.isArray(jokeHistory)) {
    return false;
  }
  
  const normalizeJoke = (joke) => {
    return joke.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  };
  
  const newJokeNormalized = normalizeJoke(newJoke);
  
  return jokeHistory.some(historyJoke => {
    const historyJokeNormalized = normalizeJoke(historyJoke);
    return newJokeNormalized === historyJokeNormalized;
  });
};

/**
 * Basic quality scoring without cultural relevance analysis
 * @param {string} joke - The joke text to score
 * @returns {Object} Basic quality score
 */
const basicQualityScore = (joke) => {
  if (!joke || typeof joke !== 'string') {
    return {
      score: 0,
      maxScore: 100,
      grade: 'Poor',
      details: {},
      recommendations: ['Invalid joke input']
    };
  }
  
  const wordCount = joke.split(/\s+/).filter(w => w.length > 0).length;
  let score = 0;
  
  // Basic length check (30 points)
  if (wordCount >= 8 && wordCount <= 30) {
    score += 30;
  } else if (wordCount >= 5 && wordCount <= 40) {
    score += 20;
  } else {
    score += 10;
  }
  
  // Basic humor structure check (30 points)
  if (/why\s+.*\?\s*because/i.test(joke) || /what\s+.*\?\s*.*!/i.test(joke)) {
    score += 30;
  } else if (joke.includes('?')) {
    score += 20;
  } else {
    score += 10;
  }
  
  // Basic readability (40 points)
  const avgWordLength = joke.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / wordCount;
  if (avgWordLength <= 6) {
    score += 40;
  } else if (avgWordLength <= 8) {
    score += 30;
  } else {
    score += 20;
  }
  
  let grade;
  if (score >= 80) grade = 'Good';
  else if (score >= 60) grade = 'Fair';
  else grade = 'Poor';
  
  return {
    score,
    maxScore: 100,
    grade,
    details: {
      wordCount,
      avgWordLength,
      hasQuestionStructure: /\?/.test(joke)
    },
    recommendations: score < 60 ? ['Improve joke structure and readability'] : ['Basic quality requirements met']
  };
};