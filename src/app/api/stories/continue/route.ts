// src/app/api/stories/continue/route.ts
// Story continuation API endpoint using OpenRouter

import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase'

export interface ContinueStoryRequest {
  storySoFar: string
  userInput: string
  storyId?: string
  userId?: string
}

export interface ContinueStoryResponse {
  success: boolean
  continuedStory?: string
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
    const body: ContinueStoryRequest = await request.json()
    const { storySoFar, userInput, storyId, userId } = body

    // Validate input
    if (!storySoFar || storySoFar.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Story content is required' },
        { status: 400 }
      )
    }

    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'User input is required' },
        { status: 400 }
      )
    }

    // Continue story using OpenRouter
    const continuedStory = await openRouterClient.continueStory(storySoFar, userInput)

    // Update story in database if user is authenticated and storyId is provided
    if (userId && storyId) {
      try {
        const supabase = await createServerSupabaseClient()

        // Fetch current text_content array
        const { data: current, error: fetchError } = await supabase
          .from('stories')
          .select('text_content')
          .eq('id', storyId)
          .eq('user_id', userId)
          .single()

        if (fetchError) {
          console.error('Error fetching current story:', fetchError)
        } else {
          const prevPages = Array.isArray(current?.text_content) ? current!.text_content : []
          const nextPages = [...prevPages, continuedStory]

          const { error: updateError } = await supabase
            .from('stories')
            .update({ 
              text_content: nextPages,
              updated_at: new Date().toISOString()
            })
            .eq('id', storyId)
            .eq('user_id', userId)

          if (updateError) {
            console.error('Error updating story:', updateError)
            // Don't fail the request if DB update fails
          }
        }
      } catch (error) {
        console.error('Error updating story in database:', error)
        // Don't fail the request if DB update fails
      }
    }

    const response: ContinueStoryResponse = {
      success: true,
      continuedStory,
      usage: undefined, // OpenRouter doesn't return usage by default
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Story continuation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to continue story: ${errorMessage}` 
      },
      { status: 500 }
    )
  }
}

// Health check for the story continuation endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/stories/continue',
    method: 'POST',
    description: 'Continue existing stories using OpenRouter AI',
  })
} 