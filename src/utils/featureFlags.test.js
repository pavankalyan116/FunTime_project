/**
 * Tests for Feature Flags System
 * Validates backward compatibility and rollback capability
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  FEATURE_FLAGS,
  isFeatureEnabled,
  enableFeature,
  disableFeature,
  getAllFeatureFlags,
  resetFeatureFlagsToDefault,
  disableAllEnhancedFeatures,
  enableAllEnhancedFeatures,
  applyFeaturePreset,
  FEATURE_PRESETS
} from './featureFlags.js'
import {
  generateIndianPrompt,
  processJokeResponse
} from './indianPromptSystem.js'

describe('Feature Flags System', () => {
  
  beforeEach(() => {
    // Reset to standard preset before each test
    applyFeaturePreset('STANDARD')
  })
  
  describe('Basic Feature Flag Operations', () => {
    it('should check if features are enabled correctly', () => {
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('NONEXISTENT_FEATURE')).toBe(false)
    })
    
    it('should enable and disable features correctly', () => {
      disableFeature('ENABLE_INDIAN_CULTURAL_PROMPTS')
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(false)
      
      enableFeature('ENABLE_INDIAN_CULTURAL_PROMPTS')
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
    })
    
    it('should get all feature flags', () => {
      const flags = getAllFeatureFlags()
      expect(flags).toHaveProperty('ENABLE_INDIAN_CULTURAL_PROMPTS')
      expect(flags).toHaveProperty('ENABLE_SESSION_TRACKING')
      expect(typeof flags.ENABLE_INDIAN_CULTURAL_PROMPTS).toBe('boolean')
    })
    
    it('should reset feature flags to default', () => {
      disableAllEnhancedFeatures()
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(false)
      
      resetFeatureFlagsToDefault()
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('ENABLE_DETAILED_LOGGING')).toBe(false) // Debug features stay off
    })
    
    it('should enable and disable all features', () => {
      disableAllEnhancedFeatures()
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(false)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(false)
      
      enableAllEnhancedFeatures()
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(true)
    })
  })
  
  describe('Feature Presets', () => {
    it('should apply ROLLBACK preset correctly', () => {
      applyFeaturePreset('ROLLBACK')
      
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(false)
      expect(isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(false)
    })
    
    it('should apply MINIMAL preset correctly', () => {
      applyFeaturePreset('MINIMAL')
      
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(true)
    })
    
    it('should apply STANDARD preset correctly', () => {
      applyFeaturePreset('STANDARD')
      
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_DETAILED_LOGGING')).toBe(false)
    })
    
    it('should apply FULL preset correctly', () => {
      applyFeaturePreset('FULL')
      
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_DETAILED_LOGGING')).toBe(true)
      expect(isFeatureEnabled('ENABLE_PERFORMANCE_MONITORING')).toBe(true)
    })
  })
  
  describe('Backward Compatibility with Feature Flags', () => {
    it('should generate basic prompts when Indian cultural prompts are disabled', () => {
      applyFeaturePreset('ROLLBACK')
      
      const familyPrompt = generateIndianPrompt('family')
      const spicyPrompt = generateIndianPrompt('spicy')
      
      // Should still return valid prompts
      expect(typeof familyPrompt).toBe('string')
      expect(typeof spicyPrompt).toBe('string')
      expect(familyPrompt.length).toBeGreaterThan(0)
      expect(spicyPrompt.length).toBeGreaterThan(0)
      
      // Should contain basic joke generation instructions
      expect(familyPrompt.toLowerCase()).toContain('joke')
      expect(spicyPrompt.toLowerCase()).toContain('joke')
      
      // Should not contain complex Indian cultural references when disabled
      // (fallback to basic prompts)
      expect(familyPrompt.toLowerCase()).toContain('family-friendly')
      expect(spicyPrompt.toLowerCase()).toContain('adult')
    })
    
    it('should handle session tracking based on feature flag', () => {
      // Test with session tracking enabled
      applyFeaturePreset('STANDARD')
      const promptWithSession = generateIndianPrompt('family')
      expect(promptWithSession).toMatch(/Session:|Seed:|ID:|Token:|Ref:|Time:/)
      
      // Test with session tracking disabled
      applyFeaturePreset('ROLLBACK')
      const promptWithoutSession = generateIndianPrompt('family')
      // Should not contain session tracking when disabled
      expect(promptWithoutSession).not.toMatch(/Session:|Seed:|ID:|Token:|Ref:|Time:/)
    })
    
    it('should process jokes with different feature combinations', () => {
      const rawResponse = 'Here is a joke: Why do Indian parents love WhatsApp? Because they can forward everything!'
      const jokeHistory = ['Previous joke about cricket']
      
      // Test with all features enabled
      applyFeaturePreset('STANDARD')
      const fullResult = processJokeResponse(rawResponse, 'family', jokeHistory)
      
      expect(fullResult).toHaveProperty('cleanedJoke')
      expect(fullResult).toHaveProperty('relevanceScore')
      expect(fullResult.metadata.featuresEnabled.enhancedCleaning).toBe(true)
      expect(fullResult.metadata.featuresEnabled.culturalScoring).toBe(true)
      
      // Test with minimal features
      applyFeaturePreset('MINIMAL')
      const minimalResult = processJokeResponse(rawResponse, 'family', jokeHistory)
      
      expect(minimalResult).toHaveProperty('cleanedJoke')
      expect(minimalResult).toHaveProperty('relevanceScore')
      expect(minimalResult.metadata.featuresEnabled.enhancedCleaning).toBe(false)
      expect(minimalResult.metadata.featuresEnabled.culturalScoring).toBe(false)
      
      // Test with rollback (all features disabled)
      applyFeaturePreset('ROLLBACK')
      const rollbackResult = processJokeResponse(rawResponse, 'family', jokeHistory)
      
      expect(rollbackResult).toHaveProperty('cleanedJoke')
      expect(rollbackResult).toHaveProperty('relevanceScore')
      expect(rollbackResult.metadata.featuresEnabled.enhancedCleaning).toBe(false)
      expect(rollbackResult.metadata.featuresEnabled.culturalScoring).toBe(false)
      expect(rollbackResult.metadata.featuresEnabled.advancedDuplicateDetection).toBe(false)
    })
    
    it('should maintain API compatibility regardless of feature flags', () => {
      const testCases = ['ROLLBACK', 'MINIMAL', 'STANDARD', 'FULL']
      
      testCases.forEach(preset => {
        applyFeaturePreset(preset)
        
        // Test prompt generation API
        const prompt = generateIndianPrompt('family')
        expect(typeof prompt).toBe('string')
        expect(prompt.length).toBeGreaterThan(0)
        
        // Test response processing API
        const result = processJokeResponse('Test joke', 'family', [])
        expect(result).toHaveProperty('cleanedJoke')
        expect(result).toHaveProperty('isDuplicate')
        expect(result).toHaveProperty('isValid')
        expect(result).toHaveProperty('relevanceScore')
        expect(result).toHaveProperty('metadata')
        
        // API should remain consistent
        expect(typeof result.cleanedJoke).toBe('string')
        expect(typeof result.isDuplicate).toBe('boolean')
        expect(typeof result.isValid).toBe('boolean')
        expect(typeof result.relevanceScore).toBe('object')
        expect(typeof result.metadata).toBe('object')
      })
    })
  })
  
  describe('Rollback Capability', () => {
    it('should completely disable enhanced features for rollback', () => {
      // Start with full features
      applyFeaturePreset('FULL')
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      
      // Apply rollback
      applyFeaturePreset('ROLLBACK')
      
      // All enhanced features should be disabled
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(false)
      expect(isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_CULTURAL_RELEVANCE_SCORING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_ADVANCED_DUPLICATE_DETECTION')).toBe(false)
      expect(isFeatureEnabled('ENABLE_LANGUAGE_SIMPLICITY_VALIDATION')).toBe(false)
      expect(isFeatureEnabled('ENABLE_INDIAN_ENGLISH_PATTERNS')).toBe(false)
      expect(isFeatureEnabled('ENABLE_FALLBACK_MECHANISMS')).toBe(false)
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(false)
      expect(isFeatureEnabled('ENABLE_PROMPT_VARIATION_DIVERSITY')).toBe(false)
    })
    
    it('should maintain basic functionality during rollback', () => {
      applyFeaturePreset('ROLLBACK')
      
      // Basic prompt generation should still work
      expect(() => generateIndianPrompt('family')).not.toThrow()
      expect(() => generateIndianPrompt('spicy')).not.toThrow()
      
      const familyPrompt = generateIndianPrompt('family')
      const spicyPrompt = generateIndianPrompt('spicy')
      
      expect(typeof familyPrompt).toBe('string')
      expect(typeof spicyPrompt).toBe('string')
      expect(familyPrompt.length).toBeGreaterThan(10)
      expect(spicyPrompt.length).toBeGreaterThan(10)
      
      // Basic response processing should still work
      expect(() => processJokeResponse('Test joke', 'family', [])).not.toThrow()
      
      const result = processJokeResponse('Test joke', 'family', [])
      expect(result).toHaveProperty('cleanedJoke')
      expect(result).toHaveProperty('isValid')
      expect(result).toHaveProperty('metadata')
    })
    
    it('should allow gradual feature re-enablement after rollback', () => {
      // Start with rollback
      applyFeaturePreset('ROLLBACK')
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(false)
      
      // Gradually enable features
      enableFeature('ENABLE_INDIAN_CULTURAL_PROMPTS')
      expect(isFeatureEnabled('ENABLE_INDIAN_CULTURAL_PROMPTS')).toBe(true)
      expect(isFeatureEnabled('ENABLE_ENHANCED_RESPONSE_CLEANING')).toBe(false)
      
      enableFeature('ENABLE_SESSION_TRACKING')
      expect(isFeatureEnabled('ENABLE_SESSION_TRACKING')).toBe(true)
      
      // Test that partially enabled features work
      const prompt = generateIndianPrompt('family')
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
    })
  })
  
  describe('Feature Flag Error Handling', () => {
    it('should handle invalid feature names gracefully', () => {
      expect(() => isFeatureEnabled('INVALID_FEATURE')).not.toThrow()
      expect(() => enableFeature('INVALID_FEATURE')).not.toThrow()
      expect(() => disableFeature('INVALID_FEATURE')).not.toThrow()
      
      expect(isFeatureEnabled('INVALID_FEATURE')).toBe(false)
    })
    
    it('should handle invalid preset names gracefully', () => {
      const originalFlags = getAllFeatureFlags()
      
      expect(() => applyFeaturePreset('INVALID_PRESET')).not.toThrow()
      
      // Flags should remain unchanged
      const unchangedFlags = getAllFeatureFlags()
      expect(unchangedFlags).toEqual(originalFlags)
    })
  })
})