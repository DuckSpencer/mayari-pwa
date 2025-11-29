// src/lib/rate-limit.ts
// Simple in-memory rate limiter for API endpoints

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (e.g., user ID or IP)
 * @param endpoint - The endpoint being accessed (for separate limits per endpoint)
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${endpoint}:${identifier}`
  const now = Date.now()

  const entry = rateLimitStore.get(key)

  // If no entry or entry has expired, create new window
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    }
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

// Predefined rate limit configs for different endpoints
export const RATE_LIMITS = {
  // Story generation: 10 requests per 15 minutes per user
  storyGeneration: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  // Image generation: 20 requests per 15 minutes per user
  imageGeneration: {
    maxRequests: 20,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },
  // General API: 100 requests per minute per user
  general: {
    maxRequests: 100,
    windowMs: 60 * 1000 // 1 minute
  }
} as const
