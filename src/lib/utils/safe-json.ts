/**
 * Safe JSON parsing utilities to prevent crashes from malformed input
 */

/**
 * Safely parse JSON with a fallback value
 * @param str - The string to parse
 * @param fallback - Value to return if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback

  try {
    return JSON.parse(str) as T
  } catch (error) {
    console.warn('Failed to parse JSON:', error)
    return fallback
  }
}

/**
 * Safely stringify JSON with error handling
 * @param value - Value to stringify
 * @param fallback - String to return if stringification fails
 * @returns JSON string or fallback
 */
export function safeJsonStringify(value: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.warn('Failed to stringify JSON:', error)
    return fallback
  }
}
