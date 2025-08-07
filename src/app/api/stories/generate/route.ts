// src/app/api/stories/generate/route.ts
// Story generation API endpoint using OpenRouter

import { NextRequest, NextResponse } from 'next/server'
import { openRouterClient } from '@/lib/ai/openrouter'
import { falClient } from '@/lib/ai/fal'
import { createServerSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

export interface GenerateStoryRequest {
  userInput: string
  storyContext?: {
    childName?: string
    childAge?: number
    storyType?: string
    theme?: string
    artStyle?: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
    pageCount?: 8 | 12 | 16
  }
  // userId is ignored; we derive user from Supabase session
  userId?: string
}

export interface GenerateStoryResponse {
  success: boolean
  story?: string
  images?: string[]
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
    const { userInput, storyContext = {} } = body

    // Validate input
    if (!userInput || userInput.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'User input is required' },
        { status: 400 }
      )
    }

    // Determine page count and style
    const pageCount = (storyContext.pageCount as number) || 8
    // Accept both artStyle and theme from client and normalize to our union type
    const requestedStyle = (storyContext.artStyle || (storyContext as any).theme || 'watercolor') as
      | 'peppa-pig'
      | 'pixi-book'
      | 'watercolor'
      | 'comic'
    const artStyle = requestedStyle
    const storyType = storyContext.storyType === 'realistic' ? 'realistic' : 'fantasy'

    // Generate paginated story using OpenRouter (structured JSON)
    const paged = await openRouterClient.generatePagedStory(userInput, pageCount, storyContext)
    const title = paged.title
    const text_content = paged.pages.map(p => p.text)

    // Generate one image per page (limited concurrency)
    const concurrency = 3
    const image_urls: string[] = new Array(pageCount).fill('')
    // Derive a deterministic seed from userInput to promote visual consistency
    const seed = Math.abs(
      Array.from(userInput).reduce((acc, ch) => ((acc << 5) - acc) + ch.charCodeAt(0), 0)
    ) || Math.floor(Math.random() * 2147483647)

    const styleDescriptor = (style: typeof artStyle): string => {
      switch (style) {
        case 'peppa-pig':
          return 'simple preschool cartoon style, flat colors, minimal shading, thick outlines, rounded characters, bright pastel palette'
        case 'pixi-book':
          return 'European children\'s picture book style, soft watercolor textures, gentle shading, paper grain, warm cozy palette'
        case 'comic':
          return 'comic illustration style, clean ink outlines, flat shading, bold shapes, child-friendly composition'
        case 'watercolor':
        default:
          return 'soft watercolor painting, light paper texture, gentle gradients, warm colors, child-friendly'
      }
    }

    const makePrompt = (pageText: string) => {
      const typeHint = storyType === 'fantasy'
        ? 'fantasy vibe, magical elements, whimsical, vibrant yet soft, child-friendly'
        : 'realistic vibe, natural lighting, gentle and child-friendly'
      const artHint = styleDescriptor(artStyle)
      const noTextRule = 'no text, no letters, no captions, no watermarks, no signage, no subtitles, no logos'
      const consistencyRule = 'keep main character design consistent across all pages (hair, clothing, colors, species)'
      return `Illustration for a children\'s story page: ${pageText}. ${typeHint}. ${artHint}. ${consistencyRule}. ${noTextRule}. High quality, warm colors.`
    }
    const tasks = text_content.map((txt, i) => async () => {
      const prompt = makePrompt(txt)
      const maxRetries = 2
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const resp = await falClient.generateImages({
          prompt,
          image_size: 'square_hd',
          num_inference_steps: 6,
          output_format: 'jpeg',
          enable_safety_checker: true,
          num_images: 1,
          seed: seed + i,
        })
        if (resp.success && resp.images && resp.images[0]) {
          image_urls[i] = resp.images[0]
          return
        }
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)))
      }
      // Fallback placeholder to keep arrays aligned
      image_urls[i] = '/icon-192x192.png'
    })
    // Run with simple concurrency limiter
    for (let i = 0; i < tasks.length; i += concurrency) {
      const batch = tasks.slice(i, i + concurrency).map(fn => fn())
      await Promise.all(batch)
    }

    // Get usage statistics if available
    let usage = undefined
    try {
      // Note: OpenRouter doesn't return usage in the response by default
      // You might need to track this separately or modify the client
    } catch (error) {
      console.warn('Could not get usage statistics:', error)
    }

    // Save story to database if user is authenticated (cookie/session based)
    let saved = false
    try {
      const supabase = await createServerSupabaseClient()
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (!authError && authData?.user?.id) {
        const insertPayload: Database['public']['Tables']['stories']['Insert'] = {
          user_id: authData.user.id,
          text_content,
          image_urls,
          prompt: userInput,
          story_type: storyType as 'realistic' | 'fantasy',
          art_style: artStyle as 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic',
          page_count: pageCount as 8 | 12 | 16,
          created_at: new Date().toISOString(),
        }
        const { error: dbError } = await supabase
          .from('stories')
          .insert(insertPayload)
        if (!dbError) saved = true
        else console.error('Database error:', dbError)
      }
    } catch (error) {
      console.error('Error saving story to database:', error)
    }

    const response = {
      success: true,
      title,
      text_content,
      image_urls,
      usage,
      saved,
      // Backward-compat fields
      story: text_content.join('\n\n'),
      images: image_urls,
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