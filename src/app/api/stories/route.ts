// app/api/stories/route.ts - Stories API endpoints
import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import type { StoryCreationRequest } from '@/types'

// GET /api/stories - Get user's stories
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch user's stories
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stories' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: stories })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/stories - Create new story
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: StoryCreationRequest = await request.json()
    const { prompt, story_type, art_style, page_count } = body

    // Validate input
    if (!prompt || !story_type || !art_style || !page_count) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create story record
    const { data: story, error } = await supabase
      .from('stories')
      .insert({
        user_id: user.id,
        prompt,
        story_type,
        art_style,
        page_count,
        image_urls: [],
        text_content: [],
        is_public: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create story' },
        { status: 500 }
      )
    }

    // TODO: Trigger AI generation process
    // This will be implemented in the next phase

    return NextResponse.json(
      { 
        data: story,
        message: 'Story creation started. AI generation in progress...' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}