// src/lib/ai/openrouter.ts
// OpenRouter API client for AI text generation

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  // OpenAI-compatible JSON mode
  response_format?: { type: 'json_object' } | { type: string }
}

export interface OpenRouterResponse {
  id: string
  choices: Array<{
    index: number
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenRouterError {
  error: {
    message: string
    type: string
    code: number
  }
}

// Internal types for parsed responses
interface VisualPlanItem {
  include_characters?: boolean
  subjects?: string
  shot?: string
  camera?: string
  environment?: string
  time_of_day?: string
  lighting?: string
}

interface CastCharacter {
  name?: string
  role?: string
  attributes?: string
}

class OpenRouterClient {
  private apiKey: string | undefined
  private baseUrl = 'https://openrouter.ai/api/v1'

  constructor() {
    // Defer API key check to runtime to allow build without env vars
    this.apiKey = process.env.OPENROUTER_API_KEY
  }

  /**
   * Ensure API key is available (throws at runtime if missing)
   */
  private ensureApiKey(): string {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required')
    }
    return this.apiKey
  }

  /**
   * Generate text using OpenRouter API
   */
  async generateText(
    messages: OpenRouterMessage[],
    options: Partial<Omit<OpenRouterRequest, 'model' | 'messages'>> = {}
  ): Promise<OpenRouterResponse> {
    const apiKey = this.ensureApiKey()

    const requestBody: OpenRouterRequest = {
      model: 'anthropic/claude-sonnet-4',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options,
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Mayari PWA',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData: OpenRouterError = await response.json()
        throw new Error(`OpenRouter API Error: ${errorData.error.message}`)
      }

      const data: OpenRouterResponse = await response.json()
      return data
    } catch (error) {
      console.error('OpenRouter API Error:', error)
      throw error
    }
  }

  /**
   * Generate a story based on user input
   */
  async generateStory(
    userInput: string,
    storyContext: {
      childName?: string
      childAge?: number
      storyType?: string
      theme?: string
    } = {}
  ): Promise<string> {
    const systemPrompt = `You are a creative children's storyteller. Create engaging, age-appropriate stories that:
- Are suitable for children aged 3-10
- Include positive messages and values
- Are interactive and engaging
- Use simple, clear language
- Include dialogue and descriptive language
- Have a clear beginning, middle, and end
- Are approximately 300-500 words

Story context: ${storyContext.childName ? `Child's name: ${storyContext.childName}` : ''}
${storyContext.childAge ? `Child's age: ${storyContext.childAge}` : ''}
${storyContext.storyType ? `Story type: ${storyContext.storyType}` : ''}
${storyContext.theme ? `Theme: ${storyContext.theme}` : ''}`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput }
    ]

    try {
      const response = await this.generateText(messages, {
        temperature: 0.8,
        max_tokens: 800,
      })

      return response.choices[0]?.message?.content || 'Unable to generate story'
    } catch (error) {
      console.error('Story generation error:', error)
      throw new Error('Failed to generate story')
    }
  }

  /**
   * Continue an existing story
   */
  async continueStory(
    storySoFar: string,
    userInput: string
  ): Promise<string> {
    const systemPrompt = `You are continuing a children's story. Maintain the same style, characters, and tone as the existing story. Keep the story engaging and age-appropriate.`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Story so far:\n\n${storySoFar}\n\nContinue the story based on: ${userInput}` }
    ]

    try {
      const response = await this.generateText(messages, {
        temperature: 0.7,
        max_tokens: 600,
      })

      return response.choices[0]?.message?.content || 'Unable to continue story'
    } catch (error) {
      console.error('Story continuation error:', error)
      throw new Error('Failed to continue story')
    }
  }

  /**
   * Generate a paginated children's story as strict JSON with a fixed number of pages.
   */
  async generatePagedStory(
    userInput: string,
    pageCount: number,
    storyContext: {
      childName?: string
      childAge?: number
      storyType?: string
      theme?: string
    } = {}
  ): Promise<{ title: string; pages: Array<{ text: string }> }> {
    const systemPrompt = `You are an award‑winning picture‑book author and read‑aloud narrator for young children (roughly ages 3–7). Return ONLY valid JSON with this exact shape and no extra text:
{
  "title": string,
  "pages": Array<{ "text": string }>
}
Rules (content):
- Write the story in the same language as the user's input.
- Page 1 opens warmly with a small hook and cozy setting (3–5 sentences), read‑aloud friendly cadence, varied sentence lengths.
- Pages 2..${pageCount} use 2–4 sentences each; keep rhythm natural for read‑aloud (not telegraphic).
- Maintain variety across pages (places, time of day, perspectives) and a gentle arc that resolves by the last page.
- Keep tone kind and child‑safe; allow light sensory details and soft metaphors; avoid baby‑talk.
- Avoid repetition of the same action page after page.
Rules (structure):
- pages.length MUST equal ${pageCount}
- Return ONLY the JSON object above (no comments, no markdown, no extra keys)`

    const contextLines = [
      storyContext.childName ? `Child's name: ${storyContext.childName}` : undefined,
      storyContext.childAge ? `Child's age: ${storyContext.childAge}` : undefined,
      storyContext.storyType ? `Story type: ${storyContext.storyType}` : undefined,
      storyContext.theme ? `Theme: ${storyContext.theme}` : undefined,
    ].filter(Boolean).join('\n')

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${userInput}${contextLines ? `\n\n${contextLines}` : ''}` }
    ]

    // Generous cap: ~6000 tokens or adaptive estimate with buffer
    const estimated = Math.min(6000, Math.max(2000, pageCount * 5 * 40 + 1200))
    const response = await this.generateText(messages, {
      temperature: 0.65,
      max_tokens: estimated,
      presence_penalty: 0.3,
      frequency_penalty: 0.25,
      response_format: { type: 'json_object' },
    })

    const raw = response.choices[0]?.message?.content ?? ''
    const parsed = this.parseAssistantJson(raw)

    const normalized = this.normalizePagedStory(parsed, pageCount)
    return normalized
  }

  /**
   * Extract a compact character sheet and a 1–2 sentence summary from a paged story.
   * Returns plain JSON to be embedded in image prompts for consistency.
   */
  async extractStoryMetadata(paged: { title: string; pages: Array<{ text: string }> }): Promise<{ summary: string; character_sheet: string }> {
    const storyText = [
      `Title: ${paged.title}`,
      ...paged.pages.map((p, i) => `Page ${i + 1}: ${p.text}`)
    ].join('\n')

    const systemPrompt = `You are a helpful assistant extracting concise metadata for children's picture book illustrations. Return ONLY valid JSON with this shape and nothing else:\n{\n  "summary": string,\n  "character_sheet": string\n}\nRules:\n- summary: 1-2 simple sentences covering setting and main goal.\n- character_sheet: 4-8 short bullet-like lines (separated by line breaks), describing stable visual attributes of the main recurring characters (name, age, skin/hair/eye, clothing colors, companions).\n- No markdown, no extra fields.`

    const messages: OpenRouterMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: storyText.slice(0, 4000) } // keep prompt reasonably bounded
    ]

    const response = await this.generateText(messages, {
      temperature: 0.4,
      max_tokens: 400,
    })

    const raw = response.choices[0]?.message?.content ?? ''
    try {
      const parsed = JSON.parse(raw.trim()) as { summary?: string; character_sheet?: string }
      return {
        summary: (parsed.summary || '').toString().slice(0, 320),
        character_sheet: (parsed.character_sheet || '').toString().slice(0, 800),
      }
    } catch {
      // Fallback: derive a naive summary from first and last page; character sheet empty
      const first = paged.pages[0]?.text || ''
      const last = paged.pages[paged.pages.length - 1]?.text || ''
      const summary = `${first} ${last}`.trim().slice(0, 320)
      return { summary, character_sheet: '' }
    }
  }

  /**
   * Plan per-page visuals (shot type, presence of characters, environment, time of day, lighting).
   * Returns an array with length equal to paged.pages.
   */
  async planVisuals(
    paged: { title: string; pages: Array<{ text: string }> },
    opts: { defaultStyle?: string } = {}
  ): Promise<Array<{
    include_characters: boolean
    subjects: string
    shot: 'wide' | 'medium' | 'closeup' | 'detail'
    camera: 'eye-level' | 'low' | 'high'
    environment: string
    time_of_day: 'day' | 'sunset' | 'night' | 'dawn'
    lighting: string
  }>> {
    const system = `You are a storyboard artist for children's picture books. Return ONLY valid JSON with this exact shape and no extra text:\n{ "pages": Array<{\n  "include_characters": boolean,\n  "subjects": string,\n  "shot": "wide" | "medium" | "closeup" | "detail",\n  "camera": "eye-level" | "low" | "high",\n  "environment": string,\n  "time_of_day": "day" | "sunset" | "night" | "dawn",\n  "lighting": string\n}> }\nRules:\n- If the page focuses on objects/nature (e.g., the moon), set include_characters=false and describe only those subjects.\n- Choose varied shots across pages (not all the same).\n- Keep fields short (<= 8 words each).\n- Kid-safe, gentle scenes only.`

    const user = [
      `Title: ${paged.title}`,
      ...paged.pages.map((p, i) => `Page ${i + 1}: ${p.text}`)
    ].join('\n')

    try {
      const resp = await this.generateText([
        { role: 'system', content: system },
        { role: 'user', content: user.slice(0, 4000) }
      ], { temperature: 0.5, max_tokens: 900 })
      const raw = resp.choices[0]?.message?.content ?? ''
      const parsed = JSON.parse(raw.trim()) as { pages?: VisualPlanItem[] }
      const pages = Array.isArray(parsed.pages) ? parsed.pages : []
      // Normalize length
      const validShots = ['wide', 'medium', 'closeup', 'detail'] as const
      const validCameras = ['eye-level', 'low', 'high'] as const
      const validTimes = ['day', 'sunset', 'night', 'dawn'] as const

      return paged.pages.map((_, i) => {
        const item = pages[i] || {}
        const shotStr = item.shot || ''
        const cameraStr = item.camera || ''
        const timeStr = item.time_of_day || ''

        return {
          include_characters: Boolean(item.include_characters),
          subjects: (item.subjects || '').toString().slice(0, 80) || 'main characters',
          shot: validShots.includes(shotStr as typeof validShots[number]) ? shotStr as typeof validShots[number] : 'medium',
          camera: validCameras.includes(cameraStr as typeof validCameras[number]) ? cameraStr as typeof validCameras[number] : 'eye-level',
          environment: (item.environment || '').toString().slice(0, 60),
          time_of_day: validTimes.includes(timeStr as typeof validTimes[number]) ? timeStr as typeof validTimes[number] : 'day',
          lighting: (item.lighting || '').toString().slice(0, 60) || 'soft natural light',
        }
      })
    } catch {
      // Fallback: default medium shot with characters
      return paged.pages.map(() => ({
        include_characters: true,
        subjects: 'main characters',
        shot: 'medium' as const,
        camera: 'eye-level' as const,
        environment: '',
        time_of_day: 'day' as const,
        lighting: 'soft natural light',
      }))
    }
  }

  /**
   * Extract a cast list (stable recurring characters) with short visual attributes.
   */
  async extractCast(paged: { title: string; pages: Array<{ text: string }> }): Promise<Array<{ name: string; role: 'child' | 'adult' | 'other'; attributes: string }>> {
    const system = `You are listing the recurring characters for a children's picture book. Return ONLY valid JSON with this shape:\n{ "characters": Array<{ "name": string, "role": "child" | "adult" | "other", "attributes": string }> }\nRules:\n- attributes: <= 80 chars; include hair/eyes, clothing colors, notable item (e.g., backpack).\n- 1-4 main characters only; do not include animals unless central.`

    const user = [
      `Title: ${paged.title}`,
      ...paged.pages.map((p, i) => `Page ${i + 1}: ${p.text}`)
    ].join('\n')

    try {
      const resp = await this.generateText([
        { role: 'system', content: system },
        { role: 'user', content: user.slice(0, 3500) }
      ], { temperature: 0.4, max_tokens: 500 })
      const raw = resp.choices[0]?.message?.content ?? ''
      const parsed = JSON.parse(raw.trim()) as { characters?: CastCharacter[] }
      const list = Array.isArray(parsed.characters) ? parsed.characters : []
      const validRoles = ['child', 'adult', 'other'] as const
      return list
        .map(c => {
          const roleStr = (c.role || '').toString()
          const role: 'child' | 'adult' | 'other' = validRoles.includes(roleStr as 'child' | 'adult' | 'other')
            ? roleStr as 'child' | 'adult' | 'other'
            : 'other'
          return {
            name: (c.name || '').toString().slice(0, 40),
            role,
            attributes: (c.attributes || '').toString().slice(0, 120)
          }
        })
        .filter(c => c.name)
        .slice(0, 4)
    } catch {
      return []
    }
  }

  /**
   * Extract JSON object from assistant text (handles accidental code fences or pre/post text).
   */
  private parseAssistantJson(text: string): { title?: string; pages?: Array<{ text?: string }> } {
    try {
      const trimmed = text.trim()
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
  private normalizePagedStory(
    data: { title?: string; pages?: Array<{ text?: string }> },
    pageCount: number
  ): { title: string; pages: Array<{ text: string }> } {
    const title = (data.title || 'My Magical Story').toString().slice(0, 120)
    const pages = Array.isArray(data.pages) ? data.pages : []
    const normalizedPages: Array<{ text: string }> = []
    for (let i = 0; i < pageCount; i++) {
      const text = (pages[i]?.text || '').toString().trim()
      normalizedPages.push({ text: text || ' ' })
    }
    return { title, pages: normalizedPages }
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient() 