// src/app/api/stories/continue/route.ts
// Story continuation API endpoint using OpenRouter

import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient } from '@/lib/ai/openrouter'
import { createServerSupabaseClient } from '@/lib/supabase'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

export interface ContinueStoryRequest {
  storySoFar: string
  userInput: string
  storyId?: string
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
    // Authentication check - prevent unauthorized API usage
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      )
    }

    // Rate limiting check
    const rateLimit = checkRateLimit(user.id, 'story-continuation', RATE_LIMITS.storyGeneration)
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }

    // Parse request body
    const body: ContinueStoryRequest = await request.json()
    const { storySoFar, userInput, storyId } = body

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

    // Input length validation
    if (userInput.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Input is too long. Maximum 2000 characters.' },
        { status: 400 }
      )
    }

    // Continue story using OpenRouter
    const continuedStory = await openRouterClient.continueStory(storySoFar, userInput)

    // Update story in database if storyId is provided (use authenticated user.id)
    if (storyId) {
      try {
        // Fetch current text_content array - use authenticated user.id, not from request
        const { data: current, error: fetchError } = await supabase
          .from('stories')
          .select('text_content')
          .eq('id', storyId)
          .eq('user_id', user.id)
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
            .eq('user_id', user.id)

          if (updateError) {
            console.error('Error updating story:', updateError)
          }
        }
      } catch (error) {
        console.error('Error updating story in database:', error)
      }
    }

    const response: ContinueStoryResponse = {
      success: true,
      continuedStory,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Story continuation error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to continue story. Please try again.' },
      { status: 500 }
    )
  }
}

// Health check for the story continuation endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/stories/continue',
  })
} 