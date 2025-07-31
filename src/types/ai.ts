// src/types/ai.ts
// TypeScript types for AI functionality

export interface StoryContext {
  childName?: string
  childAge?: number
  storyType?: string
  theme?: string
  genre?: string
  characters?: string[]
  setting?: string
}

export interface StoryGenerationRequest {
  userInput: string
  storyContext?: StoryContext
  userId?: string
}

export interface StoryGenerationResponse {
  success: boolean
  story?: string
  error?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface StoryContinuationRequest {
  storySoFar: string
  userInput: string
  storyId?: string
  userId?: string
}

export interface StoryContinuationResponse {
  success: boolean
  continuedStory?: string
  error?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface AIUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  cost?: number
}

export interface AIError {
  message: string
  type: string
  code?: number
}

export interface StoryMetadata {
  id: string
  title: string
  content: string
  storyContext?: StoryContext
  createdAt: string
  updatedAt?: string
  userId?: string
  isPublic?: boolean
  tags?: string[]
  wordCount?: number
  readingTime?: number
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  systemPrompt: string
  variables: string[]
  category: 'story' | 'continuation' | 'custom'
  isActive: boolean
}

export interface AIProvider {
  name: 'openrouter' | 'openai' | 'anthropic'
  model: string
  maxTokens: number
  temperature: number
  isActive: boolean
} 