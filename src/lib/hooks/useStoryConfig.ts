// src/lib/hooks/useStoryConfig.ts
// Custom hook to parse story configuration from URL search params

import { useMemo } from 'react'
import { safeJsonParse } from '@/lib/utils/safe-json'

export type StoryMode = 'realistic' | 'fantasy'
export type StoryStyle = 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
export type StoryLength = 8 | 12 | 16

export interface StoryConfig {
  input: string
  mode: StoryMode
  style: StoryStyle
  length: StoryLength
}

export interface StoryData {
  story: string
  images: string[]
  config: StoryConfig
}

/**
 * Parse story configuration from URLSearchParams
 * Used across configure, generate, read, and end pages
 */
export function useStoryConfig(searchParams: URLSearchParams): StoryConfig {
  return useMemo(() => {
    const input = searchParams.get('input') || ''
    const mode = (searchParams.get('mode') as StoryMode) || 'fantasy'

    // Parse and validate style
    const rawStyle = searchParams.get('style') || 'watercolor'
    const validStyles: StoryStyle[] = ['peppa-pig', 'pixi-book', 'watercolor', 'comic']
    const style: StoryStyle = validStyles.includes(rawStyle as StoryStyle)
      ? rawStyle as StoryStyle
      : 'watercolor'

    // Parse and validate length
    const rawLength = parseInt(searchParams.get('length') || '12')
    const validLengths: StoryLength[] = [8, 12, 16]
    const length: StoryLength = validLengths.includes(rawLength as StoryLength)
      ? rawLength as StoryLength
      : 12

    return { input, mode, style, length }
  }, [searchParams])
}

/**
 * Parse full story data (story text + images + config) from URLSearchParams
 * Used in read and end pages after story generation
 */
export function useStoryData(searchParams: URLSearchParams): StoryData {
  return useMemo(() => {
    const story = searchParams.get('story') || ''
    const images = safeJsonParse<string[]>(searchParams.get('images'), [])

    const config = safeJsonParse<StoryConfig>(searchParams.get('config'), {
      input: searchParams.get('input') || '',
      mode: (searchParams.get('mode') as StoryMode) || 'fantasy',
      style: (searchParams.get('style') as StoryStyle) || 'watercolor',
      length: parseInt(searchParams.get('length') || '12') as StoryLength
    })

    return { story, images, config }
  }, [searchParams])
}

/**
 * Build URLSearchParams from story config
 * Used when navigating between story pages
 */
export function buildStoryParams(config: Partial<StoryConfig>): URLSearchParams {
  const params = new URLSearchParams()

  if (config.input) params.set('input', config.input)
  if (config.mode) params.set('mode', config.mode)
  if (config.style) params.set('style', config.style)
  if (config.length) params.set('length', String(config.length))

  return params
}

/**
 * Build URLSearchParams including story data for read/end pages
 */
export function buildStoryDataParams(data: Partial<StoryData>): URLSearchParams {
  const params = new URLSearchParams()

  if (data.story) params.set('story', data.story)
  if (data.images) params.set('images', JSON.stringify(data.images))
  if (data.config) params.set('config', JSON.stringify(data.config))

  return params
}
