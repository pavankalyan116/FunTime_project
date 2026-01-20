/**
 * Integration tests for Indian Jokes Localization
 * Verifies that the enhanced system works with existing functionality
 */

import { describe, it, expect } from 'vitest'
import indianPromptManager, { 
  generateIndianPrompt, 
  validateCulturalContent,
  CULTURAL_ELEMENTS 
} from './indianPromptSystem.js'

describe('Indian Jokes Integration Tests', () => {
  
  it('should generate prompts that maintain backward compatibility', () => {
    // Test both categories work as expected
    const familyPrompt = generateIndianPrompt('family')
    const spicyPrompt = generateIndianPrompt('spicy')
    
    // Both should be valid strings
    expect(typeof familyPrompt).toBe('string')
    expect(typeof spicyPrompt).toBe('string')
    expect(familyPrompt.length).toBeGreaterThan(0)
    expect(spicyPrompt.length).toBeGreaterThan(0)
    
    // Both should contain cultural references
    expect(validateCulturalContent(familyPrompt, 'family')).toBe(true)
    expect(validateCulturalContent(spicyPrompt, 'spicy')).toBe(true)
  })

  it('should work with the prompt manager for diversity', () => {
    const manager = indianPromptManager
    
    // Generate multiple prompts to test diversity
    const prompts = []
    for (let i = 0; i < 3; i++) {
      prompts.push(manager.generateDiversePrompt('family'))
    }
    
    // All should be valid and contain cultural content
    prompts.forEach(prompt => {
      expect(typeof prompt).toBe('string')
      expect(prompt.length).toBeGreaterThan(0)
      expect(validateCulturalContent(prompt, 'family')).toBe(true)
    })
  })

  it('should handle edge cases gracefully', () => {
    // Test with invalid category - should not throw
    expect(() => generateIndianPrompt('invalid')).not.toThrow()
    
    // Test with null session data - should work
    const prompt = generateIndianPrompt('family', null)
    expect(typeof prompt).toBe('string')
    expect(validateCulturalContent(prompt, 'family')).toBe(true)
  })

  it('should maintain all required cultural elements', () => {
    // Verify family elements are comprehensive
    const familyElements = CULTURAL_ELEMENTS.family
    expect(familyElements).toContain('school life')
    expect(familyElements).toContain('parents')
    expect(familyElements).toContain('cricket')
    expect(familyElements).toContain('Bollywood movies')
    expect(familyElements).toContain('family WhatsApp groups')
    
    // Verify adult elements are comprehensive
    const adultElements = CULTURAL_ELEMENTS.adult
    expect(adultElements).toContain('politics')
    expect(adultElements).toContain('work pressure')
    expect(adultElements).toContain('relationships')
    expect(adultElements).toContain('bureaucracy')
  })

  it('should generate prompts with session tracking for anti-caching', () => {
    const prompt = generateIndianPrompt('family')
    
    // Should contain session tracking elements
    const hasSessionTracking = prompt.includes('Session:') || 
                              prompt.includes('Seed:') || 
                              prompt.includes('ID:') || 
                              prompt.includes('Token:') || 
                              prompt.includes('Ref:')
    
    expect(hasSessionTracking).toBe(true)
  })
})