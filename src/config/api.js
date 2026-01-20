/**
 * Secure API Configuration
 * 
 * This module handles API configuration securely without exposing sensitive data
 * in the client-side code.
 */

/**
 * Get the API base URL based on environment
 * @returns {string} The API base URL
 */
export const getApiUrl = () => {
  // In production, use the environment variable set during build
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://funtime-project.onrender.com';
  }
  
  // In development, use local server
  return import.meta.env.VITE_API_URL || 'http://localhost:5002';
};

/**
 * Create a secure fetch wrapper that handles API calls
 * @param {string} endpoint - The API endpoint (e.g., '/api/chat')
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} The fetch response
 */
export const secureApiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Add CSRF protection header
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, secureOptions);
    
    // Check response status
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    // Network error occurred
    throw new Error('Network error occurred');
  }
};

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  PERSONALITY: '/api/personality',
  MOOD_DETECT: '/api/mood-detect',
  TRANSCRIBE: '/api/transcribe',
  HEALTH: '/api/health',
};

/**
 * Check if API is available
 * @returns {Promise<boolean>} True if API is available
 */
export const checkApiHealth = async () => {
  try {
    const response = await secureApiCall(API_ENDPOINTS.HEALTH, {
      method: 'GET',
    });
    
    const data = await response.json();
    return data.status === 'OK';
  } catch (error) {
    return false;
  }
};

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  JOKES_PER_MINUTE: 10,
  TRANSCRIPTIONS_PER_HOUR: 20,
  PERSONALITY_PER_MINUTE: 5,
};

/**
 * Simple rate limiter for client-side protection
 */
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }
  
  isAllowed(endpoint, limit, windowMs = 60000) {
    const now = Date.now();
    const key = endpoint;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
}

export const rateLimiter = new RateLimiter();