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

class OpenRouterClient {
  private apiKey: string
  private baseUrl = 'https://openrouter.ai/api/v1'

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Generate text using OpenRouter API
   */
  async generateText(
    messages: OpenRouterMessage[],
    options: Partial<Omit<OpenRouterRequest, 'model' | 'messages'>> = {}
  ): Promise<OpenRouterResponse> {
    const requestBody: OpenRouterRequest = {
      model: 'anthropic/claude-3.5-sonnet',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      ...options,
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient() 