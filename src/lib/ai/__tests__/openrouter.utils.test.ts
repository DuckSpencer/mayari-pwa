// src/lib/ai/__tests__/openrouter.utils.test.ts
import { normalizePagedStory, parseAssistantJson } from '@/lib/ai/openrouter.utils'

describe('openrouter.utils', () => {
  test('parseAssistantJson: parses plain JSON', () => {
    const input = '{"title":"T","pages":[{"text":"A"},{"text":"B"}]}'
    const parsed = parseAssistantJson(input)
    expect(parsed.title).toBe('T')
    expect(parsed.pages?.length).toBe(2)
  })

  test('parseAssistantJson: parses fenced JSON', () => {
    const input = '```json\n{"title":"T","pages":[{"text":"A"}]}\n```'
    const parsed = parseAssistantJson(input)
    expect(parsed.title).toBe('T')
    expect(parsed.pages?.length).toBe(1)
  })

  test('parseAssistantJson: best-effort extracts JSON block', () => {
    const input = 'some text before {"title":"T","pages":[]} some after'
    const parsed = parseAssistantJson(input)
    expect(parsed.title).toBe('T')
  })

  test('normalizePagedStory: enforces pageCount with non-empty strings', () => {
    const draft = { title: 'X', pages: [{ text: 'A' }] }
    const normalized = normalizePagedStory(draft, 3)
    expect(normalized.title).toBe('X')
    expect(normalized.pages.length).toBe(3)
    expect(normalized.pages[0].text).toBe('A')
    expect(normalized.pages[1].text).toBe(' ')
    expect(normalized.pages[2].text).toBe(' ')
  })
})


