// src/app/story/generate/page.tsx
// Story Generation Page - Screen 7 from UI design

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Star, PenTool } from 'lucide-react'

interface GenerationConfig {
  input: string
  mode: 'realistic' | 'fantasy'
  style: string
  length: string
}

export default function StoryGeneratePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [config, setConfig] = useState<GenerationConfig>({
    input: '',
    mode: 'fantasy',
    style: 'style1',
    length: 'medium'
  })
  
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const startedRef = useRef(false)
  const requestIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    const input = searchParams.get('input') || ''
    const mode = (searchParams.get('mode') as 'realistic' | 'fantasy') || 'fantasy'
    const style = searchParams.get('style') || 'style1'
    const length = searchParams.get('length') || 'medium'
    
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
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
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
            theme: config.style,
            length: config.length
          }
        }),
      })

      clearInterval(progressInterval)
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
          story: data.story,
          input: config.input,
          mode: config.mode,
          style: config.style,
          length: config.length,
        })
        
        if (data.images && data.images.length > 0) {
          params.append('images', JSON.stringify(data.images))
        }
        
        router.push(`/story/read?${params.toString()}`)
      } else {
        throw new Error(data.error || 'Failed to generate story')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsGenerating(false)
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
    <div className="w-full h-full flex flex-col items-center justify-center p-10 text-center font-sans bg-[#FFF8F0] overflow-hidden">
      {/* Animated Elements */}
      <div className="relative w-48 h-48">
        <Star className="text-[#F4D03F] w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 animate-draw-star" />
        <PenTool size={48} className="text-[#7B9AE0] absolute animate-draw-pen" />
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

// Note: Animations moved to globals.css to avoid SSR issues 