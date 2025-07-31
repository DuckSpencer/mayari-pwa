// src/app/api/stories/generate/route.ts
// Story generation API endpoint using OpenRouter

import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase'

export interface GenerateStoryRequest {
  userInput: string
  storyContext?: {
    childName?: string
    childAge?: number
    storyType?: string
    theme?: string
  }
  userId?: string
}

export interface GenerateStoryResponse {
  success: boolean
  story?: string
  error?: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateStoryRequest = await request.json()
    const { userInput, storyContext = {}, userId } = body

    // Validate input
    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'User input is required' },
        { status: 400 }
      )
    }

    // Generate story using OpenRouter
    const story = await openRouterClient.generateStory(userInput, storyContext)

    // Get usage statistics if available
    let usage = undefined
    try {
      // Note: OpenRouter doesn't return usage in the response by default
      // You might need to track this separately or modify the client
    } catch (error) {
      console.warn('Could not get usage statistics:', error)
    }

    // Save story to database if user is authenticated
    if (userId) {
      try {
        const supabase = await createServerSupabaseClient()
        
        const { error: dbError } = await supabase
          .from('stories')
          .insert({
            user_id: userId,
            title: userInput.substring(0, 100), // Use first 100 chars as title
            content: story,
            story_context: storyContext,
            created_at: new Date().toISOString(),
          })

        if (dbError) {
          console.error('Database error:', dbError)
          // Don't fail the request if DB save fails
        }
      } catch (error) {
        console.error('Error saving story to database:', error)
        // Don't fail the request if DB save fails
      }
    }

    const response: GenerateStoryResponse = {
      success: true,
      story,
      usage,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Story generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to generate story: ${errorMessage}` 
      },
      { status: 500 }
    )
  }
}

// Health check for the story generation endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/stories/generate',
    method: 'POST',
    description: 'Generate stories using OpenRouter AI',
  })
} 