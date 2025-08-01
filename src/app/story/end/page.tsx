// src/app/story/end/page.tsx
// Story End Screen - Epic 1, Story 1.6 from PRD

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Plus, PenTool, Save, Share2, Download } from 'lucide-react'

interface StoryData {
  story: string
  images: string[]
  config: {
    input: string
    mode: 'realistic' | 'fantasy'
    style: string
    length: string
  }
}

export default function StoryEndPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [storyData, setStoryData] = useState<StoryData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const story = searchParams.get('story') || ''
    const images = searchParams.get('images') ? JSON.parse(searchParams.get('images')!) : []
    const config = searchParams.get('config') ? JSON.parse(searchParams.get('config')!) : {}
    
    setStoryData({ story, images, config })
  }, [searchParams])

  const handleReadAgain = () => {
    if (storyData) {
      const params = new URLSearchParams({
        story: storyData.story,
        images: JSON.stringify(storyData.images)
      })
      router.push(`/story/read?${params.toString()}`)
    }
  }

  const handleNewStory = () => {
    router.push('/story/setup')
  }

  const handleContinueStory = () => {
    if (storyData) {
      const params = new URLSearchParams({
        input: storyData.config.input,
        mode: storyData.config.mode,
        style: storyData.config.style,
        length: storyData.config.length,
        continue: 'true'
      })
      router.push(`/story/configure?${params.toString()}`)
    }
  }

  const handleSave = async () => {
    if (!storyData) return
    
    setIsSaving(true)
    try {
      // Save to localStorage for now (Epic 1 requirement)
      const savedStories = JSON.parse(localStorage.getItem('mayari-stories') || '[]')
      const newStory = {
        id: Date.now().toString(),
        title: storyData.config.input.substring(0, 50),
        story: storyData.story,
        images: storyData.images,
        config: storyData.config,
        createdAt: new Date().toISOString()
      }
      
      savedStories.unshift(newStory)
      localStorage.setItem('mayari-stories', JSON.stringify(savedStories))
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error('Error saving story:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    if (navigator.share && storyData) {
      navigator.share({
        title: 'My Mayari Story',
        text: storyData.story.substring(0, 100) + '...',
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(storyData?.story || '')
      alert('Story copied to clipboard!')
    }
  }

  const handleExport = () => {
    // TODO: Implement PDF export (Epic 2, Story 2.5)
    alert('PDF export coming soon!')
  }

  if (!storyData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8F0]">
        <div className="text-[#F48FB1] text-6xl mb-4">📖</div>
        <h2 className="text-2xl font-semibold font-['Poppins'] text-[#2C3E50]">
          No story data found
        </h2>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2 rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium"
        >
          Go Home
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-[#2C3E50] font-sans bg-[#FFF8F0]">
      {/* Header */}
      <div className="w-full pt-8">
        <h2 className="text-3xl/tight font-semibold font-['Poppins'] text-[#2C3E50] text-center">
          The End
        </h2>
        <p className="text-base font-['Poppins'] text-[#95A5A6] mt-2 text-center">
          What would you like to do next?
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full flex-grow flex flex-col justify-center gap-6">
        {/* Story Preview */}
        <div className="w-full max-w-sm mx-auto">
          <div className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-[#7B9AE0] to-[#D4C5F0] flex items-center justify-center">
            {storyData.images.length > 0 ? (
              <img 
                src={storyData.images[0]} 
                alt="Story preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen size={48} className="text-white/80" />
            )}
          </div>
                                <p className="text-sm font-['Georgia'] text-[#95A5A6] mt-2 text-center">
                        &ldquo;{storyData.config.input.substring(0, 30)}...&rdquo;
                      </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          <button 
            onClick={handleReadAgain}
            className="w-full h-[52px] rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <BookOpen size={20}/> Read Again
          </button>
          
          <button 
            onClick={handleNewStory}
            className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#FF8A65] to-[#F1948A] text-white font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0px_4px_12px_rgba(255,138,101,0.3)]"
          >
            <Plus size={20}/> New Story
          </button>
          
          <button 
            onClick={handleContinueStory}
            className="w-full h-[52px] rounded-full bg-[#F7F1E8] border-2 border-[#7B9AE0] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
          >
            <PenTool size={20}/> Continue Story
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="w-full flex gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 h-[48px] rounded-full flex items-center justify-center gap-2 transition-all ${
              saveSuccess 
                ? 'bg-[#81C784] text-white' 
                : 'bg-[#F7F1E8] text-[#2C3E50] hover:bg-[#D4C5F0]'
            }`}
          >
            <Save size={18}/>
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}
          </button>
          
          <button 
            onClick={handleShare}
            className="flex-1 h-[48px] rounded-full bg-[#F7F1E8] text-[#2C3E50] flex items-center justify-center gap-2 transition-all hover:bg-[#D4C5F0]"
          >
            <Share2 size={18}/> Share
          </button>
          
          <button 
            onClick={handleExport}
            className="flex-1 h-[48px] rounded-full bg-[#F7F1E8] text-[#2C3E50] flex items-center justify-center gap-2 transition-all hover:bg-[#D4C5F0]"
          >
            <Download size={18}/> Export
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full pb-8">
        <button 
          onClick={() => router.push('/')}
          className="w-full h-[48px] rounded-full bg-[#F7F1E8] text-[#2C3E50] font-['Poppins'] font-medium text-base flex items-center justify-center gap-2 transition-transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  )
} 