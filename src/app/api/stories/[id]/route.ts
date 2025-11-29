// src/app/api/stories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerSupabaseClient()

    const { id: storyId } = await params
    if (!storyId) {
      return NextResponse.json({ error: 'Story id required' }, { status: 400 })
    }

    // Get authenticated user (may be null)
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth?.user?.id

    // Fetch story; allow if public or owned by user
    const query = supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .limit(1)

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ error: 'Failed to load story' }, { status: 500 })
    }

    const story = data?.[0]
    if (!story) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (!story.is_public && story.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ data: story })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


