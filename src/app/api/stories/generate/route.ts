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
    // Authentication check - prevent unauthorized API usage
    const supabaseAuth = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in to generate stories.' },
        { status: 401 }
      )
    }

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

    // Input length validation to prevent abuse
    if (userInput.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Input is too long. Maximum 2000 characters allowed.' },
        { status: 400 }
      )
    }

    // Determine page count and style
    const pageCount = (storyContext.pageCount as number) || 8
    // Accept both artStyle and theme from client; map UI synonyms to supported union
    const artStyleRaw = ((storyContext as any).artStyle || (storyContext as any).theme || 'pixi-book') as string
    const artStyle: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic' = (() => {
      switch ((artStyleRaw || '').toLowerCase()) {
        case 'peppa-pig':
          return 'peppa-pig'
        case 'pixi-book':
          return 'pixi-book'
        case 'comic':
          return 'comic'
        case 'cartoon':
          return 'comic'
        case 'ghibli':
          return 'pixi-book'
        case 'watercolor':
          return 'watercolor'
        default:
          return 'pixi-book'
      }
    })()
    const storyType = storyContext.storyType === 'realistic' ? 'realistic' : 'fantasy'

    // Generate paginated story using OpenRouter (structured JSON)
    const paged = await openRouterClient.generatePagedStory(userInput, pageCount, storyContext)
    // Derive compact story metadata for image prompting
    const meta = await openRouterClient.extractStoryMetadata(paged)
    const cast = await openRouterClient.extractCast(paged)
    const title = paged.title
    const text_content_raw = paged.pages.map(p => p.text)
    // Ensure non-empty page texts so reader pagination and prompts stay valid
    const text_content = text_content_raw.map((t, i) => {
      const s = (t || '').toString().trim()
      if (s.length > 0) return s
      const fallback = (meta.summary || '').toString().trim()
      return fallback ? fallback : `Page ${i + 1}`
    })
    // Visual plan per page to add variety (shot, environment, time of day)
    let visuals = await openRouterClient.planVisuals(paged)
    // Enforce variety if the planner returned too-homogeneous hints
    const enforceVariety = (arr: typeof visuals) => {
      const n = arr.length
      const shots = ['wide','medium','closeup','detail'] as const
      const counts: Record<string, number> = { wide:0, medium:0, closeup:0, detail:0 }
      // First pass: ensure valid shot values and count
      arr = arr.map(v => {
        const shot = (['wide','medium','closeup','detail'] as const).includes(v.shot) ? v.shot : 'medium'
        counts[shot]++
        return { ...v, shot }
      })
      // If any shot type is missing, assign cyclically
      let i = 0
      for (const s of shots) {
        if (counts[s] === 0) {
          arr[i] = { ...arr[i], shot: s }
          i++
        }
      }
      // Guarantee at least ~25% pages without characters for subject-only compositions
      const targetNoChars = Math.max(1, Math.floor(n * 0.25))
      let haveNoChars = arr.filter(v => !v.include_characters).length
      for (let k = 1; haveNoChars < targetNoChars && k < n; k += 3) {
        if (arr[k].include_characters !== false) {
          arr[k] = { ...arr[k], include_characters: false, subjects: arr[k].subjects || 'scene objects only' }
          haveNoChars++
        }
      }
      return arr
    }
    visuals = enforceVariety(visuals)

    // Generate one image per page (limited concurrency)
    const concurrency = 3
    const image_urls: string[] = new Array(pageCount).fill('')
    // Derive a deterministic seed from userInput to promote visual consistency (constant per story)
    let seed = Math.abs(
      Array.from(userInput).reduce((acc, ch) => ((acc << 5) - acc) + ch.charCodeAt(0), 0)
    ) || Math.floor(Math.random() * 2147483647)
    // Clamp to 32-bit range for determinism across providers
    seed = seed % 2147483647

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
          return 'soft watercolor painting, light paper texture, gentle gradients, warm colors, child-friendly; blank, unmarked surfaces; minimal signage or labels'
      }
    }

    // Scene text compaction: aim for <= 200 chars
    const compactScene = (s: string): string => {
      const text = (s || '').replace(/\s+/g, ' ').trim().slice(0, 200)
      if (text) return text
      const fallback = (meta.summary || '').toString().replace(/\s+/g, ' ').trim().slice(0, 200)
      return fallback || 'A gentle, child-friendly moment from the story.'
    }

    // Build Cast-Lock and Negatives (compact)
    const castLines = cast.map(c => `- ${c.name} (${c.role}): ${c.attributes}`.slice(0, 100)).slice(0, 6).join('\n')
    const allowedCharacters = cast.map(c => c.name).join(', ')

    const negatives = [
      // EN
      'no speech bubbles, no talk balloons, no printed text, no large letters, no captions, no signage, no handwriting, no labels, no logos, no signatures, no autographs, no watermarks, no banners, no posters, no stickers, no emojis, no UI, no diagrams, no charts, typography absent, do not write any names (including "Mara")',
      'no price tags, no shop signage, no shelf labels, no sale signs, no brand packaging text, no readable text anywhere',
      // DE
      'keine Sprechblasen, keine Schrift, keine großen Buchstaben, keine Beschriftungen, keine Schilder, keine Handschrift, keine Etiketten, keine Logos, keine Unterschriften, keine Wasserzeichen, keine Banner, keine Poster, keine Sticker, keine Emojis, kein UI, keine Diagramme, keine Tabellen, keine Typografie, keine Namen (inklusive "Mara")',
      'keine Preisschilder, keine Ladenbeschilderung, keine Regaletiketten, keine Sale‑Schilder, keine Marken‑Verpackungstexte, nirgends lesbarer Text',
      // People/animals
      'no extra people, no background people, no partial figures',
      'no animals, no butterflies, no birds, no insects',
      'no glitter, no sparkles, no hearts',
    ].join('; ')

    const characterSheetCompact = meta.character_sheet
      ? meta.character_sheet.split('\n').slice(0, 6).map(line => line.slice(0, 90)).join('\n')
      : undefined

    const basePrefix = [
      `Children's picture book illustration (${artStyle}).`,
      'Art Direction:',
      styleDescriptor(artStyle),
      storyType === 'fantasy' ? 'fantasy, whimsical, warm cozy palette' : 'natural, gentle, child-friendly',
      'Kid-safe, wholesome, fully clothed, neutral eye-level camera, no suggestive pose.',
      negatives,
      characterSheetCompact ? `Character Sheet (use EXACTLY across all pages):\n${characterSheetCompact}` : undefined,
      castLines ? `Allowed Characters Only:\n${castLines}` : undefined,
      'Appearance lock: keep the same face, hair, eyes, skin tone, outfit colors/shapes and proportions for each recurring character on every page; do not redesign characters.',
      'Single scene, not a collage.'
    ].filter(Boolean).join('\n')

    const coreChild = cast.find(c => c.role === 'child')?.name || 'the child'
    const coreAdult = cast.find(c => c.role === 'adult')?.name || 'the adult caregiver'

    const detectSideCharacters = (text: string): string[] => {
      const lower = (text || '').toLowerCase()
      return cast
        .filter(c => c.role === 'other' && c.name)
        .map(c => c.name)
        .filter(name => lower.includes(name.toLowerCase()))
        .slice(0, 1) // keep at most one extra to reduce clutter
    }

    const makePrompt = (pageText: string, i: number) => {
      const scene = compactScene(pageText)
      const v = visuals[i]
      let header: string
      if (v && v.include_characters === false) {
        header = `ONLY ${v.subjects || 'the subjects described below'}. Absolutely no people, no hands, no faces, no characters, no body parts, no reflections. Empty background.`
      } else {
        const side = detectSideCharacters(pageText)
        const visible = [coreChild, coreAdult, ...side]
        header = `EXACTLY ${visible.length} people visible: ${visible.join(' and ')}. No other humans, no background people, no partial figures.`
      }
      const charRule = header
      const visualHints = v ? `Visual: shot=${v.shot}, camera=${v.camera}, time_of_day=${v.time_of_day}, lighting=${v.lighting}${v.environment ? `, environment=${v.environment}` : ''}. ${charRule} Subjects: ${v.subjects}.` : ''
      // Put Scene and Visual first so they never get truncated; append compact base
      const prompt = [`Scene: ${scene}`, visualHints, basePrefix].filter(Boolean).join('\n\n')
      // Allow longer prompts (FAL accepts long strings); cap softly
      return prompt.slice(0, 2400)
    }

    const makeExtraSafePrompt = (pageText: string) => {
      // Replace potentially sensitive pose words with neutral, kid-safe poses
      const normalized = (pageText || '').replace(/kneels?|crouch(?:es)?/gi, 'sits cross‑legged').replace(/pose/gi, 'posture')
      const scene = compactScene(normalized || 'Child stands upright, smiling, eye‑level, relaxed posture in a public park.')
      const extra = basePrefix + '\nKid-safe emphasis: neutral eye-level, sitting or standing, relaxed posture.'
      return `${extra}\n\nScene:\n${scene}`.slice(0, 1200)
    }
    const tasks = text_content.map((txt, i) => async () => {
      let prompt = makePrompt(txt, i)
      console.log(`[images] Page ${i + 1}/${pageCount} seed=${seed} prompt=\n${prompt}`)
      const maxRetries = 2
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const negative = negatives
        const resp = await falClient.generateImages({
          prompt,
          negative_prompt: negative,
          // Use FLUX image_size to really enforce 4:3 instead of square
          image_size: 'landscape_4_3',
          num_inference_steps: 10,
          guidance_scale: 4.0,
          output_format: 'jpeg',
          enable_safety_checker: true,
          num_images: 1,
          // lock seed per story to preserve identity across pages
          seed,
        })
        const nsfw = Array.isArray(resp.has_nsfw_concepts) ? resp.has_nsfw_concepts[0] : false
        if (resp.success && resp.images && resp.images[0] && !nsfw) {
          image_urls[i] = resp.images[0]
          return
        }
        console.warn(`[images] Page ${i + 1} attempt ${attempt + 1} failed or NSFW flagged=${nsfw}. Retrying with safer prompt...`)
        // For next attempt, switch to extra-safe phrasing
        prompt = makeExtraSafePrompt(txt)
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

    // Save story to database (user is already authenticated)
    let saved = false
    try {
      // Reuse the already authenticated supabase client
      const insertPayload: Database['public']['Tables']['stories']['Insert'] = {
        user_id: user.id,
        text_content,
        image_urls,
        prompt: userInput,
        story_type: storyType as 'realistic' | 'fantasy',
        art_style: artStyle as 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic',
        page_count: pageCount as 8 | 12 | 16,
        created_at: new Date().toISOString(),
      }
      const { error: dbError } = await supabaseAuth
        .from('stories')
        .insert(insertPayload)
      if (!dbError) saved = true
      else console.error('Database error:', dbError)
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