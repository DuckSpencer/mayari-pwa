// src/app/story/generate/page.tsx
// Story Generation Page - Screen 7 from UI design

'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { HomeButton } from '@/components/HomeButton'

interface GenerationConfig {
  input: string
  mode: 'realistic' | 'fantasy'
  style: 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic'
  length: 8 | 12 | 16
}

function StoryGenerateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [_config, setConfig] = useState<GenerationConfig>({
    input: '',
    mode: 'fantasy',
    style: 'watercolor',
    length: 12
  })

  const [_isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const startedRef = useRef(false)
  const requestIdRef = useRef<string | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      // Clear any running interval on unmount
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    const input = searchParams.get('input') || ''
    const mode = (searchParams.get('mode') as 'realistic' | 'fantasy') || 'fantasy'
    const style = (searchParams.get('style') as 'peppa-pig' | 'pixi-book' | 'watercolor' | 'comic') || 'watercolor'
    const length = parseInt(searchParams.get('length') || '12') as 8 | 12 | 16

    setConfig({ input, mode, style, length })

    // Start generation process
    generateStory({ input, mode, style, length })
  }, [searchParams])

  const generateStory = async (config: GenerationConfig) => {
    try {
      setIsGenerating(true)
      setError(null)
      const myRequestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`
      requestIdRef.current = myRequestId

      // Clear any existing interval before starting a new one
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }

      // Simulate progress with proper ref tracking
      progressIntervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
          }
          return
        }
        setProgress(prev => {
          if (prev >= 90) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
              progressIntervalRef.current = null
            }
            return prev
          }
          return prev + 10
        })
      }, 500)

      // Call API
      const response = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: config.input,
          storyContext: {
            storyType: config.mode,
            artStyle: config.style,
            pageCount: config.length
          }
        }),
      })

      // Clear interval after API call completes
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }

      // Only update state if still mounted
      if (!isMountedRef.current) return
      setProgress(100)

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const data = await response.json()
      // Ignore stale responses if a newer request started
      if (requestIdRef.current !== myRequestId) return
      
      if (data.success && data.story) {
        // Navigate to reading view with story data and images
        const params = new URLSearchParams({
          story: String(data.story),
          input: config.input,
          mode: config.mode,
          style: config.style,
          length: String(config.length),
        })
        
        if (data.images && data.images.length > 0) {
          params.append('images', JSON.stringify(data.images))
        }
        
        router.push(`/story/read?${params.toString()}`)
      } else {
        throw new Error(data.error || 'Failed to generate story')
      }

    } catch (err) {
      // Clear interval on error
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
        progressIntervalRef.current = null
      }
      // Only update state if still mounted
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setIsGenerating(false)
      }
    }
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center font-sans bg-[#FFF8F0]">
        <div className="text-[#F48FB1] text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-semibold font-['Poppins'] text-[#2C3E50] mt-6">
          Oops! Something went wrong.
        </h2>
        <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2">
          {error}
        </p>
        <button 
          onClick={() => router.push('/story/setup')}
          className="mt-8 w-full h-[52px] rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0] relative">
      {/* Home Button */}
      <HomeButton />
      
      {/* Header - mit korrektem Abstand für HomeButton */}
      <div className="w-full pt-16 text-center">
        <h2 className="text-3xl/tight font-semibold font-['Poppins'] text-[#2C3E50] mb-4">
          Creating Your Story
        </h2>
        <p className="text-base font-['Poppins'] text-[#95A5A6]">
          The AI is working its magic...
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mt-8">
        <div className="w-full bg-[#F7F1E8] rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#7B9AE0] to-[#D4C5F0] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-[#95A5A6] mt-2">
          {progress < 30 ? 'Gathering ideas...' : 
           progress < 60 ? 'Creating characters...' : 
           progress < 90 ? 'Writing the story...' : 
           'Almost done...'}
        </p>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-semibold font-['Poppins'] text-[#2C3E50] mt-12">
        The magic is happening...
      </h2>
      <p className="text-base font-['Georgia'] text-[#95A5A6] mt-2">
        A little spark of imagination becomes a story.
      </p>
    </div>
  )
}

export default function StoryGeneratePage() {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-[#F48FB1] text-6xl">✨</div>
      </div>
    }>
      <StoryGenerateContent />
    </Suspense>
  )
}

// Note: Animations moved to globals.css to avoid SSR issues 