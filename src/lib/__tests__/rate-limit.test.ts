// src/lib/__tests__/rate-limit.test.ts
import { checkRateLimit, RATE_LIMITS } from '../rate-limit'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset the rate limit store between tests by using unique identifiers
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should allow requests within the limit', () => {
    const userId = `test-user-${Date.now()}`
    const config = { maxRequests: 3, windowMs: 60000 }

    const result1 = checkRateLimit(userId, 'test-endpoint', config)
    expect(result1.allowed).toBe(true)
    expect(result1.remaining).toBe(2)

    const result2 = checkRateLimit(userId, 'test-endpoint', config)
    expect(result2.allowed).toBe(true)
    expect(result2.remaining).toBe(1)

    const result3 = checkRateLimit(userId, 'test-endpoint', config)
    expect(result3.allowed).toBe(true)
    expect(result3.remaining).toBe(0)
  })

  it('should block requests over the limit', () => {
    const userId = `test-user-blocked-${Date.now()}`
    const config = { maxRequests: 2, windowMs: 60000 }

    // Use up the limit
    checkRateLimit(userId, 'test-endpoint', config)
    checkRateLimit(userId, 'test-endpoint', config)

    // This should be blocked
    const result = checkRateLimit(userId, 'test-endpoint', config)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset after the window expires', () => {
    const userId = `test-user-reset-${Date.now()}`
    const config = { maxRequests: 1, windowMs: 1000 }

    // Use up the limit
    const result1 = checkRateLimit(userId, 'test-endpoint', config)
    expect(result1.allowed).toBe(true)

    // Should be blocked
    const result2 = checkRateLimit(userId, 'test-endpoint', config)
    expect(result2.allowed).toBe(false)

    // Advance time past the window
    jest.advanceTimersByTime(1100)

    // Should be allowed again
    const result3 = checkRateLimit(userId, 'test-endpoint', config)
    expect(result3.allowed).toBe(true)
  })

  it('should track different endpoints separately', () => {
    const userId = `test-user-endpoints-${Date.now()}`
    const config = { maxRequests: 1, windowMs: 60000 }

    const result1 = checkRateLimit(userId, 'endpoint-a', config)
    expect(result1.allowed).toBe(true)

    // Should be blocked for endpoint-a
    const result2 = checkRateLimit(userId, 'endpoint-a', config)
    expect(result2.allowed).toBe(false)

    // Should be allowed for endpoint-b
    const result3 = checkRateLimit(userId, 'endpoint-b', config)
    expect(result3.allowed).toBe(true)
  })

  it('should track different users separately', () => {
    const config = { maxRequests: 1, windowMs: 60000 }

    const result1 = checkRateLimit('user-a-' + Date.now(), 'same-endpoint', config)
    expect(result1.allowed).toBe(true)

    const result2 = checkRateLimit('user-b-' + Date.now(), 'same-endpoint', config)
    expect(result2.allowed).toBe(true)
  })

  it('should return correct reset time', () => {
    const userId = `test-user-time-${Date.now()}`
    const config = { maxRequests: 1, windowMs: 60000 }

    const before = Date.now()
    const result = checkRateLimit(userId, 'test-endpoint', config)

    expect(result.resetTime).toBeGreaterThanOrEqual(before + config.windowMs)
    expect(result.resetTime).toBeLessThanOrEqual(before + config.windowMs + 100)
  })

  describe('RATE_LIMITS presets', () => {
    it('should have story generation config', () => {
      expect(RATE_LIMITS.storyGeneration).toBeDefined()
      expect(RATE_LIMITS.storyGeneration.maxRequests).toBe(10)
      expect(RATE_LIMITS.storyGeneration.windowMs).toBe(15 * 60 * 1000)
    })

    it('should have image generation config', () => {
      expect(RATE_LIMITS.imageGeneration).toBeDefined()
      expect(RATE_LIMITS.imageGeneration.maxRequests).toBe(20)
      expect(RATE_LIMITS.imageGeneration.windowMs).toBe(15 * 60 * 1000)
    })

    it('should have general API config', () => {
      expect(RATE_LIMITS.general).toBeDefined()
      expect(RATE_LIMITS.general.maxRequests).toBe(100)
      expect(RATE_LIMITS.general.windowMs).toBe(60 * 1000)
    })
  })
})
