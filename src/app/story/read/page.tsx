// src/app/story/read/page.tsx
// Story Reading Page - Screen 8 from UI design

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home, BookOpen, Share2 } from 'lucide-react'

export default function StoryReadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [story, setStory] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [storyPages, setStoryPages] = useState<string[]>([])

  useEffect(() => {
    const storyText = searchParams.get('story') || ''
    const storyImages = searchParams.get('images') ? JSON.parse(searchParams.get('images')!) : []
    
    setStory(storyText)
    setImages(storyImages)
    
    // Split story into pages (simplified - in real app you'd have proper pagination)
    const pages = storyText.split('\n\n').filter(page => page.trim().length > 0)
    setStoryPages(pages.length > 0 ? pages : [storyText])
  }, [searchParams])

  const handleNextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(prev => prev + 1)
    } else {
      // End of story - navigate to end screen with story data
      const params = new URLSearchParams({
        story: story,
        images: JSON.stringify(images),
        config: JSON.stringify({
          input: searchParams.get('input') || '',
          mode: searchParams.get('mode') || 'fantasy',
          style: searchParams.get('style') || 'style1',
          length: searchParams.get('length') || 'medium'
        })
      })
      router.push(`/story/end?${params.toString()}`)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleHome = () => {
    router.push('/')
  }

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Mayari Story',
        text: story,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(story)
      alert('Story copied to clipboard!')
    }
  }

  if (storyPages.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF8F0]">
        <div className="text-[#F48FB1] text-6xl mb-4">📖</div>
        <h2 className="text-2xl font-semibold font-['Poppins'] text-[#2C3E50]">
          No story to read
        </h2>
        <button 
          onClick={handleHome}
          className="mt-4 px-6 py-2 rounded-full bg-[#7B9AE0] text-white font-['Poppins'] font-medium"
        >
          Go Home
        </button>
      </div>
    )
  }

  const currentStoryPage = storyPages[currentPage] || story

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-400 text-white font-sans relative overflow-hidden">
      {/* Background Image - Generated or fallback */}
      {images.length > 0 ? (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${images[0]})` }}
        ></div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#7B9AE0] to-[#D4C5F0] opacity-90"></div>
      )}
      
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm z-10 flex justify-between items-center">
        <button 
          onClick={handleHome}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
          <Home size={20} className="text-white" />
        </button>
        <div className="text-center">
          <h1 className="font-['Poppins'] text-sm font-medium">Story</h1>
        </div>
        <button 
          onClick={handleShare}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
        >
          <Share2 size={20} className="text-white" />
        </button>
      </div>

      {/* Story Content */}
      <div className="relative p-8 mt-auto w-full z-10">
        <p className="font-['Georgia'] text-2xl/relaxed text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          {currentStoryPage}
        </p>
      </div>

      {/* Page Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {storyPages.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full transition-all ${
              index <= currentPage ? 'bg-[#F4D03F]' : 'bg-white/50'
            }`}
          ></div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center z-10">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`p-3 rounded-full backdrop-blur-sm transition-all ${
            currentPage === 0 
              ? 'bg-white/10 text-white/30' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        
        <span className="text-white/80 font-['Poppins'] text-sm">
          {currentPage + 1} of {storyPages.length}
        </span>
        
        <button 
          onClick={handleNextPage}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#F4D03F]/20 rounded-full blur-sm"></div>
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-[#7B9AE0]/20 rounded-full blur-sm"></div>
    </div>
  )
} 