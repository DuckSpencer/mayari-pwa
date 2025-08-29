// src/app/story/read/page.tsx
// Story Reading Page - Screen 8 from UI design

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Home, BookOpen, Share2 } from 'lucide-react'

export default function StoryReadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [story, setStory] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [storyPages, setStoryPages] = useState<string[]>([])

  const initializedRef = useRef(false)
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const id = searchParams.get('id')
    if (id) {
      // Fetch from API by id
      fetch(`/api/stories/${id}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load story')
          const json = await res.json()
          const data = json?.data
          const texts: string[] = Array.isArray(data?.text_content) ? data.text_content : []
          const imgs: string[] = Array.isArray(data?.image_urls) ? data.image_urls : []
          setImages(imgs)
          setStory(texts.join('\n\n'))
          setStoryPages(texts.length > 0 ? texts : [])
        })
        .catch(() => {
          // Fallback to empty view
          setStory('')
          setStoryPages([])
          setImages([])
        })
      return
    }

    // Legacy: read from query params
    const storyText = searchParams.get('story') || ''
    const storyImages = searchParams.get('images') ? JSON.parse(searchParams.get('images')!) : []
    setStory(storyText)
    setImages(storyImages)
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
    console.log('Home button clicked!') // Debug log
    console.log('Router:', router) // Debug router
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

  const bgUrl = images[currentPage] || images[0] || ''

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-400 text-white font-sans relative overflow-hidden">
      {/* Background Image - Generated or fallback */}
      {bgUrl ? (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${bgUrl})` }}
        ></div>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#7B9AE0] to-[#D4C5F0] opacity-90"></div>
      )}
      
      {/* Navigation Header - SICHERER BEREICH OBEN */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm z-20 flex justify-between items-center">
        <button 
          onClick={handleHome}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-300 border border-white/30 hover:bg-white/35 active:bg-white/40 cursor-pointer pointer-events-auto relative z-30"
          type="button"
        >
          <Home size={20} className="text-white" />
        </button>
        <div className="text-center">
          <h1 className="font-['Poppins'] text-sm font-medium text-white">Story</h1>
          {/* Subtitle with mode/style/length from query */}
          <p className="font-['Poppins'] text-[11px] text-white/70">
            {(searchParams.get('mode') || 'fantasy')} · {(searchParams.get('style') || 'style1')} · {(searchParams.get('length') || 'medium')}
          </p>
        </div>
        <button 
          onClick={handleShare}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm transition-colors duration-300 border border-white/30 hover:bg-white/35 active:bg-white/40 cursor-pointer pointer-events-auto relative z-30"
          type="button"
        >
          <Share2 size={20} className="text-white" />
        </button>
      </div>

      {/* Story Content - NUR BILD, KEIN TEXT */}
      <div className="relative flex-1 flex items-center justify-center w-full z-10">
        {/* Bild wird über den Hintergrund angezeigt, kein zusätzlicher Text-Container */}
      </div>

      {/* SEPARATER TEXT-BEREICH - ÜBER DER NAVIGATION */}
      <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-4 sm:px-8 sm:py-5 bg-black/35 backdrop-blur-md rounded-full border border-white/30 w-[calc(100%-2rem)] sm:w-auto sm:max-w-2xl lg:max-w-3xl shadow-lg">
        <p className="font-['Georgia'] text-lg sm:text-xl/relaxed text-white font-medium text-center break-words leading-tight" style={{
          textShadow: '0 1px 4px rgba(0,0,0,0.8)'
        }}>
          {currentStoryPage}
        </p>
      </div>

      {/* SICHERER BEREICH UNTEN - NUR NAVIGATION UND PAGINATION */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/20 backdrop-blur-sm z-10">
        {/* Navigation Buttons und Pagination Dots - ALLE AUF GLEICHER HÖHE */}
        <div className="flex justify-between items-center">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`p-3 rounded-full backdrop-blur-sm transition-colors duration-300 border border-white/30 ${
              currentPage === 0 
                ? 'bg-white/10 text-white/30 cursor-not-allowed' 
                : 'bg-white/20 text-white hover:bg-white/35 active:bg-white/40'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          
          {/* Pagination Dots - AUF GLEICHER HÖHE WIE BUTTONS */}
          <div className="flex gap-2">
            {storyPages.map((_, index) => (
              <div 
                key={index} 
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentPage ? 'bg-[#F4D03F] shadow-lg' : 'bg-white/50'
                }`}
              ></div>
            ))}
          </div>
          
          <button 
            onClick={handleNextPage}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white transition-colors duration-300 border border-white/30 hover:bg-white/35 active:bg-white/40"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-[#F4D03F]/20 rounded-full blur-sm"></div>
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-[#7B9AE0]/20 rounded-full blur-sm"></div>
    </div>
  )
} 