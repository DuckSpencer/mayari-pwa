// src/lib/utils/__tests__/safe-json.test.ts
import { safeJsonParse } from '../safe-json'

describe('safeJsonParse', () => {
  it('should parse valid JSON', () => {
    const result = safeJsonParse('{"name": "test"}', {})
    expect(result).toEqual({ name: 'test' })
  })

  it('should parse valid JSON arrays', () => {
    const result = safeJsonParse('[1, 2, 3]', [])
    expect(result).toEqual([1, 2, 3])
  })

  it('should return fallback for null input', () => {
    const fallback = { default: true }
    const result = safeJsonParse(null, fallback)
    expect(result).toBe(fallback)
  })

  it('should return fallback for undefined input', () => {
    const fallback = { default: true }
    const result = safeJsonParse(undefined, fallback)
    expect(result).toBe(fallback)
  })

  it('should return fallback for empty string', () => {
    const fallback = { default: true }
    const result = safeJsonParse('', fallback)
    expect(result).toBe(fallback)
  })

  it('should return fallback for invalid JSON', () => {
    const fallback = { default: true }
    const result = safeJsonParse('not valid json', fallback)
    expect(result).toBe(fallback)
  })

  it('should return fallback for malformed JSON objects', () => {
    const fallback: string[] = []
    const result = safeJsonParse('{broken: json}', fallback)
    expect(result).toBe(fallback)
  })

  it('should handle nested objects', () => {
    const input = '{"a": {"b": {"c": 123}}}'
    const result = safeJsonParse(input, {})
    expect(result).toEqual({ a: { b: { c: 123 } } })
  })

  it('should handle arrays of objects', () => {
    const input = '[{"id": 1}, {"id": 2}]'
    const result = safeJsonParse<Array<{ id: number }>>(input, [])
    expect(result).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('should handle URL-encoded JSON (from searchParams)', () => {
    // URL encoding common in searchParams
    const encoded = '["image1.jpg","image2.jpg"]'
    const result = safeJsonParse<string[]>(encoded, [])
    expect(result).toEqual(['image1.jpg', 'image2.jpg'])
  })

  it('should preserve type safety with generics', () => {
    interface TestType {
      name: string
      value: number
    }
    const result = safeJsonParse<TestType>('{"name": "test", "value": 42}', { name: '', value: 0 })
    expect(result.name).toBe('test')
    expect(result.value).toBe(42)
  })

  it('should handle boolean fallbacks', () => {
    const result = safeJsonParse<boolean>('invalid', false)
    expect(result).toBe(false)
  })

  it('should handle number fallbacks', () => {
    const result = safeJsonParse<number>('invalid', 0)
    expect(result).toBe(0)
  })
})
