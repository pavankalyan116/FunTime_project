/**
 * Feature Flags for Indian Jokes Localization
 * 
 * This module provides feature flags for rollback capability and gradual feature deployment.
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 */

/**
 * Feature flag configuration
 * Set to false to disable enhanced features and rollback to original behavior
 */
export const FEATURE_FLAGS = {
  // Main feature flag for Indian cultural prompts
  ENABLE_INDIAN_CULTURAL_PROMPTS: true,
  
  // Enhanced response processing features
  ENABLE_ENHANCED_RESPONSE_CLEANING: true,
  ENABLE_CULTURAL_RELEVANCE_SCORING: true,
  ENABLE_ADVANCED_DUPLICATE_DETECTION: true,
  
  // Language processing features
  ENABLE_LANGUAGE_SIMPLICITY_VALIDATION: true,
  ENABLE_INDIAN_ENGLISH_PATTERNS: true,
  ENABLE_FALLBACK_MECHANISMS: true,
  
  // Session tracking and anti-caching
  ENABLE_SESSION_TRACKING: true,
  ENABLE_PROMPT_VARIATION_DIVERSITY: true,
  
  // Development and debugging features
  ENABLE_DETAILED_LOGGING: false,
  ENABLE_PERFORMANCE_MONITORING: false
};

/**
 * Checks if a feature is enabled
 * @param {string} featureName - Name of the feature flag
 * @returns {boolean} True if feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return FEATURE_FLAGS[featureName] === true;
};

/**
 * Enables a feature flag
 * @param {string} featureName - Name of the feature flag
 */
export const enableFeature = (featureName) => {
  if (featureName in FEATURE_FLAGS) {
    FEATURE_FLAGS[featureName] = true;
  }
};

/**
 * Disables a feature flag
 * @param {string} featureName - Name of the feature flag
 */
export const disableFeature = (featureName) => {
  if (featureName in FEATURE_FLAGS) {
    FEATURE_FLAGS[featureName] = false;
  }
};

/**
 * Gets all feature flags and their current state
 * @returns {Object} Object containing all feature flags
 */
export const getAllFeatureFlags = () => {
  return { ...FEATURE_FLAGS };
};

/**
 * Resets all feature flags to their default enabled state
 */
export const resetFeatureFlagsToDefault = () => {
  Object.keys(FEATURE_FLAGS).forEach(key => {
    // Most features default to enabled, except debugging features
    FEATURE_FLAGS[key] = !key.includes('LOGGING') && !key.includes('MONITORING');
  });
};

/**
 * Disables all enhanced features for complete rollback
 */
export const disableAllEnhancedFeatures = () => {
  Object.keys(FEATURE_FLAGS).forEach(key => {
    FEATURE_FLAGS[key] = false;
  });
};

/**
 * Enables all enhanced features
 */
export const enableAllEnhancedFeatures = () => {
  Object.keys(FEATURE_FLAGS).forEach(key => {
    FEATURE_FLAGS[key] = true;
  });
};

/**
 * Feature flag presets for different deployment scenarios
 */
export const FEATURE_PRESETS = {
  // Complete rollback - disable all enhanced features
  ROLLBACK: {
    ENABLE_INDIAN_CULTURAL_PROMPTS: false,
    ENABLE_ENHANCED_RESPONSE_CLEANING: false,
    ENABLE_CULTURAL_RELEVANCE_SCORING: false,
    ENABLE_ADVANCED_DUPLICATE_DETECTION: false,
    ENABLE_LANGUAGE_SIMPLICITY_VALIDATION: false,
    ENABLE_INDIAN_ENGLISH_PATTERNS: false,
    ENABLE_FALLBACK_MECHANISMS: false,
    ENABLE_SESSION_TRACKING: false,
    ENABLE_PROMPT_VARIATION_DIVERSITY: false,
    ENABLE_DETAILED_LOGGING: false,
    ENABLE_PERFORMANCE_MONITORING: false
  },
  
  // Minimal enhancement - only basic cultural prompts
  MINIMAL: {
    ENABLE_INDIAN_CULTURAL_PROMPTS: true,
    ENABLE_ENHANCED_RESPONSE_CLEANING: false,
    ENABLE_CULTURAL_RELEVANCE_SCORING: false,
    ENABLE_ADVANCED_DUPLICATE_DETECTION: false,
    ENABLE_LANGUAGE_SIMPLICITY_VALIDATION: false,
    ENABLE_INDIAN_ENGLISH_PATTERNS: false,
    ENABLE_FALLBACK_MECHANISMS: false,
    ENABLE_SESSION_TRACKING: true,
    ENABLE_PROMPT_VARIATION_DIVERSITY: false,
    ENABLE_DETAILED_LOGGING: false,
    ENABLE_PERFORMANCE_MONITORING: false
  },
  
  // Standard deployment - most features enabled
  STANDARD: {
    ENABLE_INDIAN_CULTURAL_PROMPTS: true,
    ENABLE_ENHANCED_RESPONSE_CLEANING: true,
    ENABLE_CULTURAL_RELEVANCE_SCORING: true,
    ENABLE_ADVANCED_DUPLICATE_DETECTION: true,
    ENABLE_LANGUAGE_SIMPLICITY_VALIDATION: true,
    ENABLE_INDIAN_ENGLISH_PATTERNS: true,
    ENABLE_FALLBACK_MECHANISMS: true,
    ENABLE_SESSION_TRACKING: true,
    ENABLE_PROMPT_VARIATION_DIVERSITY: true,
    ENABLE_DETAILED_LOGGING: false,
    ENABLE_PERFORMANCE_MONITORING: false
  },
  
  // Full deployment - all features enabled including debugging
  FULL: {
    ENABLE_INDIAN_CULTURAL_PROMPTS: true,
    ENABLE_ENHANCED_RESPONSE_CLEANING: true,
    ENABLE_CULTURAL_RELEVANCE_SCORING: true,
    ENABLE_ADVANCED_DUPLICATE_DETECTION: true,
    ENABLE_LANGUAGE_SIMPLICITY_VALIDATION: true,
    ENABLE_INDIAN_ENGLISH_PATTERNS: true,
    ENABLE_FALLBACK_MECHANISMS: true,
    ENABLE_SESSION_TRACKING: true,
    ENABLE_PROMPT_VARIATION_DIVERSITY: true,
    ENABLE_DETAILED_LOGGING: true,
    ENABLE_PERFORMANCE_MONITORING: true
  }
};

/**
 * Applies a feature preset
 * @param {string} presetName - Name of the preset ('ROLLBACK', 'MINIMAL', 'STANDARD', 'FULL')
 */
export const applyFeaturePreset = (presetName) => {
  if (presetName in FEATURE_PRESETS) {
    Object.assign(FEATURE_FLAGS, FEATURE_PRESETS[presetName]);
  }
};

/**
 * Logs current feature flag status (for debugging)
 */
export const logFeatureFlags = () => {
  if (isFeatureEnabled('ENABLE_DETAILED_LOGGING')) {
    // Only log in development mode
    if (import.meta.env.DEV) {
      console.log('🚩 Feature Flags Status:', FEATURE_FLAGS);
    }
  }
};

// Initialize with standard preset by default
applyFeaturePreset('STANDARD');