// src/lib/ai/openrouter.utils.ts
// Utilities for parsing and normalizing assistant JSON for paginated children's stories

export interface PagedStoryDraft {
  title?: string
  pages?: Array<{ text?: string }>
}

export interface PagedStoryNormalized {
  title: string
  pages: Array<{ text: string }>
}

/**
 * Extract JSON object from assistant text (handles accidental code fences or pre/post text).
 */
export function parseAssistantJson(text: string): PagedStoryDraft {
  try {
    const trimmed = (text || '').trim()
    // Remove code fences if present
    const fenceMatch = trimmed.match(/```json[\s\S]*?```|```[\s\S]*?```/)
    const candidate = fenceMatch ? fenceMatch[0].replace(/```json|```/g, '').trim() : trimmed
    return JSON.parse(candidate)
  } catch {
    // Last resort: find first JSON-like block
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      try { return JSON.parse(text.slice(start, end + 1)) } catch {}
    }
    return { title: undefined, pages: [] }
  }
}

/**
 * Ensure presence of title and exact pageCount with non-empty strings.
 */
export function normalizePagedStory(
  data: PagedStoryDraft,
  pageCount: number
): PagedStoryNormalized {
  const title = (data.title || 'My Magical Story').toString().slice(0, 120)
  const pages = Array.isArray(data.pages) ? data.pages : []
  const normalizedPages: Array<{ text: string }> = []
  for (let i = 0; i < pageCount; i++) {
    const text = (pages[i]?.text || '').toString().trim()
    normalizedPages.push({ text: text || ' ' })
  }
  return { title, pages: normalizedPages }
}


